"use client";
import { Paperclip, Smile, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface MessageInputProps {
  onSendMessage?: (content: string) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage?.(message.trim());
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-10 w-10 shrink-0 rounded-lg"
      >
        <Paperclip className="size-5" />
      </Button>

      <div className="flex-1">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="h-10 rounded-xl"
        />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-10 w-10 shrink-0 rounded-lg"
      >
        <Smile className="size-5" />
      </Button>

      <Button
        type="submit"
        size="icon"
        className="h-10 w-10 shrink-0 rounded-xl"
        disabled={!message.trim()}
        style={{ background: "var(--gradient-brand)" }}
      >
        <Send className="size-4" />
      </Button>
    </form>
  );
}
