/**
 * AskSPM RAG Service
 * Vector search + LLM generation for SPM domain questions
 */

import { prisma } from '@/lib/db/prisma';
import {
  generateEmbeddings,
  embeddingToVector,
  normalizeEmbedding,
  isOllamaAvailable,
} from './embedding.service';

// Target dimensions (matching schema for nomic-embed-text)
const TARGET_DIMS = 768;

interface SearchResult {
  chunkId: string;
  cardId: string;
  keyword: string;
  content: string;
  pillar: string;
  category: string;
  score: number;
}

interface AskSPMRequest {
  query: string;
  topK?: number;
  similarityThreshold?: number;
  userId?: string;
  email?: string;
  ipAddress?: string;
}

interface AskSPMResponse {
  queryId: string;
  query: string;
  answer: string;
  sources: SearchResult[];
  timing: {
    embeddingMs: number;
    searchMs: number;
    llmMs: number;
    totalMs: number;
  };
  model: {
    embedding: string;
    llm: string;
    provider: string;
  };
}

/**
 * Search knowledge base for similar chunks
 */
export async function searchKnowledgeBase(
  queryEmbedding: number[],
  topK: number = 5,
  threshold: number = 0.5
): Promise<SearchResult[]> {
  const normalizedEmbedding = normalizeEmbedding(queryEmbedding, TARGET_DIMS);
  const vectorStr = embeddingToVector(normalizedEmbedding);

  // Use pgvector cosine similarity search
  // Note: <=> is cosine distance, so similarity = 1 - distance
  const results = await prisma.$queryRaw<
    Array<{
      id: string;
      card_id: string;
      keyword: string;
      content: string;
      pillar: string;
      category: string;
      similarity: number;
    }>
  >`
    SELECT
      id,
      card_id,
      keyword,
      content,
      pillar,
      category,
      1 - (embedding <=> ${vectorStr}::vector) as similarity
    FROM knowledge_chunks
    WHERE embedding IS NOT NULL
      AND 1 - (embedding <=> ${vectorStr}::vector) >= ${threshold}
    ORDER BY embedding <=> ${vectorStr}::vector
    LIMIT ${topK}
  `;

  return results.map((row) => ({
    chunkId: row.id,
    cardId: row.card_id,
    keyword: row.keyword,
    content: row.content,
    pillar: row.pillar,
    category: row.category,
    score: Number(row.similarity),
  }));
}

/**
 * Generate LLM response using retrieved context
 * Tries Ollama first (free), falls back to OpenAI
 */
async function generateLLMResponse(
  query: string,
  context: SearchResult[]
): Promise<{ answer: string; model: string; provider: string; timeMs: number }> {
  const startTime = Date.now();

  // Build context from search results
  const contextText = context
    .map((c, i) => `[${i + 1}] ${c.keyword} (${c.pillar}/${c.category}):\n${c.content}`)
    .join('\n\n');

  const systemPrompt = `You are The Toddfather's SPM Expert - a knowledgeable assistant specializing in Sales Performance Management (SPM), Incentive Compensation Management (ICM), sales governance, and related topics.

Use the following knowledge base context to answer the user's question. If the context doesn't contain relevant information, say so but try to provide general guidance based on SPM best practices.

CONTEXT FROM SPM KNOWLEDGE BASE:
${contextText}

Guidelines:
- Be concise but comprehensive
- Reference specific concepts from the context when applicable
- Use the exact terminology from the SPM domain
- If asked about policies or governance, emphasize the importance of proper documentation
- When discussing ICM topics, consider both plan design and operational aspects`;

  // Try Ollama first
  const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const ollamaAvailable = await isOllamaAvailable(ollamaUrl);

  if (ollamaAvailable) {
    try {
      const response = await fetch(`${ollamaUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: process.env.OLLAMA_MODEL || 'llama3',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query },
          ],
          stream: false,
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as { message: { content: string } };
        return {
          answer: data.message.content,
          model: process.env.OLLAMA_MODEL || 'llama3',
          provider: 'ollama',
          timeMs: Date.now() - startTime,
        };
      }
    } catch {
      console.warn('[AskSPM] Ollama failed, falling back to OpenAI');
    }
  }

  // Fallback to OpenAI
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    throw new Error('No LLM provider available (Ollama down, no OpenAI key)');
  }

  const { default: OpenAI } = await import('openai');
  const client = new OpenAI({ apiKey: openaiKey });

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: query },
    ],
    temperature: 0.7,
    max_tokens: 1024,
  });

  return {
    answer: completion.choices[0]?.message?.content || 'No response generated',
    model: process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini',
    provider: 'openai',
    timeMs: Date.now() - startTime,
  };
}

/**
 * Main AskSPM function - RAG pipeline
 */
export async function askSPM(request: AskSPMRequest): Promise<AskSPMResponse> {
  const totalStart = Date.now();
  const topK = request.topK || 5;
  const threshold = request.similarityThreshold || 0.3;

  // Step 1: Generate query embedding
  const embeddingStart = Date.now();
  const embeddingResult = await generateEmbeddings([request.query]);
  const embeddingMs = Date.now() - embeddingStart;

  // Step 2: Search knowledge base
  const searchStart = Date.now();
  const searchResults = await searchKnowledgeBase(
    embeddingResult.embeddings[0],
    topK,
    threshold
  );
  const searchMs = Date.now() - searchStart;

  // Step 3: Generate LLM response
  const llmResult = await generateLLMResponse(request.query, searchResults);

  const totalMs = Date.now() - totalStart;

  // Step 4: Log query for analytics
  const queryRecord = await prisma.askQuery.create({
    data: {
      queryText: request.query,
      responseText: llmResult.answer,
      topK,
      resultCount: searchResults.length,
      matchedChunks: searchResults.map((r) => ({ chunkId: r.chunkId, score: r.score })),
      embeddingModel: embeddingResult.model,
      llmModel: llmResult.model,
      llmProvider: llmResult.provider,
      userId: request.userId,
      email: request.email,
      ipAddress: request.ipAddress,
      embeddingTimeMs: embeddingMs,
      searchTimeMs: searchMs,
      llmTimeMs: llmResult.timeMs,
      totalTimeMs: totalMs,
    },
  });

  return {
    queryId: queryRecord.id,
    query: request.query,
    answer: llmResult.answer,
    sources: searchResults,
    timing: {
      embeddingMs,
      searchMs,
      llmMs: llmResult.timeMs,
      totalMs,
    },
    model: {
      embedding: embeddingResult.model,
      llm: llmResult.model,
      provider: llmResult.provider,
    },
  };
}

/**
 * Get knowledge base stats
 */
export async function getKnowledgeBaseStats(): Promise<{
  totalChunks: number;
  embeddedChunks: number;
  pillarCounts: Record<string, number>;
}> {
  const totalChunks = await prisma.knowledgeChunk.count();

  // Count embedded chunks (has embedding)
  const embeddedChunks = await prisma.$queryRaw<[{ count: bigint }]>`
    SELECT COUNT(*) as count FROM knowledge_chunks WHERE embedding IS NOT NULL
  `;

  // Get counts by pillar
  const pillarRows = await prisma.knowledgeChunk.groupBy({
    by: ['pillar'],
    _count: { pillar: true },
  });

  const pillarCounts: Record<string, number> = {};
  for (const row of pillarRows) {
    pillarCounts[row.pillar] = row._count.pillar;
  }

  return {
    totalChunks,
    embeddedChunks: Number(embeddedChunks[0]?.count || 0),
    pillarCounts,
  };
}
