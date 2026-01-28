/**
 * Answer Library Service for IntelligentSPM
 * Manages cached Q&A pairs with semantic matching and confidence scoring
 *
 * This is a standalone SDA (Structured Data Access) component that provides:
 * - Semantic search for cached answers using pgvector cosine similarity
 * - Confidence scoring via Wilson score algorithm
 * - Automatic deactivation of low-confidence answers
 */

import { prisma } from '@/lib/db/prisma';
import { embeddingToVector, normalizeEmbedding } from './embedding.service';
import { Prisma } from '@prisma/client';

// ============================================================================
// CONFIGURATION
// ============================================================================

export interface AnswerLibraryConfig {
  similarityThreshold: number; // Default: 0.92
  minConfidence: number; // Default: 0.5
  embeddingDimensions: number; // Default: 768
}

const DEFAULT_CONFIG: AnswerLibraryConfig = {
  similarityThreshold: 0.92,
  minConfidence: 0.5,
  embeddingDimensions: 768,
};

// ============================================================================
// INTERFACES
// ============================================================================

export interface LibraryMatch {
  id: string;
  queryText: string;
  answerText: string;
  sourcesJson: unknown;
  confidenceScore: number;
  similarity: number;
  useCount: number;
}

export interface SaveAnswerRequest {
  queryText: string;
  queryEmbedding: number[];
  answerText: string;
  sources: unknown[];
  sourceQueryId: string;
  embeddingModel: string;
  llmModel: string;
  llmProvider: string;
}

export interface LibraryStats {
  totalAnswers: number;
  activeAnswers: number;
  totalUses: number;
  avgConfidence: number;
}

// ============================================================================
// WILSON SCORE CONFIDENCE CALCULATION
// ============================================================================

/**
 * Calculate confidence score using Wilson score interval
 *
 * The Wilson score provides a lower bound on the confidence interval
 * for a proportion. It's preferred over simple proportion (thumbsUp/total)
 * because it accounts for uncertainty with small sample sizes.
 *
 * @param thumbsUp - Number of positive votes
 * @param thumbsDown - Number of negative votes
 * @returns Confidence score between 0 and 1
 */
export function calculateConfidence(thumbsUp: number, thumbsDown: number): number {
  const total = thumbsUp + thumbsDown;

  // No votes yet - assume full confidence
  if (total === 0) return 1.0;

  const p = thumbsUp / total;
  const z = 1.96; // 95% confidence interval (z-score)

  const denominator = 1 + (z * z) / total;
  const center = p + (z * z) / (2 * total);
  const spread = z * Math.sqrt((p * (1 - p) + (z * z) / (4 * total)) / total);

  // Wilson score lower bound
  const score = (center - spread) / denominator;

  // Clamp to [0, 1] range
  return Math.max(0, Math.min(1, score));
}

// ============================================================================
// ANSWER LIBRARY FUNCTIONS
// ============================================================================

/**
 * Search the answer library for a semantically similar cached answer
 *
 * Uses pgvector cosine similarity to find matches. Returns the best match
 * if it exceeds both the similarity threshold and minimum confidence.
 *
 * @param queryEmbedding - The embedding vector for the query
 * @param threshold - Similarity threshold (default: 0.92)
 * @param config - Optional configuration overrides
 * @returns The best matching answer or null if none found
 */
