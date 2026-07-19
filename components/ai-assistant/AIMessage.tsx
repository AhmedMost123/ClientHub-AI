"use client";

import { cn } from "@/lib/utils";
import { Sparkles, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AIMarkdown } from "./AIMarkdown";
import { MessageActions } from "./MessageActions";
import { AITypingIndicator } from "./AITypingIndicator";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

interface AIMessageProps {
  message: Message;
  onRegenerate?: () => void;
}

export function AIMessage({ message, onRegenerate }: AIMessageProps) {
  const isAssistant = message.role === "assistant";
  const isEmpty = isAssistant && !message.content && message.isStreaming;

  return (
    <div className={cn("flex w-full gap-3 group", isAssistant ? "justify-start" : "justify-end")}>
      {isAssistant && (
        <Avatar className="w-8 h-8 shrink-0 bg-primary/10 text-primary border border-primary/20 mt-0.5">
          <AvatarFallback className="bg-transparent">
            <Sparkles className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn("flex flex-col max-w-[85%] md:max-w-[78%]", isAssistant ? "items-start" : "items-end")}>
        <div
          className={cn(
            "px-4 py-3 rounded-2xl text-[15px] leading-relaxed",
            isAssistant
              ? "bg-surface border border-border/50 text-foreground rounded-tl-sm shadow-sm"
              : "bg-primary text-primary-foreground rounded-tr-sm shadow-md",
          )}
        >
          {isEmpty ? (
            <AITypingIndicator />
          ) : isAssistant ? (
            <AIMarkdown content={message.content} />
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}

          {/* Streaming cursor */}
          {isAssistant && message.isStreaming && message.content && (
            <span className="inline-block w-0.5 h-4 bg-foreground/70 ml-0.5 align-middle animate-pulse" />
          )}
        </div>

        {/* Message actions — only for completed assistant messages */}
        {isAssistant && !message.isStreaming && message.content && (
          <MessageActions content={message.content} onRegenerate={onRegenerate} />
        )}
      </div>

      {!isAssistant && (
        <Avatar className="w-8 h-8 shrink-0 bg-secondary text-secondary-foreground border border-border/50 mt-0.5">
          <AvatarFallback className="bg-transparent">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
