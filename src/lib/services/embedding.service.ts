/**
 * Embedding Service for IntelligentSPM
 * Supports OpenAI (ada-002) and Ollama (nomic-embed-text)
 */

import OpenAI from 'openai';

// Embedding dimensions by model
const EMBEDDING_DIMENSIONS = {
  'text-embedding-ada-002': 1536,
  'text-embedding-3-small': 1536,
  'nomic-embed-text': 768,
  'mxbai-embed-large': 1024,
};

export type EmbeddingModel = keyof typeof EMBEDDING_DIMENSIONS;
export type EmbeddingProvider = 'openai' | 'ollama';

interface EmbeddingConfig {
  provider: EmbeddingProvider;
  model: EmbeddingModel;
  ollamaBaseUrl?: string;
  openaiApiKey?: string;
}

interface EmbeddingResult {
  embeddings: number[][];
  model: string;
  dimensions: number;
  tokenCount?: number;
}

/**
 * Get default embedding configuration
 * Prefers Ollama (free, local) - falls back to OpenAI if configured
 */
export function getEmbeddingConfig(): EmbeddingConfig {
  const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const openaiKey = process.env.OPENAI_API_KEY;

  // Default to Ollama nomic-embed-text (768 dims, free, local)
  // Only use OpenAI if explicitly configured and Ollama not available
  if (process.env.USE_OPENAI_EMBEDDINGS === 'true' && openaiKey) {
    return {
      provider: 'openai',
      model: 'text-embedding-ada-002',
      openaiApiKey: openaiKey,
    };
  }

  return {
    provider: 'ollama',
    model: 'nomic-embed-text',
    ollamaBaseUrl: ollamaUrl,
  };
}

/**
 * Generate embeddings for an array of texts
 */
export async function generateEmbeddings(
  texts: string[],
  config?: Partial<EmbeddingConfig>
): Promise<EmbeddingResult> {
  const finalConfig = { ...getEmbeddingConfig(), ...config };

  if (finalConfig.provider === 'openai') {
    return generateOpenAIEmbeddings(texts, finalConfig);
  }

  return generateOllamaEmbeddings(texts, finalConfig);
}

/**
 * Generate embeddings via OpenAI
 */
async function generateOpenAIEmbeddings(
  texts: string[],
  config: EmbeddingConfig
): Promise<EmbeddingResult> {
  if (!config.openaiApiKey) {
    throw new Error('OpenAI API key required for OpenAI embeddings');
  }

  const client = new OpenAI({ apiKey: config.openaiApiKey });

  const response = await client.embeddings.create({
    model: config.model,
    input: texts,
  });

  const embeddings = response.data.map((item) => item.embedding);

  return {
    embeddings,
    model: config.model,
    dimensions: EMBEDDING_DIMENSIONS[config.model] || 1536,
    tokenCount: response.usage?.total_tokens,
  };
}

/**
 * Generate embeddings via Ollama
 */
async function generateOllamaEmbeddings(
  texts: string[],
  config: EmbeddingConfig
): Promise<EmbeddingResult> {
  const baseUrl = config.ollamaBaseUrl || 'http://localhost:11434';
  const embeddings: number[][] = [];

  // Ollama doesn't support batch embedding, so we process one at a time
  for (const text of texts) {
    const response = await fetch(`${baseUrl}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.model,
        prompt: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama embedding failed: ${response.status}`);
    }

    const data = (await response.json()) as { embedding: number[] };
    embeddings.push(data.embedding);
  }

  return {
    embeddings,
    model: config.model,
    dimensions: EMBEDDING_DIMENSIONS[config.model] || 768,
  };
}

/**
 * Check if Ollama is available
 */
export async function isOllamaAvailable(baseUrl?: string): Promise<boolean> {
  const url = baseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

  try {
    const response = await fetch(`${url}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Format embedding as pgvector-compatible string
 */
export function embeddingToVector(embedding: number[]): string {
  return `[${embedding.join(',')}]`;
}

/**
 * Pad or truncate embedding to target dimensions (for model compatibility)
 */
export function normalizeEmbedding(embedding: number[], targetDims: number): number[] {
  if (embedding.length === targetDims) {
    return embedding;
  }

  if (embedding.length > targetDims) {
    return embedding.slice(0, targetDims);
  }

  // Pad with zeros
  const padded = [...embedding];
  while (padded.length < targetDims) {
    padded.push(0);
  }
  return padded;
}
