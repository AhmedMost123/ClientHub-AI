import { AISenderRole } from "@prisma/client";
import { groqClient } from "@/lib/ai/groq";
import { SYSTEM_PROMPT, PROPOSAL_SYSTEM_PROMPT } from "@/lib/ai/systemPrompt";
import { AI_CONFIG } from "@/lib/ai/config";
import { aiRepository } from "@/lib/repositories/ai.repository";
import { buildTitlePrompt } from "@/lib/ai/prompts";

export const aiService = {
  /**
   * Send a chat message. Creates a new chat if chatId is not provided.
   * Returns the Groq stream and the chatId.
   */
  async sendMessage(
    userId: string,
    message: string,
    chatId?: string,
  ) {
    // 1. Get or create the chat
    let resolvedChatId: string;
    const isNewChat = !chatId;

    if (chatId) {
      const existing = await aiRepository.findChat(chatId, userId);
      if (!existing) throw new Error("Conversation not found");
      resolvedChatId = existing.id;
    } else {
      const newChat = await aiRepository.createChat(userId, "New Conversation");
      resolvedChatId = newChat.id;
    }

    // 2. Persist the user message
    await aiRepository.appendMessage(resolvedChatId, AISenderRole.USER, message);

    // 3. Build context messages from DB history
    const history = await aiRepository.getMessages(
      resolvedChatId,
      AI_CONFIG.maxContextMessages,
    );

    const groqMessages = history.map((msg) => ({
      role: msg.role === AISenderRole.USER ? ("user" as const) : ("assistant" as const),
      content: msg.content,
    }));

    // 4. Create streaming request to Groq
    const stream = await groqClient.chat.completions.create({
      model: AI_CONFIG.chatModel,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...groqMessages,
      ],
      max_tokens: AI_CONFIG.chatMaxTokens,
      temperature: AI_CONFIG.chatTemperature,
      stream: true,
    });

    // 5. If this is the first message, generate a title asynchronously
    if (isNewChat) {
      aiService.generateAndSetTitle(resolvedChatId, userId, message).catch(() => {
        // Best-effort — do not block the stream
      });
    }

    return { stream, chatId: resolvedChatId };
  },

  /**
   * Saves the full assistant response after streaming completes.
   */
  async saveAssistantMessage(chatId: string, content: string) {
    await aiRepository.appendMessage(chatId, AISenderRole.AI, content);
    await aiRepository.touchChat(chatId);
  },

  /**
   * Generate a streaming proposal from the Groq API.
   */
  async generateProposal(prompt: string) {
    return groqClient.chat.completions.create({
      model: AI_CONFIG.chatModel,
      messages: [
        { role: "system", content: PROPOSAL_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      max_tokens: AI_CONFIG.proposalMaxTokens,
      temperature: AI_CONFIG.proposalTemperature,
      stream: true,
    });
  },

  /**
   * Generate a short title from the first user message.
   */
  async generateAndSetTitle(chatId: string, userId: string, firstMessage: string) {
    try {
      const response = await groqClient.chat.completions.create({
        model: AI_CONFIG.titleModel,
        messages: [
          { role: "user", content: buildTitlePrompt(firstMessage) },
        ],
        max_tokens: AI_CONFIG.titleMaxTokens,
        temperature: 0.3,
        stream: false,
      });

      const title = response.choices[0]?.message?.content?.trim();

      if (title && title.length > 0) {
        await aiRepository.updateChatTitle(chatId, userId, title);
      }
    } catch {
      // Non-critical: leave title as "New Conversation"
    }
  },
};
