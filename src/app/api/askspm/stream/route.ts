/**
 * AskSPM Streaming API
 * Server-Sent Events endpoint for real-time LLM responses
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import {
  generateEmbeddings,
  embeddingToVector,
  normalizeEmbedding,
} from '@/lib/services/embedding.service';
import {
  searchAnswerLibrary,
  saveToAnswerLibrary,
} from '@/lib/services/answer-library.service';

// Use Edge runtime for streaming
export const runtime = 'edge';

const TARGET_DIMS = 768;

interface StreamRequest {
  query: string;
  topK?: number;
  similarityThreshold?: number;
  sessionToken?: string; // For future multi-turn support
}

interface SearchResult {
  chunkId: string;
  cardId: string;
  keyword: string;
  content: string;
  pillar: string;
  category: string;
  score: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as StreamRequest;

    if (!body.query) {
      return new Response(JSON.stringify({ error: 'Missing query' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const topK = body.topK || 5;
    const threshold = body.similarityThreshold || 0.3;
    const totalStart = Date.now();

    // Step 1: Generate embedding
    const embeddingStart = Date.now();
    const embeddingResult = await generateEmbeddings([body.query]);
    const embeddingMs = Date.now() - embeddingStart;

    // Step 2: Check Answer Library
    const libraryMatch = await searchAnswerLibrary(embeddingResult.embeddings[0]);

    if (libraryMatch) {
      // Cache hit - stream the cached answer
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          // Send metadata
          controller.enqueue(
            encoder.encode(
              `event: metadata\ndata: ${JSON.stringify({
                sources: libraryMatch.sourcesJson,
                timing: { embeddingMs },
                fromLibrary: true,
                libraryAnswerId: libraryMatch.id,
              })}\n\n`
            )
          );

          // Stream content in chunks (simulate streaming for cached content)
          const words = libraryMatch.answerText.split(' ');
          let index = 0;

          const sendWord = () => {
            if (index < words.length) {
              const chunk = words.slice(index, index + 3).join(' ') + ' ';
              controller.enqueue(
                encoder.encode(`event: content\ndata: ${JSON.stringify({ content: chunk })}\n\n`)
              );
              index += 3;
              setTimeout(sendWord, 20); // 20ms delay between chunks
            } else {
              // Send done event
              controller.enqueue(
                encoder.encode(
                  `event: done\ndata: ${JSON.stringify({
                    timing: { totalMs: Date.now() - totalStart },
                  })}\n\n`
                )
              );
              controller.close();
            }
          };

          sendWord();
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    // Step 3: Search knowledge base
    const searchStart = Date.now();
    const normalizedEmbedding = normalizeEmbedding(embeddingResult.embeddings[0], TARGET_DIMS);
    const vectorStr = embeddingToVector(normalizedEmbedding);

    const searchResults = await prisma.$queryRaw<
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

    const sources: SearchResult[] = searchResults.map((row) => ({
      chunkId: row.id,
      cardId: row.card_id,
      keyword: row.keyword,
      content: row.content,
      pillar: row.pillar,
      category: row.category,
      score: Number(row.similarity),
    }));
    const searchMs = Date.now() - searchStart;

    // Build context
    const contextText = sources
      .map((c, i) => `[${i + 1}] ${c.keyword} (${c.pillar}/${c.category}):\n${c.content}`)
      .join('\n\n');

    const systemPrompt = `You are The Toddfather's SPM Expert - a knowledgeable assistant specializing in Sales Performance Management (SPM), Incentive Compensation Management (ICM), sales governance, and related topics.

Use the following knowledge base context to answer the user's question. If the context doesn't contain relevant information, say so but try to provide general guidance based on SPM best practices.

CONTEXT FROM SPM KNOWLEDGE BASE:
${contextText}

Guidelines:
- Be concise but comprehensive
- Reference specific concepts from the context when applicable
- Use the exact terminology from the SPM domain`;

    // Step 4: Stream LLM response
    const gatewayUrl = process.env.AICR_GATEWAY_URL;
    const gatewayApiKey = process.env.AICR_API_KEY;

    if (!gatewayUrl || !gatewayApiKey) {
      return new Response(JSON.stringify({ error: 'LLM not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Call gateway with streaming
    const llmResponse = await fetch(`${gatewayUrl}/api/v1/chat`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${gatewayApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.GATEWAY_CHAT_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: body.query },
        ],
        temperature: 0.7,
        max_tokens: 1024,
        stream: true,
      }),
    });

    if (!llmResponse.ok) {
      return new Response(JSON.stringify({ error: 'LLM request failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Transform the LLM stream to SSE format
    const encoder = new TextEncoder();
    let fullContent = '';
    const llmStart = Date.now();

    const stream = new ReadableStream({
      async start(controller) {
        // Send metadata first
        controller.enqueue(
          encoder.encode(
            `event: metadata\ndata: ${JSON.stringify({
              sources,
              timing: { embeddingMs, searchMs },
            })}\n\n`
          )
        );

        const reader = llmResponse.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    fullContent += content;
                    controller.enqueue(
                      encoder.encode(`event: content\ndata: ${JSON.stringify({ content })}\n\n`)
                    );
                  }
                } catch {
                  // Ignore parse errors for incomplete chunks
                }
              }
            }
          }

          const llmMs = Date.now() - llmStart;
          const totalMs = Date.now() - totalStart;

          // Save to Answer Library (async, don't wait)
          saveToAnswerLibrary({
            queryText: body.query,
            queryEmbedding: embeddingResult.embeddings[0],
            answerText: fullContent,
            sources,
            sourceQueryId: 'stream-' + Date.now(),
            embeddingModel: embeddingResult.model,
            llmModel: process.env.GATEWAY_CHAT_MODEL || 'gpt-4o-mini',
            llmProvider: 'gateway',
          }).catch((err) => console.warn('[Stream] Failed to save to library:', err));

          // Send done event
          controller.enqueue(
            encoder.encode(
              `event: done\ndata: ${JSON.stringify({
                timing: { embeddingMs, searchMs, llmMs, totalMs },
              })}\n\n`
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[Stream API] Error:', error);
    return new Response(JSON.stringify({ error: 'Streaming failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
