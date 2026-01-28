/**
 * AskSPM Feedback API
 * Records thumbs up/down feedback and updates Answer Library confidence
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { updateAnswerConfidence } from '@/lib/services/answer-library.service';

interface FeedbackRequest {
  queryId: string;
  feedbackType: 'thumbs_up' | 'thumbs_down';
  answerLibraryId?: string;
  feedbackText?: string;
  email?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as FeedbackRequest;

    // Validate required fields
    if (!body.queryId || !body.feedbackType) {
      return NextResponse.json(
        { error: 'Missing required fields: queryId and feedbackType' },
        { status: 400 }
      );
    }

    if (!['thumbs_up', 'thumbs_down'].includes(body.feedbackType)) {
      return NextResponse.json(
        { error: 'Invalid feedbackType. Must be "thumbs_up" or "thumbs_down"' },
        { status: 400 }
      );
    }

    // Get IP address
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Check if feedback already exists for this query from this IP
    const existingFeedback = await prisma.queryFeedback.findFirst({
      where: {
        queryId: body.queryId,
        ipAddress,
      },
    });

    if (existingFeedback) {
      return NextResponse.json(
        { error: 'Feedback already submitted for this query' },
        { status: 409 }
      );
    }

    // Create feedback record
    const feedback = await prisma.queryFeedback.create({
      data: {
        queryId: body.queryId,
        answerLibraryId: body.answerLibraryId,
        feedbackType: body.feedbackType,
        feedbackText: body.feedbackText,
        email: body.email,
        ipAddress,
      },
    });

    // Update Answer Library confidence if libraryAnswerId provided
    if (body.answerLibraryId) {
      try {
        await updateAnswerConfidence(body.answerLibraryId, body.feedbackType);
        console.log(`[Feedback] Updated confidence for ${body.answerLibraryId}: ${body.feedbackType}`);
      } catch (error) {
        console.warn('[Feedback] Failed to update Answer Library confidence:', error);
        // Don't fail the request - feedback is still recorded
      }
    }

    return NextResponse.json({
      success: true,
      feedbackId: feedback.id,
      message: `Feedback recorded: ${body.feedbackType}`,
    });
  } catch (error) {
    console.error('[Feedback API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to record feedback' },
      { status: 500 }
    );
  }
}

// GET endpoint to check if user has already submitted feedback
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const queryId = searchParams.get('queryId');

  if (!queryId) {
    return NextResponse.json(
      { error: 'Missing queryId parameter' },
      { status: 400 }
    );
  }

  const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown';

  const existingFeedback = await prisma.queryFeedback.findFirst({
    where: {
      queryId,
      ipAddress,
    },
    select: {
      feedbackType: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    hasFeedback: !!existingFeedback,
    feedbackType: existingFeedback?.feedbackType || null,
  });
}
