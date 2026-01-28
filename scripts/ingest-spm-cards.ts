#!/usr/bin/env npx tsx
/**
 * Ingest SPM Knowledge Cards into pgvector
 *
 * Usage:
 *   DATABASE_URL="..." npx tsx scripts/ingest-spm-cards.ts
 *
 * Optional env:
 *   OPENAI_API_KEY - For OpenAI embeddings (recommended)
 *   OLLAMA_BASE_URL - For Ollama embeddings (http://localhost:11434)
 *   BATCH_SIZE - Number of cards to process per batch (default: 10)
 */

import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';
import { PrismaClient } from '@prisma/client';
import {
  generateEmbeddings,
  embeddingToVector,
  normalizeEmbedding,
  getEmbeddingConfig,
} from '../src/lib/services/embedding.service';

const prisma = new PrismaClient();

// Target dimensions (matching schema for nomic-embed-text)
const TARGET_DIMS = 768;

interface KBCard {
  id: string;
  cardId: string;
  keyword: string;
  chunkType: string;
  content: string;
  metadata: {
    pillar: string;
    category: string;
    cardType: string;
    tags: string[];
  };
}

interface KBFile {
  version: string;
  generatedAt: string;
  totalChunks: number;
  pillarCounts: Record<string, number>;
  chunks: KBCard[];
}

function generateContentHash(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

async function main() {
  console.log('[SPM KB Ingest] Starting...');

  // Determine embedding config
  const embeddingConfig = getEmbeddingConfig();
  console.log(`[SPM KB Ingest] Using ${embeddingConfig.provider} with model ${embeddingConfig.model}`);

  // Load the knowledge cards
  const cardsPath = path.join(__dirname, '../src/data/spm-kb-cards.json');
  console.log(`[SPM KB Ingest] Loading cards from: ${cardsPath}`);

  if (!fs.existsSync(cardsPath)) {
    throw new Error(`Knowledge cards file not found: ${cardsPath}`);
  }

  const kbFile: KBFile = JSON.parse(fs.readFileSync(cardsPath, 'utf-8'));
  console.log(`[SPM KB Ingest] Found ${kbFile.totalChunks} cards`);
  console.log('[SPM KB Ingest] Pillar distribution:', kbFile.pillarCounts);

  // Check for existing chunks
  const existingCount = await prisma.knowledgeChunk.count();
  console.log(`[SPM KB Ingest] Existing chunks in DB: ${existingCount}`);

  // Process in batches
  const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '10', 10);
  let created = 0;
  let skipped = 0;
  let errors = 0;

  const chunks = kbFile.chunks;
  const totalBatches = Math.ceil(chunks.length / BATCH_SIZE);

  for (let batchNum = 0; batchNum < totalBatches; batchNum++) {
    const start = batchNum * BATCH_SIZE;
    const end = Math.min(start + BATCH_SIZE, chunks.length);
    const batch = chunks.slice(start, end);

    console.log(`[SPM KB Ingest] Processing batch ${batchNum + 1}/${totalBatches} (${batch.length} cards)`);

    // Check which cards already exist
    const contentHashes = batch.map((c) => generateContentHash(c.content));
    const existingHashes = new Set(
      (
        await prisma.knowledgeChunk.findMany({
          where: { contentHash: { in: contentHashes } },
          select: { contentHash: true },
        })
      ).map((c) => c.contentHash)
    );

    // Filter to only new cards
    const newCards = batch.filter((c) => !existingHashes.has(generateContentHash(c.content)));
    skipped += batch.length - newCards.length;

    if (newCards.length === 0) {
      console.log(`[SPM KB Ingest] Batch ${batchNum + 1}: All ${batch.length} cards already exist, skipping`);
      continue;
    }

    try {
      // Generate embeddings for new cards
      const texts = newCards.map((c) => `${c.keyword}: ${c.content}`);
      const embeddingResult = await generateEmbeddings(texts);

      // Insert cards with embeddings
      for (let i = 0; i < newCards.length; i++) {
        const card = newCards[i];
        const embedding = normalizeEmbedding(embeddingResult.embeddings[i], TARGET_DIMS);
        const vectorStr = embeddingToVector(embedding);
        const contentHash = generateContentHash(card.content);

        try {
          // Use raw SQL for vector insert (Prisma doesn't support vector type directly)
          await prisma.$executeRaw`
            INSERT INTO knowledge_chunks (
              id, card_id, keyword, content, pillar, category, card_type, tags,
              embedding, embedding_model, content_hash, created_at, updated_at
            ) VALUES (
              gen_random_uuid(),
              ${card.cardId},
              ${card.keyword},
              ${card.content},
              ${card.metadata.pillar},
              ${card.metadata.category},
              ${card.metadata.cardType},
              ${card.metadata.tags}::text[],
              ${vectorStr}::vector,
              ${embeddingResult.model},
              ${contentHash},
              NOW(),
              NOW()
            )
            ON CONFLICT (content_hash) DO NOTHING
          `;
          created++;
        } catch (insertError) {
          console.error(`[SPM KB Ingest] Failed to insert card ${card.cardId}:`, insertError);
          errors++;
        }
      }

      console.log(`[SPM KB Ingest] Batch ${batchNum + 1}: Created ${newCards.length} chunks`);
    } catch (batchError) {
      console.error(`[SPM KB Ingest] Batch ${batchNum + 1} failed:`, batchError);
      errors += newCards.length;
    }

    // Small delay between batches to avoid rate limiting
    if (embeddingConfig.provider === 'openai' && batchNum < totalBatches - 1) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  console.log('[SPM KB Ingest] Complete!');
  console.log(`  Created: ${created}`);
  console.log(`  Skipped (existing): ${skipped}`);
  console.log(`  Errors: ${errors}`);

  // Final count
  const finalCount = await prisma.knowledgeChunk.count();
  console.log(`  Total chunks in DB: ${finalCount}`);
}

main()
  .catch((error) => {
    console.error('[SPM KB Ingest] Fatal error:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
