"use client";

import { useRef, useEffect } from "react";
import { AIMessage, Message } from "./AIMessage";
import { AIEmptyState } from "./AIEmptyState";
import { AIInput } from "./AIInput";

interface AIChatProps {
  messages: Message[];
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isLoading?: boolean;
  onStop?: () => void;
  onRegenerate?: () => void;
}

export function AIChat({
  messages,
  input,
  setInput,
  onSend,
  isLoading = false,
  onStop,
  onRegenerate,
}: AIChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change (streaming-safe)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-background/50 rounded-3xl border border-border/50 shadow-sm overflow-hidden relative">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-border/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-border/80 transition-colors"
      >
        {messages.length === 0 ? (
          <AIEmptyState />
        ) : (
          <div className="flex flex-col space-y-6 max-w-3xl mx-auto w-full pb-4">
            {messages.map((message, index) => (
              <AIMessage
                key={message.id}
                message={message}
                onRegenerate={
                  message.role === "assistant" && index === messages.length - 1 && !isLoading
                    ? onRegenerate
                    : undefined
                }
              />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="p-4 bg-gradient-to-t from-background via-background to-transparent pt-8 mt-auto sticky bottom-0">
        <AIInput
          input={input}
          setInput={setInput}
          onSend={onSend}
          isLoading={isLoading}
          onStop={onStop}
        />
      </div>
    </div>
  );
}