export async function searchAnswerLibrary(
  queryEmbedding: number[],
  threshold?: number,
  config: Partial<AnswerLibraryConfig> = {}
): Promise<LibraryMatch | null> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const similarityThreshold = threshold ?? finalConfig.similarityThreshold;

  // Normalize embedding to target dimensions
  const normalizedEmbedding = normalizeEmbedding(
    queryEmbedding,
    finalConfig.embeddingDimensions
  );
  const vectorStr = embeddingToVector(normalizedEmbedding);

  // Search for similar queries using pgvector cosine similarity
  // <=> is cosine distance, so similarity = 1 - distance
  const results = await prisma.$queryRaw<
    Array<{
      id: string;
      query_text: string;
      answer_text: string;
      sources_json: unknown;
      confidence_score: Prisma.Decimal;
      similarity: number;
      use_count: number;
    }>
  >`
    SELECT
      id,
      query_text,
      answer_text,
      sources_json,
      confidence_score,
      1 - (query_embedding <=> ${vectorStr}::vector) as similarity,
      use_count
    FROM answer_library
    WHERE query_embedding IS NOT NULL
      AND is_active = true
      AND confidence_score >= ${finalConfig.minConfidence}
      AND 1 - (query_embedding <=> ${vectorStr}::vector) >= ${similarityThreshold}
    ORDER BY query_embedding <=> ${vectorStr}::vector
    LIMIT 1
  `;

  if (results.length === 0) {
    return null;
  }

  const match = results[0];

  // Increment use count and update last_used_at
  await prisma.$executeRaw`
    UPDATE answer_library
    SET use_count = use_count + 1,
        last_used_at = NOW()
    WHERE id = ${match.id}::uuid
  `;

  return {
    id: match.id,
    queryText: match.query_text,
    answerText: match.answer_text,
    sourcesJson: match.sources_json,
    confidenceScore: Number(match.confidence_score),
    similarity: Number(match.similarity),
    useCount: match.use_count + 1, // Return the updated count
  };
}

/**
 * Save a new answer to the library
 *
 * Normalizes the query text and stores the answer with its embedding
 * for future semantic matching.
 *
 * @param request - The answer data to save
 * @returns The ID of the new answer library entry
 */
export async function saveToAnswerLibrary(request: SaveAnswerRequest): Promise<string> {
  // Normalize query for consistency
  const normalizedQuery = request.queryText.toLowerCase().trim();

  // Normalize embedding to target dimensions
  const normalizedEmbedding = normalizeEmbedding(request.queryEmbedding, DEFAULT_CONFIG.embeddingDimensions);
  const vectorStr = embeddingToVector(normalizedEmbedding);

  // Insert new record using raw SQL for vector type
  const result = await prisma.$queryRaw<Array<{ id: string }>>`
    INSERT INTO answer_library (
      query_text,
      query_embedding,
      normalized_query,
      answer_text,
      sources_json,
      source_query_id,
      embedding_model,
      llm_model,
      llm_provider,
      confidence_score,
      use_count,
      is_active,
      created_at,
      updated_at
    ) VALUES (
      ${request.queryText},
      ${vectorStr}::vector,
      ${normalizedQuery},
      ${request.answerText},
      ${JSON.stringify(request.sources)}::jsonb,
      ${request.sourceQueryId}::uuid,
      ${request.embeddingModel},
      ${request.llmModel},
      ${request.llmProvider},
      1.0,
      1,
      true,
      NOW(),
      NOW()
    )
    RETURNING id::text
  `;

  return result[0].id;
}

/**
 * Update answer confidence based on user feedback
 *
 * Recalculates confidence using Wilson score and automatically
 * deactivates answers that fall below the threshold.
 *
 * @param answerLibraryId - The ID of the answer to update
 * @param feedbackType - 'thumbs_up' or 'thumbs_down'
 */
