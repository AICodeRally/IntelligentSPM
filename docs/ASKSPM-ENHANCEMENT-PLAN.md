# AskSPM Enhancement Plan

> **Handoff to Stack** - January 28, 2026
> Design complete, ready for implementation

## Project Location

```
~/dev/products/intelligentspm/
├── prisma/schema.prisma          # Add new models here
├── src/lib/services/
│   ├── askspm.service.ts         # Main RAG service (modify)
│   ├── embedding.service.ts      # Embedding generation (exists)
│   └── answer-library.service.ts # NEW - create this
├── src/app/api/askspm/
│   ├── route.ts                  # Existing endpoint (modify)
│   ├── stream/route.ts           # NEW - streaming
│   └── feedback/route.ts         # NEW - feedback
└── src/app/(main)/healthcheck/askspm/
    └── askspm-content.tsx        # UI component (modify)
```

## Current Tech Stack

- **Database**: Neon PostgreSQL with pgvector (768 dimensions)
- **Embedding**: OpenAI text-embedding-3-small (truncated to 768)
- **LLM**: AICR Gateway → Ollama → OpenAI fallback chain
- **Framework**: Next.js 14 App Router

---

## Overview

Enhance AskSPM with four features:
1. **Answer Library** - Self-populating semantic cache (SDA component)
2. **Streaming Responses** - Real-time LLM output
3. **Feedback Loop** - Thumbs up/down quality signals
4. **Multi-turn Conversation** - Context-aware sessions

---

## Architecture Decision: Answer Library as SDA Component

The Answer Library should be a **standalone service** that can be:
- Called by IntelligentSPM's AskSPM
- Reused by other SDA applications
- Deployed independently or embedded

```
┌─────────────────────────────────────────────────────────┐
│                    IntelligentSPM                        │
│  ┌─────────────┐                                        │
│  │   AskSPM    │                                        │
│  │   Service   │──────┐                                 │
│  └─────────────┘      │                                 │
│         │             │                                 │
│         ▼             ▼                                 │
│  ┌─────────────────────────────────────┐               │
│  │         SDA Answer Library           │◄── Standalone │
│  │  ┌─────────────────────────────┐    │    Component  │
│  │  │ • Semantic Query Matching   │    │               │
│  │  │ • Auto-populate from AI     │    │               │
│  │  │ • Confidence Scoring        │    │               │
│  │  │ • Feedback Integration      │    │               │
│  │  └─────────────────────────────┘    │               │
│  └─────────────────────────────────────┘               │
│         │                                               │
│         ▼                                               │
│  ┌─────────────┐    ┌─────────────┐                    │
│  │  pgvector   │    │   LLM Gen   │                    │
│  │  (768-dim)  │    │  (fallback) │                    │
│  └─────────────┘    └─────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

---

## Phase 1: Answer Library (SDA Component)

### Database Schema

```sql
-- answer_library table
CREATE TABLE answer_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Query matching
    query_text TEXT NOT NULL,
    query_embedding vector(768),
    normalized_query TEXT,  -- lowercase, trimmed

    -- Answer content
    answer_text TEXT NOT NULL,
    sources_json JSONB,

    -- Quality metrics
    confidence_score DECIMAL(3,2) DEFAULT 1.0,
    thumbs_up_count INTEGER DEFAULT 0,
    thumbs_down_count INTEGER DEFAULT 0,

    -- Usage tracking
    use_count INTEGER DEFAULT 1,
    last_used_at TIMESTAMPTZ DEFAULT NOW(),

    -- Source tracking
    source_query_id UUID,
    embedding_model TEXT,
    llm_model TEXT,
    llm_provider TEXT,

    -- Lifecycle
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vector similarity index
CREATE INDEX answer_library_embedding_idx
ON answer_library USING ivfflat (query_embedding vector_cosine_ops)
WITH (lists = 50);

-- Query feedback table
CREATE TABLE query_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_id UUID NOT NULL,
    answer_library_id UUID,
    feedback_type TEXT NOT NULL,  -- 'thumbs_up' | 'thumbs_down'
    feedback_text TEXT,
    user_id UUID,
    email TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Answer Library Service Interface

```typescript
// src/lib/services/answer-library.service.ts

interface AnswerLibraryConfig {
  similarityThreshold: number;  // Default: 0.92
  minConfidence: number;        // Default: 0.5
  embeddingDimensions: number;  // Default: 768
}

interface LibraryMatch {
  id: string;
  queryText: string;
  answerText: string;
  sourcesJson: unknown;
  confidenceScore: number;
  similarity: number;
  useCount: number;
}

interface SaveAnswerRequest {
  queryText: string;
  queryEmbedding: number[];
  answerText: string;
  sources: unknown[];
  sourceQueryId: string;
  embeddingModel: string;
  llmModel: string;
  llmProvider: string;
}

// Core functions
export async function searchAnswerLibrary(
  queryEmbedding: number[],
  threshold?: number
): Promise<LibraryMatch | null>

export async function saveToAnswerLibrary(
  request: SaveAnswerRequest
): Promise<string>

export async function updateAnswerConfidence(
  answerLibraryId: string,
  feedbackType: 'thumbs_up' | 'thumbs_down'
): Promise<void>

export async function getLibraryStats(): Promise<{
  totalAnswers: number;
  activeAnswers: number;
  totalUses: number;
  avgConfidence: number;
}>
```

### Integration Point in AskSPM

