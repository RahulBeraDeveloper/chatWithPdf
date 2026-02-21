export const AI_CONFIG = {
  rag: {
    MAX_HISTORY_MESSAGES: 8,
    MAX_CONTEXT_CHARS: 6000,
    MAX_QUESTION_LENGTH: 1000,
    MODEL_TIMEOUT: 20000,
    MODEL_NAME: "gemini-2.5-flash",
    TEMPERATURE: 0.2,
  },

  vector: {
    MAX_VECTOR_DOCS: 300,
    DEFAULT_TOP_K: 5,
  },

  embedding: {
    BATCH_SIZE: 10,
  },

  document: {
    MIN_TEXT_LENGTH: 50,
    CHUNK_SIZE: 500,
    MAX_TEXT_LENGTH: 500_000,
    EMBED_BATCH_SIZE: 5,
  },
} as const;