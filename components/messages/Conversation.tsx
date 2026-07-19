"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import EmptyConversation from "./EmptyConversation";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import { sendMessage } from "@/lib/actions/send-message";
import { useSocket } from "@/components/providers/socket-provider";

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
  files: {
    id: string;
    originalName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }[];
}

interface Props {
  currentUserId: string;
  projectId: string;
  hasLinkedClient: boolean;
  conversation: {
    id?: string;
    messages: Message[];
  } | null;
}

export default function Conversation({ currentUserId, projectId, hasLinkedClient, conversation }: Props) {
  const [isPending, startTransition] = useTransition();
  const { socket, isConnected } = useSocket();
  const [localMessages, setLocalMessages] = useState<Message[]>(conversation?.messages ?? []);
  // Track which rooms we've joined to avoid duplicate joins
  const joinedRoomsRef = useRef<Set<string>>(new Set());

  // Merge server messages into local state when Next.js revalidates
  const serverMessagesRef = useRef(conversation?.messages ?? []);
  useEffect(() => {
    const serverMessages = conversation?.messages ?? [];
    serverMessagesRef.current = serverMessages;
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
      return merged.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    });
  }, [conversation?.messages]);

  // Join socket rooms as soon as socket is available and connected
  useEffect(() => {
    if (!socket || !isConnected) return;

    const joinRoom = (room: string) => {
      if (!joinedRoomsRef.current.has(room)) {
        console.log(`[Chat] Joining room: "${room}"`);
        socket.emit("join_conversation", room);
        joinedRoomsRef.current.add(room);
      }
    };

    // Always join the projectId room — it's the stable primary room
    joinRoom(projectId);
    // Also join conversationId if known
    if (conversation?.id) {
      joinRoom(conversation.id);
    }
  }, [socket, isConnected, conversation?.id, projectId]);

  // Register new_message listener
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewMessage = (message: Message) => {
      console.log(`[Chat] Received new_message: id=${message.id}`);
      setLocalMessages((prev) => {
        if (prev.find((m) => m.id === message.id)) {
          console.log(`[Chat] Deduplicated message: id=${message.id}`);
          return prev;
        }
        return [...prev, message].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      });
    };

    console.log(`[Chat] Registering new_message listener (socket: ${socket.id})`);
    socket.on("new_message", handleNewMessage);

    return () => {
      console.log(`[Chat] Removing new_message listener (socket: ${socket.id})`);
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, isConnected]);

  const handleSendMessage = async (content: string, fileIds: string[]) => {
    startTransition(async () => {
      const result = await sendMessage({ projectId, content, fileIds });
      if (!result.success) {
        toast.error(result.error);
      } else {
        const message = result.data as Message;

        // Emit to socket AFTER DB save — server broadcasts to all in room
        if (socket && isConnected) {
          const convId = (message as any).conversationId || conversation?.id; // eslint-disable-line @typescript-eslint/no-explicit-any
          console.log(`[Chat] Emitting send_message to server: projectId="${projectId}" conversationId="${convId}"`);
          socket.emit("send_message", {
            conversationId: convId,
            projectId,
            message,
          });
        } else {
          console.warn("[Chat] Socket not connected — message not broadcast in real-time");
        }

        // Optimistically add own message (server will also echo it back via io.to)
        setLocalMessages((prev) => {
          if (prev.find((m) => m.id === message.id)) return prev;
          return [...prev, message].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        });
      }
    });
  };

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
          <MessageList currentUserId={currentUserId} messages={localMessages} />
        )}
      </div>

      <div className="border-t p-6">
        <MessageInput
          projectId={projectId}
          onSend={handleSendMessage}
          disabled={!hasLinkedClient || isPending}
        />
      </div>
    </section>
  );
}
