import { NextRequest, NextResponse } from 'next/server';
import { askSPM, getKnowledgeBaseStats } from '@/lib/services/askspm.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.query || typeof body.query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Get request metadata
    const ipAddress =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      undefined;

    const result = await askSPM({
      query: body.query,
      topK: body.topK || 5,
      similarityThreshold: body.threshold || 0.3,
      userId: body.userId,
      email: body.email,
      ipAddress,
      sessionToken: body.sessionToken,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[AskSPM API] Error:', error);
    return NextResponse.json(
      {
        error: 'AskSPM request failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const stats = await getKnowledgeBaseStats();
    return NextResponse.json({
      status: 'ok',
      knowledgeBase: stats,
    });
  } catch (error) {
    console.error('[AskSPM API] Stats error:', error);
    return NextResponse.json(
      {
        error: 'Failed to get knowledge base stats',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