export async function updateAnswerConfidence(
  answerLibraryId: string,
  feedbackType: 'thumbs_up' | 'thumbs_down'
): Promise<void> {
  // Get current vote counts
  const answer = await prisma.answerLibrary.findUnique({
    where: { id: answerLibraryId },
    select: {
      thumbsUpCount: true,
      thumbsDownCount: true,
    },
  });

  if (!answer) {
    throw new Error(`Answer library entry not found: ${answerLibraryId}`);
  }

  // Calculate new counts
  const newThumbsUp = feedbackType === 'thumbs_up'
    ? answer.thumbsUpCount + 1
    : answer.thumbsUpCount;
  const newThumbsDown = feedbackType === 'thumbs_down'
    ? answer.thumbsDownCount + 1
    : answer.thumbsDownCount;

  // Calculate new confidence using Wilson score
  const newConfidence = calculateConfidence(newThumbsUp, newThumbsDown);

  // Determine if answer should be deactivated
  // Deactivate if confidence < 0.3 with at least 5 votes
  const totalVotes = newThumbsUp + newThumbsDown;
  const shouldDeactivate = newConfidence < 0.3 && totalVotes >= 5;

  // Update the record
  await prisma.answerLibrary.update({
    where: { id: answerLibraryId },
    data: {
      thumbsUpCount: newThumbsUp,
      thumbsDownCount: newThumbsDown,
      confidenceScore: newConfidence,
      isActive: shouldDeactivate ? false : undefined, // Only set if deactivating
    },
  });
}

/**
 * Get statistics about the answer library
 *
 * @returns Statistics including total answers, active count, total uses, and average confidence
 */
export async function getLibraryStats(): Promise<LibraryStats> {
  const stats = await prisma.$queryRaw<
    Array<{
      total_answers: bigint;
      active_answers: bigint;
      total_uses: bigint;
      avg_confidence: Prisma.Decimal | null;
    }>
  >`
    SELECT
      COUNT(*) as total_answers,
      COUNT(*) FILTER (WHERE is_active = true) as active_answers,
      COALESCE(SUM(use_count), 0) as total_uses,
      AVG(confidence_score) FILTER (WHERE is_active = true) as avg_confidence
    FROM answer_library
  `;

  const result = stats[0];

  return {
    totalAnswers: Number(result.total_answers),
    activeAnswers: Number(result.active_answers),
    totalUses: Number(result.total_uses),
    avgConfidence: result.avg_confidence ? Number(result.avg_confidence) : 1.0,
  };
}

// ============================================================================
// TESTS FOR WILSON SCORE
// ============================================================================

/**
 * Self-test for the Wilson score calculation
 * Run with: npx tsx -e "import('./src/lib/services/answer-library.service').then(m => m.runWilsonScoreTests())"
 */
export function runWilsonScoreTests(): void {
  const tests = [
    // [thumbsUp, thumbsDown, expectedMin, expectedMax, description]
    [0, 0, 1.0, 1.0, 'No votes should return 1.0'],
    [1, 0, 0.0, 1.0, 'Single thumbs up should be positive'],
    [0, 1, 0.0, 0.5, 'Single thumbs down should be low'],
    [10, 0, 0.7, 1.0, '10 thumbs up should be high'],
    [0, 10, 0.0, 0.1, '10 thumbs down should be very low'],
    [5, 5, 0.2, 0.8, 'Equal votes should be around 0.5'],
    [100, 0, 0.9, 1.0, '100 thumbs up should be very high'],
    [95, 5, 0.8, 1.0, '95% positive should be high'],
    [1, 9, 0.0, 0.3, '10% positive should be low'],
  ] as const;

  console.log('Running Wilson Score Tests...\n');

  let passed = 0;
  let failed = 0;

  for (const [thumbsUp, thumbsDown, expectedMin, expectedMax, description] of tests) {
    const result = calculateConfidence(thumbsUp, thumbsDown);
    const success = result >= expectedMin && result <= expectedMax;

    if (success) {
      passed++;
      console.log(`PASS: ${description}`);
      console.log(`  Input: ${thumbsUp} up, ${thumbsDown} down`);
      console.log(`  Result: ${result.toFixed(4)} (expected ${expectedMin}-${expectedMax})\n`);
    } else {
      failed++;
      console.log(`FAIL: ${description}`);
      console.log(`  Input: ${thumbsUp} up, ${thumbsDown} down`);
      console.log(`  Result: ${result.toFixed(4)} (expected ${expectedMin}-${expectedMax})\n`);
    }
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed`);

  if (failed > 0) {
    throw new Error(`${failed} tests failed`);
  }
}
