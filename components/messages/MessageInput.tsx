"use client";

import { useState } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  onSend(message: string): void;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled }: Props) {
  const [message, setMessage] = useState("");

  function submit() {
    if (!message.trim() || disabled) return;

    onSend(message);
    setMessage("");
  }

  return (
    <div className="flex items-end gap-3">
      <Textarea
        rows={2}
        placeholder={disabled ? "Messaging disabled" : "Write a message..."}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={disabled}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
      />

      <Button onClick={submit} disabled={disabled || !message.trim()} className="h-10 w-10 p-0">
        <Send className="size-4" />
      </Button>
    </div>
  );
}
