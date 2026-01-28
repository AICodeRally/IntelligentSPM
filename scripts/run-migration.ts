#!/usr/bin/env npx tsx
/**
 * Run RAG tables migration
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('[Migration] Creating RAG tables...');

  // Enable pgvector extension
  try {
    await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS vector;`);
    console.log('[Migration] pgvector extension enabled');
  } catch (e) {
    console.log('[Migration] pgvector extension already exists or error:', e);
  }

  // Create knowledge_chunks table
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "knowledge_chunks" (
          "id" UUID NOT NULL DEFAULT gen_random_uuid(),
          "card_id" TEXT NOT NULL,
          "keyword" TEXT NOT NULL,
          "content" TEXT NOT NULL,
          "pillar" TEXT NOT NULL,
          "category" TEXT NOT NULL,
          "card_type" TEXT NOT NULL,
          "tags" TEXT[],
          "embedding" vector(1536),
          "embedding_model" TEXT,
          "content_hash" TEXT NOT NULL,
          "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "knowledge_chunks_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('[Migration] knowledge_chunks table created');
  } catch (e) {
    console.log('[Migration] knowledge_chunks already exists or error:', e);
  }

  // Create ask_queries table
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ask_queries" (
          "id" UUID NOT NULL DEFAULT gen_random_uuid(),
          "query_text" TEXT NOT NULL,
          "response_text" TEXT,
          "top_k" INTEGER NOT NULL DEFAULT 5,
          "result_count" INTEGER,
          "matched_chunks" JSONB,
          "embedding_model" TEXT,
          "llm_model" TEXT,
          "llm_provider" TEXT,
          "user_id" UUID,
          "email" TEXT,
          "ip_address" TEXT,
          "embedding_time_ms" INTEGER,
          "search_time_ms" INTEGER,
          "llm_time_ms" INTEGER,
          "total_time_ms" INTEGER,
          "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "ask_queries_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log('[Migration] ask_queries table created');
  } catch (e) {
    console.log('[Migration] ask_queries already exists or error:', e);
  }

  // Create indexes
  const indexes = [
    `CREATE UNIQUE INDEX IF NOT EXISTS "knowledge_chunks_content_hash_key" ON "knowledge_chunks"("content_hash")`,
    `CREATE INDEX IF NOT EXISTS "knowledge_chunks_card_id_idx" ON "knowledge_chunks"("card_id")`,
    `CREATE INDEX IF NOT EXISTS "knowledge_chunks_pillar_idx" ON "knowledge_chunks"("pillar")`,
    `CREATE INDEX IF NOT EXISTS "knowledge_chunks_keyword_idx" ON "knowledge_chunks"("keyword")`,
    `CREATE INDEX IF NOT EXISTS "ask_queries_user_id_idx" ON "ask_queries"("user_id")`,
    `CREATE INDEX IF NOT EXISTS "ask_queries_created_at_idx" ON "ask_queries"("created_at")`,
  ];

  for (const idx of indexes) {
    try {
      await prisma.$executeRawUnsafe(idx);
    } catch (e) {
      // Ignore if exists
    }
  }
  console.log('[Migration] Indexes created');

  // Create vector index (IVFFlat)
  try {
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "knowledge_chunks_embedding_idx" ON "knowledge_chunks"
      USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100)
    `);
    console.log('[Migration] Vector index created');
  } catch (e) {
    console.log('[Migration] Vector index already exists or error:', e);
  }

  console.log('[Migration] Complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
