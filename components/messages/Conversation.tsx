"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import EmptyConversation from "./EmptyConversation";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import { sendMessage } from "@/lib/actions/send-message";
import { useSocket } from "@/components/providers/socket-provider";

// ─── Types ────────────────────────────────────────────────────────────────────

type MessageStatus = "sending" | "sent" | "failed";

interface ChatFile {
  id: string;
  originalName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

interface Message {
  id: string;
  content: string | null;
  createdAt: Date;
  conversationId?: string;
  sender: {
    id: string;
    name: string | null;
    avatar?: string | null;
  };
  files: ChatFile[];
  /** Present only on optimistic (client-generated) messages */
  _optimistic?: boolean;
  /** Tracks the lifecycle of an optimistic message */
  _status?: MessageStatus;
  /**
   * The temporary client-side ID assigned before the server responds.
   * After reconciliation the real server ID is used, but _tempId lets us
   * skip the socket broadcast deduplication for already-reconciled messages.
   */
  _tempId?: string;
}

interface Props {
  currentUserId: string;
  currentUserName: string | null;
  projectId: string;
  hasLinkedClient: boolean;
  conversation: {
    id?: string;
    messages: Message[];
  } | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sortByDate(msgs: Message[]): Message[] {
  return [...msgs].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Conversation({
  currentUserId,
  currentUserName,
  projectId,
  hasLinkedClient,
  conversation,
}: Props) {
  const { socket, isConnected } = useSocket();
  const [localMessages, setLocalMessages] = useState<Message[]>(
    conversation?.messages ?? [],
  );

  /**
   * Map of  tempId → realId  for messages that have already been reconciled.
   * Used to prevent the socket broadcast from adding a duplicate after we've
   * already swapped the optimistic entry for the real one.
   */
  const reconciledTempIds = useRef<Map<string, string>>(new Map());

  // Track which socket rooms we've joined to avoid duplicate joins
  const joinedRoomsRef = useRef<Set<string>>(new Set());

  // ── Server → client sync (Next.js revalidation) ──────────────────────────
  useEffect(() => {
    const serverMessages = conversation?.messages ?? [];
    setLocalMessages((prev) => {
      const merged = [...prev];
      let changed = false;
      for (const sm of serverMessages) {
        if (!merged.find((m) => m.id === sm.id)) {
          merged.push(sm);
          changed = true;
        }
      }
      if (!changed) return prev;
      return sortByDate(merged);
    });
  }, [conversation?.messages]);

  // ── Socket: join rooms ────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket || !isConnected) return;

    const joinRoom = (room: string) => {
      if (!joinedRoomsRef.current.has(room)) {
        console.log(`[Chat] Joining room: "${room}"`);
        socket.emit("join_conversation", room);
        joinedRoomsRef.current.add(room);
      }
    };

    joinRoom(projectId);
    if (conversation?.id) {
      joinRoom(conversation.id);
    }
  }, [socket, isConnected, conversation?.id, projectId]);

  // ── Socket: incoming messages ─────────────────────────────────────────────
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewMessage = (message: Message) => {
      console.log(`[Chat] Received new_message: id=${message.id}`);
      setLocalMessages((prev) => {
        // 1. Already have the real message (normal deduplication)
        if (prev.find((m) => m.id === message.id)) {
          console.log(`[Chat] Deduplicated message: id=${message.id}`);
          return prev;
        }

        // 2. This real message was already reconciled from an optimistic one —
        //    the temp entry has already been replaced; skip the broadcast.
        const alreadyReconciled = [...reconciledTempIds.current.values()].includes(
          message.id,
        );
        if (alreadyReconciled) {
          console.log(`[Chat] Skipping broadcast — already reconciled: id=${message.id}`);
          return prev;
        }

        // 3. New message from another participant — add it.
        return sortByDate([...prev, message]);
      });
    };

    console.log(`[Chat] Registering new_message listener (socket: ${socket.id})`);
    socket.on("new_message", handleNewMessage);

    return () => {
      console.log(`[Chat] Removing new_message listener (socket: ${socket.id})`);
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, isConnected]);

