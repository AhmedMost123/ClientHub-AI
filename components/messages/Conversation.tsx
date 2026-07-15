"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import EmptyConversation from "./EmptyConversation";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import { sendMessage } from "@/lib/actions/send-message";

interface Props {
  currentUserId: string;
  projectId: string;
  hasLinkedClient: boolean;
  conversation: {
    messages: {
      id: string;
      content: string;
      createdAt: Date;
      sender: {
        id: string;
        name: string | null;
      };
    }[];
  } | null;
}

export default function Conversation({ currentUserId, projectId, hasLinkedClient, conversation }: Props) {
  const [isPending, startTransition] = useTransition();
  const messages = conversation?.messages ?? [];

  const handleSendMessage = async (content: string) => {
    startTransition(async () => {
      const result = await sendMessage(projectId, content);
      if (!result.success) {
        toast.error(result.error);
      }
    });
  };

  return (
    <section className="rounded-2xl border bg-card shadow-sm">
      <div className="border-b p-6">
        <h2 className="text-lg font-semibold tracking-tight">Conversation</h2>
      </div>

      <div className="h-[500px] overflow-y-auto p-6 flex flex-col">
        {!hasLinkedClient && messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">No Client Linked</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              Attach a client to this project to enable chat and messaging.
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center">
            <EmptyConversation />
          </div>
        ) : (
          <MessageList currentUserId={currentUserId} messages={messages} />
        )}
      </div>

      <div className="border-t p-6">
        <MessageInput
          onSend={handleSendMessage}
          disabled={!hasLinkedClient || isPending}
        />
      </div>
    </section>
  );
}
