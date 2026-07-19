import { prisma } from "@/lib/prisma";
import { AISenderRole } from "@prisma/client";

export const aiRepository = {
  /**
   * Get all chats for a user, newest first, with message count.
   */
  async findChatsByUser(userId: string, limit = 50) {
    return prisma.aIChat.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { messages: true } },
      },
    });
  },

  /**
   * Get a single chat with all messages, verifying ownership.
   */
  async findChat(chatId: string, userId: string) {
    return prisma.aIChat.findFirst({
      where: { id: chatId, userId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
  },

  /**
   * Get only the messages of a chat (for context window).
   */
  async getMessages(chatId: string, limit: number) {
    return prisma.aIMessage.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
      take: limit,
      select: {
        role: true,
        content: true,
      },
    });
  },

  /**
   * Create a new chat conversation.
   */
  async createChat(userId: string, title: string) {
    return prisma.aIChat.create({
      data: { userId, title },
    });
  },

  /**
   * Update the title of a chat.
   */
  async updateChatTitle(chatId: string, userId: string, title: string) {
    return prisma.aIChat.updateMany({
      where: { id: chatId, userId },
      data: { title },
    });
  },

  /**
   * Delete a chat and all its messages (cascade).
   */
  async deleteChat(chatId: string, userId: string) {
    return prisma.aIChat.deleteMany({
      where: { id: chatId, userId },
    });
  },

  /**
   * Append a message to a chat and bump the chat's updatedAt.
   */
  async appendMessage(chatId: string, role: AISenderRole, content: string) {
    return prisma.aIMessage.create({
      data: { chatId, role, content },
    });
  },

  /**
   * Touch the chat's updatedAt timestamp (for ordering).
   */
  async touchChat(chatId: string) {
    return prisma.aIChat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });
  },
};
