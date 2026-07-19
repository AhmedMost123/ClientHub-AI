import { z } from "zod";
import { AI_CONFIG } from "./config";

export const ChatRequestSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(AI_CONFIG.maxMessageLength, `Message cannot exceed ${AI_CONFIG.maxMessageLength} characters`)
    .trim(),
  chatId: z.string().cuid().optional(),
});

export const ProposalRequestSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  description: z.string().max(2000).optional(),
  budget: z.string().max(100).optional(),
  tone: z.enum(["Professional", "Friendly", "Confident"]).default("Professional"),
});

export const UpdateChatSchema = z.object({
  title: z.string().min(1).max(100).trim(),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type ProposalRequest = z.infer<typeof ProposalRequestSchema>;
export type UpdateChatInput = z.infer<typeof UpdateChatSchema>;
