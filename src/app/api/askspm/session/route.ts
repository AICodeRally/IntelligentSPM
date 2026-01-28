/**
 * AskSPM Session Management API
 * Handles conversation session operations
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  createSession,
  clearSession,
  getSessionStats,
  cleanupExpiredSessions,
} from '@/lib/services/conversation.service';

/**
 * POST - Create a new session (for "New Chat" button)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { sessionToken: newToken, expiresAt } = await createSession(body.userId);

    return NextResponse.json({
      sessionToken: newToken,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('[Session API] Create error:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Clear a session (for "New Chat" button that also clears history)
 */
export async function DELETE(request: NextRequest) {
  try {
    const sessionToken = request.nextUrl.searchParams.get('sessionToken');

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'sessionToken is required' },
        { status: 400 }
      );
    }

    await clearSession(sessionToken);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Session API] Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to clear session' },
      { status: 500 }
    );
  }
}

/**
 * GET - Get session statistics (admin/debug)
 */
export async function GET(request: NextRequest) {
  try {
    const action = request.nextUrl.searchParams.get('action');

    // Optional: cleanup expired sessions
    if (action === 'cleanup') {
      const deletedCount = await cleanupExpiredSessions();
      return NextResponse.json({
        action: 'cleanup',
        deletedSessions: deletedCount,
      });
    }

    // Default: return stats
    const stats = await getSessionStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('[Session API] Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to get session stats' },
      { status: 500 }
    );
  }
}
