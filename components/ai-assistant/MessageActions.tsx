"use client";

import { useState } from "react";
import { Copy, RefreshCw, ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MessageActionsProps {
  content: string;
  onRegenerate?: () => void;
  className?: string;
}

export function MessageActions({ content, onRegenerate, className }: MessageActionsProps) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200", className)}>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
        onClick={handleCopy}
        title="Copy message"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-green-500" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </Button>

      {onRegenerate && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          onClick={onRegenerate}
          title="Regenerate response"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </Button>
      )}

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-7 w-7 rounded-lg text-muted-foreground hover:bg-muted",
          feedback === "up" && "text-green-500 bg-green-500/10",
        )}
        onClick={() => setFeedback(feedback === "up" ? null : "up")}
        title="Good response"
      >
        <ThumbsUp className="w-3.5 h-3.5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-7 w-7 rounded-lg text-muted-foreground hover:bg-muted",
          feedback === "down" && "text-red-500 bg-red-500/10",
        )}
        onClick={() => setFeedback(feedback === "down" ? null : "down")}
        title="Poor response"
      >
        <ThumbsDown className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}
