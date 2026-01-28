/**
 * AskSPM Streaming API
 * Server-Sent Events endpoint for real-time LLM responses
 *
 * Uses the askSPMStream generator from the service layer which handles:
 * - Answer Library caching (semantic cache)
 * - Knowledge base vector search
 * - LLM streaming (Gateway > Ollama > OpenAI fallback)
 * - Conversation history
 * - Query logging
 */

import { NextRequest } from 'next/server';
import { askSPMStream, StreamEvent } from '@/lib/services/askspm.service';

// Note: Using Node.js runtime instead of Edge because the service layer
// uses Prisma which requires Node.js runtime for full compatibility
// export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.query || typeof body.query !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get request metadata
    const ipAddress =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      undefined;

    // Create a ReadableStream to convert generator events to SSE format
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          const generator = askSPMStream({
            query: body.query,
            topK: body.topK || 5,
            similarityThreshold: body.threshold || 0.3,
            userId: body.userId,
            email: body.email,
            ipAddress,
            sessionToken: body.sessionToken,
          });

          for await (const event of generator) {
            // Format as SSE: event type + JSON data
            const sseMessage = formatSSEMessage(event);
            controller.enqueue(encoder.encode(sseMessage));
          }
        } catch (error) {
          // Send error event
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error('[AskSPM Stream API] Generator error:', error);
          const sseError = formatSSEMessage({
            type: 'error',
            data: { message: errorMessage },
          });
          controller.enqueue(encoder.encode(sseError));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no', // Disable nginx buffering
      },
    });
  } catch (error) {
    console.error('[AskSPM Stream API] Error:', error);
    return new Response(
      JSON.stringify({
        error: 'AskSPM stream request failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Format a StreamEvent as a Server-Sent Events message
 *
 * SSE format:
 *   event: <type>\n
 *   data: <json>\n
 *   \n
 */
function formatSSEMessage(event: StreamEvent): string {
  return `event: ${event.type}\ndata: ${JSON.stringify(event.data)}\n\n`;
}