```typescript
// In askspm.service.ts - askSPM function

// STEP 1: Generate embedding (existing)
const embeddingResult = await generateEmbeddings([request.query]);

// STEP 2: Check answer library FIRST (NEW)
const libraryMatch = await searchAnswerLibrary(embeddingResult.embeddings[0]);

if (libraryMatch) {
  // Return cached answer immediately
  return {
    answer: libraryMatch.answerText,
    sources: libraryMatch.sourcesJson,
    fromLibrary: true,
    libraryAnswerId: libraryMatch.id,
    // ... timing, model info
  };
}

// STEP 3: Search knowledge base (existing)
const searchResults = await searchKnowledgeBase(...);

// STEP 4: Generate LLM response (existing)
const llmResult = await generateLLMResponse(...);

// STEP 5: Save to answer library (NEW)
await saveToAnswerLibrary({
  queryText: request.query,
  queryEmbedding: embeddingResult.embeddings[0],
  answerText: llmResult.answer,
  sources: searchResults,
  sourceQueryId: queryRecord.id,
  embeddingModel: embeddingResult.model,
  llmModel: llmResult.model,
  llmProvider: llmResult.provider,
});

return { answer: llmResult.answer, sources: searchResults, ... };
```

### Confidence Score Algorithm (Wilson Score)

```typescript
function calculateConfidence(thumbsUp: number, thumbsDown: number): number {
  const total = thumbsUp + thumbsDown;
  if (total === 0) return 1.0;

  const p = thumbsUp / total;
  const z = 1.96; // 95% confidence
  const denominator = 1 + (z * z) / total;
  const center = p + (z * z) / (2 * total);
  const spread = z * Math.sqrt((p * (1 - p) + (z * z) / (4 * total)) / total);

  return Math.max(0, Math.min(1, (center - spread) / denominator));
}

// Deactivate answer if confidence < 0.3 with 5+ votes
const isActive = !(confidenceScore < 0.3 && total >= 5);
```

---

## Phase 2: Streaming Responses

### New API Route

```typescript
// src/app/api/askspm/stream/route.ts
export const runtime = 'edge';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const stream = await askSPMStream(body);

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

### SSE Event Format

```
event: metadata
data: {"sources": [...], "timing": {"embeddingMs": 45, "searchMs": 12}}

event: content
data: {"content": "A clawback policy is"}

event: content
data: {"content": " a mechanism that allows"}

event: done
data: {"queryId": "uuid", "timing": {"totalMs": 847}}
```

### UI Streaming Handler

```typescript
const reader = response.body?.getReader();
let fullContent = '';

while (reader) {
  const { done, value } = await reader.read();
  if (done) break;

  const text = decoder.decode(value);
  // Parse SSE events, accumulate content
  fullContent += parseContentFromSSE(text);
  setStreamingContent(fullContent);
}
```

---

## Phase 3: Feedback System

### Feedback API

```typescript
// POST /api/askspm/feedback
{
  queryId: string;
  feedbackType: 'thumbs_up' | 'thumbs_down';
  answerLibraryId?: string;  // If from cache
}
```

### UI Feedback Buttons

Add to each assistant message:
- Thumbs up button (boosts confidence)
- Thumbs down button (lowers confidence)
- Visual state after feedback given
- One feedback per message enforced

---

## Phase 4: Multi-turn Conversation

### Session Management

```typescript
// Session stored in localStorage
const sessionToken = localStorage.getItem('askspm_session');

// Send with each request
body: JSON.stringify({
  query,
  sessionToken,
})

// Server returns new token if session created
if (response.sessionToken) {
  localStorage.setItem('askspm_session', response.sessionToken);
}
```

### Conversation History in LLM Context

```typescript
// Include last 3 exchanges (6 messages)
const messages = [
  { role: 'system', content: systemPrompt },
  ...conversationHistory.slice(-6),
  { role: 'user', content: query },
];
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `prisma/schema.prisma` | Add AnswerLibrary, QueryFeedback, ConversationSession models |
| `src/lib/services/answer-library.service.ts` | NEW - Core library service |
| `src/lib/services/askspm.service.ts` | Add library check, streaming, save answers |
| `src/app/api/askspm/route.ts` | Add session handling, updated response |
| `src/app/api/askspm/stream/route.ts` | NEW - Streaming endpoint |
| `src/app/api/askspm/feedback/route.ts` | NEW - Feedback endpoint |
| `src/app/(main)/healthcheck/askspm/askspm-content.tsx` | Streaming UI, feedback buttons, sessions |

---

## API Contract Changes

### POST /api/askspm (Updated)

**Request:**
```typescript
{
  query: string;
  topK?: number;
  sessionToken?: string;  // NEW
}
```

**Response:**
```typescript
{
  queryId: string;
  answer: string;
  sources: Source[];
  timing: Timing;
  sessionToken?: string;     // NEW - on new session
  fromLibrary?: boolean;     // NEW - cache hit
  libraryAnswerId?: string;  // NEW - for feedback
}
```

---

## Verification

1. **Answer Library:**
   - Query "What is a clawback?" → generates, saves to library
   - Query "What are clawback policies?" → cache hit (>0.92 similarity)
   - Query "Explain quota management" → cache miss, new generation

2. **Streaming:**
   - Text appears progressively
   - Sources show before content
   - Cancel mid-stream works

3. **Feedback:**
   - Thumbs up/down clickable
   - One feedback per message
   - Confidence updates in database

4. **Multi-turn:**
   - "Tell me about clawbacks" → answer
   - "What about exceptions?" → context-aware answer
   - "New Chat" clears history

---

## Handoff Notes for Forge

1. **Answer Library is the core** - implement first, test independently
2. **Similarity threshold 0.92** is aggressive - may need tuning
3. **Wilson score** prevents gaming with few votes
4. **Edge runtime** required for streaming
5. **Session TTL** default 24 hours, stored in localStorage
