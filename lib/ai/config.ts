/**
 * Groq model configuration.
 * Change the model here without touching any business logic.
 */

export const AI_CONFIG = {
  /** Primary chat model */
  chatModel: "llama-3.3-70b-versatile" as const,

  /** Fast model for title generation */
  titleModel: "llama-3.1-8b-instant" as const,

  /** Max tokens for a chat response */
  chatMaxTokens: 2048,

  /** Max tokens for a proposal */
  proposalMaxTokens: 3000,

  /** Max tokens for a title */
  titleMaxTokens: 20,

  /** Temperature for chat (0 = deterministic, 1 = creative) */
  chatTemperature: 0.7,

  /** Temperature for proposals (slightly more creative) */
  proposalTemperature: 0.8,

  /** Max characters allowed in a single user message */
  maxMessageLength: 4000,

  /** Max messages to include for context window */
  maxContextMessages: 20,

  /** Rate limit: max requests per user per minute */
  rateLimitPerMinute: 10,
} as const;
