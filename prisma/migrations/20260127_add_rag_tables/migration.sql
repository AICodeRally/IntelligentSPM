-- Enable pgvector extension (Neon has this pre-installed)
CREATE EXTENSION IF NOT EXISTS vector;

-- Knowledge chunks table (Todd's 929 SPM cards)
CREATE TABLE "knowledge_chunks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "card_id" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "pillar" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "card_type" TEXT NOT NULL,
    "tags" TEXT[],
    "embedding" vector(1536),
    "embedding_model" TEXT,
    "content_hash" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "knowledge_chunks_pkey" PRIMARY KEY ("id")
);

-- AskSPM query log table
CREATE TABLE "ask_queries" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "query_text" TEXT NOT NULL,
    "response_text" TEXT,
    "top_k" INTEGER NOT NULL DEFAULT 5,
    "result_count" INTEGER,
    "matched_chunks" JSONB,
    "embedding_model" TEXT,
    "llm_model" TEXT,
    "llm_provider" TEXT,
    "user_id" UUID,
    "email" TEXT,
    "ip_address" TEXT,
    "embedding_time_ms" INTEGER,
    "search_time_ms" INTEGER,
    "llm_time_ms" INTEGER,
    "total_time_ms" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ask_queries_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX "knowledge_chunks_content_hash_key" ON "knowledge_chunks"("content_hash");
CREATE INDEX "knowledge_chunks_card_id_idx" ON "knowledge_chunks"("card_id");
CREATE INDEX "knowledge_chunks_pillar_idx" ON "knowledge_chunks"("pillar");
CREATE INDEX "knowledge_chunks_keyword_idx" ON "knowledge_chunks"("keyword");

CREATE INDEX "ask_queries_user_id_idx" ON "ask_queries"("user_id");
CREATE INDEX "ask_queries_created_at_idx" ON "ask_queries"("created_at");

-- Vector similarity index (IVFFlat for faster search)
-- Using 100 lists for ~1000 vectors (rule: sqrt(n))
CREATE INDEX "knowledge_chunks_embedding_idx" ON "knowledge_chunks"
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
