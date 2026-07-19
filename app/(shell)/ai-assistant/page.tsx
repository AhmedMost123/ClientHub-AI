"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { AIHero } from "@/components/ai-assistant/AIHero";
import { QuickActionsGrid, QuickAction } from "@/components/ai-assistant/QuickActionsGrid";
import { AIChat } from "@/components/ai-assistant/AIChat";
import { ProposalDialog } from "@/components/ai-assistant/ProposalDialog";
import { ConversationSidebar, ChatSummary } from "@/components/ai-assistant/ConversationSidebar";
import { Message } from "@/components/ai-assistant/AIMessage";
import { toast } from "sonner";

// Helper: generate a temporary ID
const tempId = () => `temp-${Date.now()}-${Math.random()}`;

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isProposalDialogOpen, setIsProposalDialogOpen] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // ─── Load chat history on mount ───────────────────────────────────────────
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch("/api/ai/history");
        if (res.ok) {
          const data = await res.json();
          setChats(data.chats ?? []);
        }
      } catch {
        // Silently fail — history is non-critical
      } finally {
        setIsLoadingHistory(false);
      }
    };
    loadHistory();
  }, []);

  // ─── Select a conversation ─────────────────────────────────────────────────
  const handleSelectChat = useCallback(async (selectedChatId: string) => {
    if (selectedChatId === chatId) return;

    try {
      const res = await fetch(`/api/ai/history/${selectedChatId}`);
      if (!res.ok) throw new Error("Failed to load conversation");
      const data = await res.json();

      setChatId(selectedChatId);
      setMessages(
        (data.chat.messages ?? []).map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content,
        })),
      );
    } catch {
      toast.error("Failed to load conversation");
    }
  }, [chatId]);

  // ─── New chat ──────────────────────────────────────────────────────────────
  const handleNewChat = useCallback(() => {
    setChatId(null);
    setMessages([]);
    setInput("");
  }, []);

  // ─── Core send / stream ────────────────────────────────────────────────────
  const handleSend = useCallback(async (overrideMessage?: string) => {
    const text = (overrideMessage ?? input).trim();
    if (!text || isLoading) return;

    setInput("");
    setIsLoading(true);

    // Append user message immediately
    const userMsgId = tempId();
    setMessages((prev) => [...prev, { id: userMsgId, role: "user", content: text }]);

    // Append placeholder assistant message (typing indicator)
    const assistantMsgId = tempId();
    setStreamingMessageId(assistantMsgId);
    setMessages((prev) => [
      ...prev,
      { id: assistantMsgId, role: "assistant", content: "", isStreaming: true },
    ]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, chatId: chatId ?? undefined }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send message");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream available");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? ""; // Keep incomplete line in buffer

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;

          try {
            const event = JSON.parse(raw);

            if (event.type === "chatId") {
              const newChatId = event.chatId as string;
              setChatId(newChatId);
              // Add to history sidebar if new
              setChats((prev) => {
                if (prev.find((c) => c.id === newChatId)) return prev;
                return [
                  {
                    id: newChatId,
                    title: "New Conversation",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    _count: { messages: 0 },
                  },
                  ...prev,
                ];
              });
            } else if (event.type === "token") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId
                    ? { ...m, content: m.content + event.content }
                    : m,
                ),
              );
            } else if (event.type === "done") {
              // Finalize: remove streaming flag, update sidebar
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId ? { ...m, isStreaming: false } : m,
                ),
              );
              // Update chat updatedAt in sidebar
              setChats((prev) =>
                prev.map((c) =>
                  c.id === chatId || true // chatId might have just been set
                    ? { ...c, updatedAt: new Date().toISOString() }
                    : c,
                ),
              );
            } else if (event.type === "error") {
              throw new Error(event.message);
            }
          } catch (parseErr) {
            // Skip malformed SSE lines
          }
        }
      }
    } catch (err) {
      if ((err as Error)?.name === "AbortError") {
        // User stopped — just remove the streaming flag
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId ? { ...m, isStreaming: false } : m,
          ),
        );
      } else {
        const msg = err instanceof Error ? err.message : "Something went wrong";
        toast.error(msg);
        // Remove the empty assistant placeholder
        setMessages((prev) => prev.filter((m) => m.id !== assistantMsgId));
      }
    } finally {
      setIsLoading(false);
      setStreamingMessageId(null);
      abortRef.current = null;
    }
  }, [input, isLoading, chatId]);

  // ─── Stop streaming ────────────────────────────────────────────────────────
  const handleStop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  // ─── Regenerate last assistant message ────────────────────────────────────
  const handleRegenerate = useCallback(() => {
    // Find the last user message
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUserMsg) return;

    // Remove the last assistant message
    setMessages((prev) => {
      const lastAssistantIdx = prev.findLastIndex((m) => m.role === "assistant");
      if (lastAssistantIdx === -1) return prev;
      return prev.filter((_, i) => i !== lastAssistantIdx);
    });

    handleSend(lastUserMsg.content);
  }, [messages, handleSend]);

  // ─── Quick action handler ──────────────────────────────────────────────────
  const handleActionSelect = useCallback((action: QuickAction) => {
    if (action.id === "proposal") {
      setIsProposalDialogOpen(true);
    } else {
      setInput(action.prompt);
    }
  }, []);

  // ─── Proposal streaming into chat ─────────────────────────────────────────
  const [proposalAssistantId] = useState(() => tempId());
  const proposalInitialized = useRef(false);

  const handleProposalStream = useCallback((partialText: string) => {
    setMessages((prev) => {
      const existing = prev.find((m) => m.id === proposalAssistantId);
      if (!existing) {
        // First token — inject the streaming message
        const userMsg: Message = {
          id: tempId(),
          role: "user",
          content: "Generate a professional proposal",
        };
        return [
          ...prev,
          userMsg,
          { id: proposalAssistantId, role: "assistant", content: partialText, isStreaming: true },
        ];
      }
      return prev.map((m) =>
        m.id === proposalAssistantId ? { ...m, content: partialText } : m,
      );
    });
  }, [proposalAssistantId]);

  // Finalize proposal when dialog closes after generation
  const handleProposalDialogChange = useCallback((open: boolean) => {
    setIsProposalDialogOpen(open);
    if (!open) {
      // Mark the streaming message as done
      setMessages((prev) =>
        prev.map((m) =>
          m.id === proposalAssistantId ? { ...m, isStreaming: false } : m,
        ),
      );
    }
  }, [proposalAssistantId]);

  // ─── Sidebar callbacks ─────────────────────────────────────────────────────
  const handleChatDeleted = useCallback((deletedId: string) => {
    setChats((prev) => prev.filter((c) => c.id !== deletedId));
    if (chatId === deletedId) {
      handleNewChat();
    }
  }, [chatId, handleNewChat]);

  const handleChatRenamed = useCallback((renamedId: string, newTitle: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id === renamedId ? { ...c, title: newTitle } : c)),
    );
  }, []);

  // Update sidebar title when server generates it
  useEffect(() => {
    if (!chatId) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/ai/history");
        if (res.ok) {
          const data = await res.json();
          setChats(data.chats ?? []);
        }
      } catch { /* ignore */ }
    }, 5000);
    return () => clearInterval(interval);
  }, [chatId]);

  const showHero = messages.length === 0;

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] w-full">
      {/* Conversation sidebar */}
      <ConversationSidebar
        activeChatId={chatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onChatDeleted={handleChatDeleted}
        onChatRenamed={handleChatRenamed}
        chats={chats}
        isLoadingHistory={isLoadingHistory}
      />

      {/* Main chat area */}
      <div className="flex flex-col flex-1 min-w-0 max-w-4xl mx-auto px-4 md:px-6 pb-4 overflow-hidden">
        {showHero && (
          <div className="flex-shrink-0">
            <AIHero />
            <div className="mb-1.5">
              <QuickActionsGrid onActionSelect={handleActionSelect} disabled={isLoading} />
            </div>
          </div>
        )}

        <div className={showHero ? "flex-1 min-h-0 mt-2" : "flex-1 min-h-0 pt-4"}>
          <AIChat
            messages={messages}
            input={input}
            setInput={setInput}
            onSend={() => handleSend()}
            isLoading={isLoading}
            onStop={handleStop}
            onRegenerate={handleRegenerate}
          />
        </div>
      </div>

      <ProposalDialog
        open={isProposalDialogOpen}
        onOpenChange={handleProposalDialogChange}
        onProposalGenerated={handleProposalStream}
      />
    </div>
  );
}
