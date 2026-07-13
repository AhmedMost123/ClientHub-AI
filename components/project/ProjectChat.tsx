import { User, Paperclip, Smile, Send, Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { MessageInput } from "./MessageInput";

interface Message {
  id: string;
  senderName?: string;
  senderRole: "freelancer" | "client" | "system";
  senderAvatar: string | null;
  content: string;
  timestamp: string;
  deliveryState?: "sent" | "delivered" | "read";
  type: "text" | "attachment" | "system";
  attachment?: {
    fileName: string;
    fileSize: string;
  };
}

interface ProjectChatProps {
  messages: Message[];
  onSendMessage?: (content: string) => void;
}

export function ProjectChat({ messages, onSendMessage }: ProjectChatProps) {
  return (
    <div className="card-premium rounded-2xl p-6">
      <h2 className="mb-4 text-lg font-semibold">Conversation</h2>
      
      {/* Messages */}
      <div className="mb-4 max-h-[400px] space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
}

function ChatMessage({ message }: { message: Message }) {
  if (message.type === "system") {
    return (
      <div className="flex justify-center">
        <div className="rounded-lg bg-muted px-3 py-1.5 text-xs text-muted-foreground">
          {message.content}
        </div>
      </div>
    );
  }

  const isOwn = message.senderRole === "client";

  return (
    <div
      className={cn(
        "flex gap-3",
        isOwn ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className="flex size-8 shrink-0 items-center justify-center rounded-full"
        style={{ background: "var(--gradient-brand-subtle)" }}
      >
        {message.senderAvatar ? (
          <img
            src={message.senderAvatar}
            alt={message.senderName}
            className="size-8 rounded-full object-cover"
          />
        ) : (
          <User className="size-4" style={{ color: "var(--color-primary)" }} />
        )}
      </div>

      {/* Message Content */}
      <div className={cn("flex max-w-[70%] flex-col gap-1", isOwn ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5",
            isOwn
              ? "rounded-tr-sm"
              : "rounded-tl-sm",
            isOwn
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          )}
        >
          {message.type === "attachment" && message.attachment && (
            <div className="mb-2 flex items-center gap-2 rounded-lg bg-background/10 p-2">
              <Paperclip className="size-4" />
              <div>
                <p className="text-sm font-medium">{message.attachment.fileName}</p>
                <p className="text-xs opacity-70">{message.attachment.fileSize}</p>
              </div>
            </div>
          )}
          <p className="text-sm">{message.content}</p>
        </div>

        {/* Timestamp & Delivery State */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {isOwn && message.deliveryState && (
            <span className="flex items-center gap-0.5">
              {message.deliveryState === "read" ? (
                <CheckCheck className="size-3 text-primary" />
              ) : (
                <Check className="size-3" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