  // ── Core send logic (extracted so retry can reuse it) ────────────────────
  const sendOptimistic = async (
    tempId: string,
    content: string,
    fileIds: string[],
    optimisticFiles: ChatFile[],
  ) => {
    try {
      const result = await sendMessage({ projectId, content, fileIds });

      if (!result.success) {
        // Mark as failed
        setLocalMessages((prev) =>
          prev.map((m) =>
            m.id === tempId ? { ...m, _status: "failed" as MessageStatus } : m,
          ),
        );
        toast.error(result.error);
        return;
      }

      const realMessage = result.data as Message;

      // Record the reconciliation so the socket broadcast is ignored
      reconciledTempIds.current.set(tempId, realMessage.id);

      // Swap the optimistic entry for the real server message
      setLocalMessages((prev) => {
        const updated = prev.map((m) =>
          m.id === tempId
            ? {
                ...realMessage,
                // Keep _tempId for debugging; clear optimistic flags
                _tempId: tempId,
                _optimistic: false,
                _status: "sent" as MessageStatus,
              }
            : m,
        );
        return sortByDate(updated);
      });

      // Broadcast to other participants via socket
      if (socket && isConnected) {
        const convId =
          (realMessage as any).conversationId ?? conversation?.id; // eslint-disable-line @typescript-eslint/no-explicit-any
        console.log(
          `[Chat] Emitting send_message: projectId="${projectId}" conversationId="${convId}"`,
        );
        socket.emit("send_message", {
          conversationId: convId,
          projectId,
          message: realMessage,
        });
      } else {
        console.warn("[Chat] Socket not connected — message not broadcast in real-time");
      }
    } catch (err) {
      console.error("[Chat] sendMessage threw:", err);
      setLocalMessages((prev) =>
        prev.map((m) =>
          m.id === tempId ? { ...m, _status: "failed" as MessageStatus } : m,
        ),
      );
      toast.error("Failed to send message");
    }
  };

  // ── Handle send (called by MessageInput) ─────────────────────────────────
  const handleSendMessage = async (content: string, fileIds: string[]) => {
    // Resolve uploaded files from the file IDs — we show them optimistically
    // as stubs; the real URLs arrive via the reconciled server message.
    const optimisticFiles: ChatFile[] = fileIds.map((id) => ({
      id,
      originalName: "Uploading…",
      fileUrl: "",
      fileSize: 0,
      mimeType: "application/octet-stream",
    }));

    const tempId = `optimistic_${crypto.randomUUID()}`;

    // 1. Show message immediately
    const optimisticMessage: Message = {
      id: tempId,
      content: content || null,
      createdAt: new Date(),
      sender: {
        id: currentUserId,
        name: currentUserName,
      },
      files: optimisticFiles,
      _optimistic: true,
      _status: "sending",
      _tempId: tempId,
    };

    setLocalMessages((prev) => sortByDate([...prev, optimisticMessage]));

    // 2. Send in background — non-blocking
    sendOptimistic(tempId, content, fileIds, optimisticFiles);
  };

  // ── Retry failed message ──────────────────────────────────────────────────
  const handleRetry = (messageId: string) => {
    const failedMsg = localMessages.find((m) => m.id === messageId);
    if (!failedMsg) return;

    // Reset to sending
    setLocalMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, _status: "sending" as MessageStatus } : m,
      ),
    );

    sendOptimistic(
      messageId,
      failedMsg.content ?? "",
      failedMsg.files.map((f) => f.id),
      failedMsg.files,
    );
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <section className="rounded-2xl border bg-card shadow-sm">
      <div className="border-b p-6">
        <h2 className="text-lg font-semibold tracking-tight">Conversation</h2>
      </div>

      <div className="flex h-[500px] flex-col overflow-y-auto p-6">
        {!hasLinkedClient && localMessages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">No Client Linked</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Attach a client to this project to enable chat and messaging.
            </p>
          </div>
        ) : localMessages.length === 0 ? (
          <div className="flex flex-1 flex-col justify-center">
            <EmptyConversation />
          </div>
        ) : (
          <MessageList
            currentUserId={currentUserId}
            messages={localMessages}
            onRetry={handleRetry}
          />
        )}
      </div>

      <div className="border-t p-6">
        <MessageInput
          projectId={projectId}
          onSend={handleSendMessage}
          disabled={!hasLinkedClient}
        />
      </div>
    </section>
  );
}
