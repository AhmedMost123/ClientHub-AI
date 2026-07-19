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

export const AIActionRequestSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  description: z.string().max(2000).optional(),
  budget: z.string().max(100).optional(),
  tone: z.enum(["Professional", "Friendly", "Confident", "Detailed", "Concise"]).default("Professional"),
  actionType: z.enum(["proposal", "project_description"]).default("proposal"),
});

export const UpdateChatSchema = z.object({
  title: z.string().min(1).max(100).trim(),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type AIActionRequest = z.infer<typeof AIActionRequestSchema>;
export type UpdateChatInput = z.infer<typeof UpdateChatSchema>;
