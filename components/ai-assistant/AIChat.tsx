import { useState, useRef, useEffect } from "react";
import { AIMessage, Message } from "./AIMessage";
import { AIEmptyState } from "./AIEmptyState";
import { AIInput } from "./AIInput";

interface AIChatProps {
  messages: Message[];
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
}

export function AIChat({ messages, input, setInput, onSend }: AIChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-background/50 rounded-3xl border border-border/50 shadow-sm overflow-hidden mt-6 relative">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-border/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-border/80 transition-colors"
      >
        {messages.length === 0 ? (
          <AIEmptyState />
        ) : (
          <div className="flex flex-col space-y-6 max-w-3xl mx-auto w-full pb-4">
            {messages.map((message) => (
              <AIMessage key={message.id} message={message} />
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-gradient-to-t from-background via-background to-transparent pt-8 mt-auto sticky bottom-0">
        <AIInput input={input} setInput={setInput} onSend={onSend} />
      </div>
    </div>
  );
}
