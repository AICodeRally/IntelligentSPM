-- Answer Library table (caches high-quality Q&A pairs for semantic matching)
CREATE TABLE "answer_library" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "query_text" TEXT NOT NULL,
    "query_embedding" vector(768),
    "normalized_query" TEXT,
    "answer_text" TEXT NOT NULL,
    "sources_json" JSONB,
    "confidence_score" DECIMAL(3,2) NOT NULL DEFAULT 1.0,
    "thumbs_up_count" INTEGER NOT NULL DEFAULT 0,
    "thumbs_down_count" INTEGER NOT NULL DEFAULT 0,
    "use_count" INTEGER NOT NULL DEFAULT 1,
    "last_used_at" TIMESTAMPTZ(6),
    "source_query_id" UUID,
    "embedding_model" TEXT,
    "llm_model" TEXT,
    "llm_provider" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "answer_library_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "answer_library_source_query_id_fkey" FOREIGN KEY ("source_query_id") REFERENCES "ask_queries"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Query Feedback table (tracks thumbs up/down on answers)
CREATE TABLE "query_feedback" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "query_id" UUID NOT NULL,
    "answer_library_id" UUID,
    "feedback_type" TEXT NOT NULL,
    "feedback_text" TEXT,
    "user_id" UUID,
    "email" TEXT,
    "ip_address" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "query_feedback_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "query_feedback_query_id_fkey" FOREIGN KEY ("query_id") REFERENCES "ask_queries"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "query_feedback_answer_library_id_fkey" FOREIGN KEY ("answer_library_id") REFERENCES "answer_library"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Conversation Session table (multi-turn conversation state)
CREATE TABLE "conversation_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_token" TEXT NOT NULL,
    "messages_json" JSONB,
    "user_id" UUID,
    "expires_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversation_sessions_pkey" PRIMARY KEY ("id")
);

-- Indexes for answer_library
CREATE INDEX "answer_library_source_query_id_idx" ON "answer_library"("source_query_id");
CREATE INDEX "answer_library_is_active_idx" ON "answer_library"("is_active");
CREATE INDEX "answer_library_last_used_at_idx" ON "answer_library"("last_used_at");

-- Vector similarity index for answer_library (IVFFlat for semantic matching)
-- Using 50 lists as specified in task requirements
CREATE INDEX "answer_library_embedding_idx" ON "answer_library"
USING ivfflat (query_embedding vector_cosine_ops) WITH (lists = 50);

-- Indexes for query_feedback
CREATE INDEX "query_feedback_query_id_idx" ON "query_feedback"("query_id");
CREATE INDEX "query_feedback_answer_library_id_idx" ON "query_feedback"("answer_library_id");
CREATE INDEX "query_feedback_feedback_type_idx" ON "query_feedback"("feedback_type");
CREATE INDEX "query_feedback_created_at_idx" ON "query_feedback"("created_at");

-- Indexes for conversation_sessions
CREATE UNIQUE INDEX "conversation_sessions_session_token_key" ON "conversation_sessions"("session_token");
CREATE INDEX "conversation_sessions_user_id_idx" ON "conversation_sessions"("user_id");
CREATE INDEX "conversation_sessions_expires_at_idx" ON "conversation_sessions"("expires_at");
