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
import {
  searchAnswerLibrary,
  saveToAnswerLibrary,
} from './answer-library.service';
import {
  getOrCreateSession,
  addMessageExchange,
  getConversationHistory,
} from './conversation.service';
import {
  recordAudit,
  userActor,
  systemActor,
  isGOCCConfigured,
} from '@/lib/gocc';

// Target dimensions (matching schema for nomic-embed-text)
const TARGET_DIMS = 768;

// ============================================================================
// EXPORTED TYPES
// ============================================================================

export interface SearchResult {
  chunkId: string;
  cardId: string;
  keyword: string;
  content: string;
  pillar: string;
  category: string;
  score: number;
}

export interface AskSPMRequest {
  query: string;
  topK?: number;
  similarityThreshold?: number;
  userId?: string;
  email?: string;
  ipAddress?: string;
  sessionToken?: string;
}

export interface AskSPMResponse {
  queryId: string;
  query: string;
  answer: string;
  sources: SearchResult[];
  timing: {
    embeddingMs: number;
    libraryMs?: number;  // Time to search answer library (cache lookup)
    searchMs: number;
    llmMs: number;
    totalMs: number;
  };
  model: {
    embedding: string;
    llm: string;
    provider: string;
  };
  // Answer Library fields
  fromLibrary?: boolean;
  libraryAnswerId?: string;
  sessionToken?: string;
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
 * Priority: Gateway > Ollama (free) > OpenAI
 */
async function generateLLMResponse(
  query: string,
  context: SearchResult[],
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
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
- When discussing ICM topics, consider both plan design and operational aspects
- If this is a follow-up question, maintain context from the conversation history`;

  // Build messages array with conversation history
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory,
    { role: 'user', content: query },
  ];

  // Try AICR Gateway first if configured
  const gatewayUrl = process.env.AICR_GATEWAY_URL;
  const gatewayApiKey = process.env.AICR_API_KEY;

  if (gatewayUrl && gatewayApiKey) {
    try {
      const response = await fetch(`${gatewayUrl}/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${gatewayApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: process.env.GATEWAY_CHAT_MODEL || 'gpt-4o-mini',
          messages,
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as {
          model: string;
          choices: Array<{ message: { content: string } }>;
        };
        return {
          answer: data.choices[0]?.message?.content || 'No response generated',
          model: data.model,
          provider: 'gateway',
          timeMs: Date.now() - startTime,
        };
      }
    } catch (error) {
      console.warn('[AskSPM] Gateway failed, falling back to local providers:', error);
    }
  }

  // Try Ollama second (free, local)
  const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const ollamaAvailable = await isOllamaAvailable(ollamaUrl);

  if (ollamaAvailable) {
    try {
      const response = await fetch(`${ollamaUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: process.env.OLLAMA_MODEL || 'llama3',
          messages,
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
    throw new Error('No LLM provider available (Gateway down, Ollama down, no OpenAI key)');
  }

  const { default: OpenAI } = await import('openai');
  const client = new OpenAI({ apiKey: openaiKey });

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini',
    messages,
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
 * Main AskSPM function - RAG pipeline with Answer Library caching
 */
export async function askSPM(request: AskSPMRequest): Promise<AskSPMResponse> {
  const totalStart = Date.now();
  const topK = request.topK || 5;
  const threshold = request.similarityThreshold || 0.3;

  // Step 0: Get or create conversation session
  const session = await getOrCreateSession(request.sessionToken, request.userId);
  const conversationHistory = await getConversationHistory(session.sessionToken);

  // Step 1: Generate query embedding
  const embeddingStart = Date.now();
  const embeddingResult = await generateEmbeddings([request.query]);
  const embeddingMs = Date.now() - embeddingStart;

  // Step 2: Check Answer Library for cached response (semantic cache)
  const libraryStart = Date.now();
  const libraryMatch = await searchAnswerLibrary(embeddingResult.embeddings[0]);
  const libraryMs = Date.now() - libraryStart;

  if (libraryMatch) {
    // Cache hit - return cached answer immediately
    const totalMs = Date.now() - totalStart;

    // Log the cache hit for analytics
    const queryRecord = await prisma.askQuery.create({
      data: {
        queryText: request.query,
        responseText: libraryMatch.answerText,
        topK,
        resultCount: 0, // Cache hit - no KB search
        matchedChunks: [],
        embeddingModel: embeddingResult.model,
        llmModel: 'cache',
        llmProvider: 'answer_library',
        userId: request.userId,
        email: request.email,
        ipAddress: request.ipAddress,
        embeddingTimeMs: embeddingMs,
        searchTimeMs: libraryMs,
        llmTimeMs: 0,
        totalTimeMs: totalMs,
      },
    });

    console.log(`[AskSPM] Cache hit! Similarity: ${libraryMatch.similarity.toFixed(3)}, Uses: ${libraryMatch.useCount}`);

    // Save exchange to conversation history (cache hits count too)
    await addMessageExchange(session.sessionToken, request.query, libraryMatch.answerText);

    // Record cache hit to AICR Spine for telemetry
    if (isGOCCConfigured()) {
      await recordAudit(
        'askspm.query',
        {
          queryId: queryRecord.id,
          resultsCount: 0,
          fromCache: true,
          cacheSimilarity: libraryMatch.similarity,
          cacheUseCount: libraryMatch.useCount,
          model: 'cached',
          provider: 'answer_library',
          timing: {
            embeddingMs,
            libraryMs,
            searchMs: 0,
            llmMs: 0,
            totalMs,
          },
        },
        request.email ? userActor(request.email, request.email) : systemActor('askspm'),
        'info'
      ).catch((err) => console.warn('[AskSPM] Failed to record audit:', err));
    }

    return {
      queryId: queryRecord.id,
      query: request.query,
      answer: libraryMatch.answerText,
      sources: (libraryMatch.sourcesJson as SearchResult[]) || [],
      timing: {
        embeddingMs,
        libraryMs,
        searchMs: 0,
        llmMs: 0,
        totalMs,
      },
      model: {
        embedding: embeddingResult.model,
        llm: 'cached',
        provider: 'answer_library',
      },
      fromLibrary: true,
      libraryAnswerId: libraryMatch.id,
      sessionToken: session.sessionToken,
    };
  }

  // Step 3: Cache miss - Search knowledge base
  const searchStart = Date.now();
  const searchResults = await searchKnowledgeBase(
    embeddingResult.embeddings[0],
    topK,
    threshold
  );
  const searchMs = Date.now() - searchStart;

  // Step 4: Generate LLM response with conversation context
  const llmResult = await generateLLMResponse(
    request.query,
    searchResults,
    conversationHistory.map((m) => ({ role: m.role, content: m.content }))
  );

  const totalMs = Date.now() - totalStart;

  // Step 5: Log query for analytics
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

  // Step 6: Save to Answer Library for future cache hits
  let libraryAnswerId: string | undefined;
  try {
    libraryAnswerId = await saveToAnswerLibrary({
      queryText: request.query,
      queryEmbedding: embeddingResult.embeddings[0],
      answerText: llmResult.answer,
      sources: searchResults,
      sourceQueryId: queryRecord.id,
      embeddingModel: embeddingResult.model,
      llmModel: llmResult.model,
      llmProvider: llmResult.provider,
    });
    console.log(`[AskSPM] Saved to Answer Library: ${libraryAnswerId}`);
  } catch (error) {
    // Don't fail the request if library save fails
    console.warn('[AskSPM] Failed to save to Answer Library:', error);
  }

  // Step 7: Save exchange to conversation history
  await addMessageExchange(session.sessionToken, request.query, llmResult.answer);

  // Step 8: Record to AICR Spine for telemetry (OpsChief/Pulse)
  if (isGOCCConfigured()) {
    await recordAudit(
      'askspm.query',
      {
        queryId: queryRecord.id,
        resultsCount: searchResults.length,
        fromCache: false,
        model: llmResult.model,
        provider: llmResult.provider,
        timing: {
          embeddingMs,
          searchMs,
          llmMs: llmResult.timeMs,
          totalMs,
        },
      },
      request.email ? userActor(request.email, request.email) : systemActor('askspm'),
      'info'
    ).catch((err) => console.warn('[AskSPM] Failed to record audit:', err));
  }

  return {
    queryId: queryRecord.id,
    query: request.query,
    answer: llmResult.answer,
    sources: searchResults,
    timing: {
      embeddingMs,
      libraryMs,
      searchMs,
      llmMs: llmResult.timeMs,
      totalMs,
    },
    model: {
      embedding: embeddingResult.model,
      llm: llmResult.model,
      provider: llmResult.provider,
    },
    fromLibrary: false,
    libraryAnswerId,
    sessionToken: session.sessionToken,
  };
}

// ============================================================================
// STREAMING TYPES
// ============================================================================

export type StreamEventType = 'metadata' | 'content' | 'done' | 'error';

export interface StreamEvent {
  type: StreamEventType;
  data: unknown;
}

export interface StreamMetadataEvent extends StreamEvent {
  type: 'metadata';
  data: {
    status?: 'embedding' | 'searching' | 'generating';
    sources?: SearchResult[];
    fromLibrary?: boolean;
    libraryAnswerId?: string;
    timing?: Partial<AskSPMResponse['timing']>;
  };
}

export interface StreamContentEvent extends StreamEvent {
  type: 'content';
  data: {
    content: string;
  };
}

export interface StreamDoneEvent extends StreamEvent {
  type: 'done';
  data: {
    queryId?: string;
    timing?: AskSPMResponse['timing'];
    model?: AskSPMResponse['model'];
    sessionToken?: string;
  };
}

export interface StreamErrorEvent extends StreamEvent {
  type: 'error';
  data: {
    message: string;
    code?: string;
  };
}

// ============================================================================
// STREAMING HELPER FUNCTIONS
// ============================================================================

/**
 * Stream cached answer in natural chunks
 * Breaks text into ~50 char chunks at word boundaries with small delays
 */
function* streamCachedAnswer(text: string, chunkSize: number = 50): Generator<string> {
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= chunkSize) {
      yield remaining;
      break;
    }

    // Find a good break point (word boundary)
    let breakPoint = chunkSize;
    const spaceIndex = remaining.lastIndexOf(' ', chunkSize);
    if (spaceIndex > chunkSize / 2) {
      breakPoint = spaceIndex + 1; // Include the space
    }

    yield remaining.slice(0, breakPoint);
    remaining = remaining.slice(breakPoint);
  }
}

/**
 * Build the system prompt for LLM generation
 */
function buildSystemPrompt(context: SearchResult[]): string {
  const contextText = context
    .map((c, i) => `[${i + 1}] ${c.keyword} (${c.pillar}/${c.category}):\n${c.content}`)
    .join('\n\n');

  return `You are The Toddfather's SPM Expert - a knowledgeable assistant specializing in Sales Performance Management (SPM), Incentive Compensation Management (ICM), sales governance, and related topics.

Use the following knowledge base context to answer the user's question. If the context doesn't contain relevant information, say so but try to provide general guidance based on SPM best practices.

CONTEXT FROM SPM KNOWLEDGE BASE:
${contextText}

Guidelines:
- Be concise but comprehensive
- Reference specific concepts from the context when applicable
- Use the exact terminology from the SPM domain
- If asked about policies or governance, emphasize the importance of proper documentation
- When discussing ICM topics, consider both plan design and operational aspects
- If this is a follow-up question, maintain context from the conversation history`;
}

/**
 * Stream LLM response using available providers
 * Priority: Gateway > Ollama > OpenAI
 */
async function* streamLLMResponse(
  query: string,
  context: SearchResult[],
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): AsyncGenerator<string, { model: string; provider: string }, unknown> {
  const systemPrompt = buildSystemPrompt(context);

  // Build messages array with conversation history
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory,
    { role: 'user', content: query },
  ];

  // Try AICR Gateway first if configured
  const gatewayUrl = process.env.AICR_GATEWAY_URL;
  const gatewayApiKey = process.env.AICR_API_KEY;

  if (gatewayUrl && gatewayApiKey) {
    try {
      const model = process.env.GATEWAY_CHAT_MODEL || 'gpt-4o-mini';
      const response = await fetch(`${gatewayUrl}/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${gatewayApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 1024,
          stream: true,
        }),
      });

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6).trim();
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data) as {
                    choices?: Array<{ delta?: { content?: string } }>;
                  };
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    yield content;
                  }
                } catch {
                  // Ignore parse errors for incomplete chunks
                }
              }
            }
          }

          return { model, provider: 'gateway' };
        } finally {
          reader.releaseLock();
        }
      }
    } catch (error) {
      console.warn('[AskSPM] Gateway streaming failed, falling back:', error);
    }
  }

  // Try Ollama second (free, local)
  const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const ollamaAvailable = await isOllamaAvailable(ollamaUrl);

  if (ollamaAvailable) {
    try {
      const model = process.env.OLLAMA_MODEL || 'llama3';
      const response = await fetch(`${ollamaUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages,
          stream: true,
        }),
      });

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (!line.trim()) continue;

              try {
                const parsed = JSON.parse(line) as {
                  message?: { content?: string };
                  done?: boolean;
                };
                if (parsed.message?.content) {
                  yield parsed.message.content;
                }
              } catch {
                // Ignore parse errors
              }
            }
          }

          return { model, provider: 'ollama' };
        } finally {
          reader.releaseLock();
        }
      }
    } catch (error) {
      console.warn('[AskSPM] Ollama streaming failed, falling back to OpenAI:', error);
    }
  }

  // Fallback to OpenAI streaming
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    throw new Error('No LLM provider available (Gateway down, Ollama down, no OpenAI key)');
  }

  const { default: OpenAI } = await import('openai');
  const client = new OpenAI({ apiKey: openaiKey });
  const model = process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini';

  const stream = await client.chat.completions.create({
    model,
    messages,
    temperature: 0.7,
    max_tokens: 1024,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }

  return { model, provider: 'openai' };
}

// ============================================================================
// STREAMING ASKSPM FUNCTION
// ============================================================================

/**
 * Streaming AskSPM function - RAG pipeline with streaming response
 *
 * Yields events as the pipeline progresses:
 * - metadata: Status updates, sources, timing info
 * - content: Chunks of the answer text
 * - done: Final timing and metadata
 * - error: If something goes wrong
 */
export async function* askSPMStream(
  request: AskSPMRequest
): AsyncGenerator<StreamEvent> {
  const totalStart = Date.now();
  const topK = request.topK || 5;
  const threshold = request.similarityThreshold || 0.3;

  try {
    // Step 0: Get or create conversation session
    const session = await getOrCreateSession(request.sessionToken, request.userId);
    const conversationHistory = await getConversationHistory(session.sessionToken);

    // Step 1: Generate query embedding
    yield { type: 'metadata', data: { status: 'embedding' } } as StreamMetadataEvent;

    const embeddingStart = Date.now();
    const embeddingResult = await generateEmbeddings([request.query]);
    const embeddingMs = Date.now() - embeddingStart;

    // Step 2: Check Answer Library for cached response
    const libraryStart = Date.now();
    const libraryMatch = await searchAnswerLibrary(embeddingResult.embeddings[0]);
    const libraryMs = Date.now() - libraryStart;

    if (libraryMatch) {
      // Cache hit - stream cached answer
      yield {
        type: 'metadata',
        data: {
          sources: (libraryMatch.sourcesJson as SearchResult[]) || [],
          fromLibrary: true,
          libraryAnswerId: libraryMatch.id,
          timing: { embeddingMs, libraryMs },
        },
      } as StreamMetadataEvent;

      // Stream cached answer in chunks for natural feel
      for (const chunk of streamCachedAnswer(libraryMatch.answerText)) {
        yield { type: 'content', data: { content: chunk } } as StreamContentEvent;
        // Small delay for natural streaming feel (only in cached mode)
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      const totalMs = Date.now() - totalStart;

      // Log the cache hit for analytics
      const queryRecord = await prisma.askQuery.create({
        data: {
          queryText: request.query,
          responseText: libraryMatch.answerText,
          topK,
          resultCount: 0,
          matchedChunks: [],
          embeddingModel: embeddingResult.model,
          llmModel: 'cache',
          llmProvider: 'answer_library',
          userId: request.userId,
          email: request.email,
          ipAddress: request.ipAddress,
          embeddingTimeMs: embeddingMs,
          searchTimeMs: libraryMs,
          llmTimeMs: 0,
          totalTimeMs: totalMs,
        },
      });

      console.log(`[AskSPM Stream] Cache hit! Similarity: ${libraryMatch.similarity.toFixed(3)}`);

      // Save exchange to conversation history
      await addMessageExchange(session.sessionToken, request.query, libraryMatch.answerText);

      yield {
        type: 'done',
        data: {
          queryId: queryRecord.id,
          timing: {
            embeddingMs,
            libraryMs,
            searchMs: 0,
            llmMs: 0,
            totalMs,
          },
          model: {
            embedding: embeddingResult.model,
            llm: 'cached',
            provider: 'answer_library',
          },
          sessionToken: session.sessionToken,
        },
      } as StreamDoneEvent;

      return;
    }

    // Step 3: Cache miss - Search knowledge base
    yield { type: 'metadata', data: { status: 'searching' } } as StreamMetadataEvent;

    const searchStart = Date.now();
    const searchResults = await searchKnowledgeBase(
      embeddingResult.embeddings[0],
      topK,
      threshold
    );
    const searchMs = Date.now() - searchStart;

    yield {
      type: 'metadata',
      data: {
        sources: searchResults,
        timing: { embeddingMs, libraryMs, searchMs },
      },
    } as StreamMetadataEvent;

    // Step 4: Stream LLM response
    yield { type: 'metadata', data: { status: 'generating' } } as StreamMetadataEvent;

    const llmStart = Date.now();
    let fullAnswer = '';
    let modelInfo = { model: 'unknown', provider: 'unknown' };

    const llmStream = streamLLMResponse(
      request.query,
      searchResults,
      conversationHistory.map((m) => ({ role: m.role, content: m.content }))
    );

    // Stream each chunk
    while (true) {
      const result = await llmStream.next();

      if (result.done) {
        // Generator returned with model info
        if (result.value) {
          modelInfo = result.value;
        }
        break;
      }

      const chunk = result.value;
      fullAnswer += chunk;
      yield { type: 'content', data: { content: chunk } } as StreamContentEvent;
    }

    const llmMs = Date.now() - llmStart;
    const totalMs = Date.now() - totalStart;

    // Step 5: Log query for analytics
    const queryRecord = await prisma.askQuery.create({
      data: {
        queryText: request.query,
        responseText: fullAnswer,
        topK,
        resultCount: searchResults.length,
        matchedChunks: searchResults.map((r) => ({ chunkId: r.chunkId, score: r.score })),
        embeddingModel: embeddingResult.model,
        llmModel: modelInfo.model,
        llmProvider: modelInfo.provider,
        userId: request.userId,
        email: request.email,
        ipAddress: request.ipAddress,
        embeddingTimeMs: embeddingMs,
        searchTimeMs: searchMs,
        llmTimeMs: llmMs,
        totalTimeMs: totalMs,
      },
    });

    // Step 6: Save to Answer Library for future cache hits
    let libraryAnswerId: string | undefined;
    try {
      libraryAnswerId = await saveToAnswerLibrary({
        queryText: request.query,
        queryEmbedding: embeddingResult.embeddings[0],
        answerText: fullAnswer,
        sources: searchResults,
        sourceQueryId: queryRecord.id,
        embeddingModel: embeddingResult.model,
        llmModel: modelInfo.model,
        llmProvider: modelInfo.provider,
      });
      console.log(`[AskSPM Stream] Saved to Answer Library: ${libraryAnswerId}`);
    } catch (error) {
      console.warn('[AskSPM Stream] Failed to save to Answer Library:', error);
    }

    // Step 7: Save exchange to conversation history
    await addMessageExchange(session.sessionToken, request.query, fullAnswer);

    yield {
      type: 'done',
      data: {
        queryId: queryRecord.id,
        timing: {
          embeddingMs,
          libraryMs,
          searchMs,
          llmMs,
          totalMs,
        },
        model: {
          embedding: embeddingResult.model,
          llm: modelInfo.model,
          provider: modelInfo.provider,
        },
        sessionToken: session.sessionToken,
      },
    } as StreamDoneEvent;

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    yield {
      type: 'error',
      data: { message },
    } as StreamErrorEvent;
  }
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
