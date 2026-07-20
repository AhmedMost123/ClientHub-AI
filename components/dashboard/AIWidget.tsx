"use client";

import { Send, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type AIWidgetProps = {
  /** Real pending invoice count from the dashboard data layer. */
  pendingInvoicesCount: number;
  className?: string;
};

export function AIWidget({ pendingInvoicesCount, className }: AIWidgetProps) {
  const router = useRouter();
  const [input, setInput] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const message = input.trim();
    if (!message) return;
    // Navigate to the AI Assistant and pre-fill the message via URL param.
    // The AI page reads this param on mount, populates the input, and sends it.
    router.push(`/ai-assistant?q=${encodeURIComponent(message)}`);
  }

  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/80 shadow-[var(--shadow-card)] transition-all duration-200 hover:shadow-[var(--shadow-card-hover)] hover:border-border",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full opacity-40 blur-3xl transition-opacity duration-500 hover:opacity-50"
        style={{ background: "var(--gradient-brand)" }}
        aria-hidden
      />
      <CardHeader className="relative pb-3">
        <div className="flex items-center gap-2">
          <div
            className="flex size-8 items-center justify-center rounded-lg text-white shadow-md transition-transform duration-200 hover:scale-110"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Sparkles className="size-4" aria-hidden />
          </div>
          <CardTitle className="text-base font-semibold">Hub AI</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-4">
        <div className="rounded-xl border border-border/60 bg-muted/40 p-4 text-sm leading-relaxed text-foreground/90 transition-colors duration-200 hover:bg-muted/60">
          {pendingInvoicesCount > 0 ? (
            <>
              I noticed you have{" "}
              <span className="font-semibold text-foreground">
                {pendingInvoicesCount} pending {pendingInvoicesCount === 1 ? "invoice" : "invoices"}
              </span>
              . Would you like me to draft a payment reminder?
            </>
          ) : (
            <>
              Ask me anything — I can help you write proposals, summarise projects, or draft client messages.
            </>
          )}
        </div>
        <form
          className="flex gap-2"
          onSubmit={handleSubmit}
          aria-label="Ask Hub AI"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI anything..."
            className="h-10 rounded-xl bg-background/80 transition-all duration-200 focus:bg-background focus:ring-2 focus:ring-sidebar-accent"
            aria-label="AI prompt"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim()}
            className="size-10 shrink-0 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:opacity-50"
            style={{ background: "var(--gradient-brand)" }}
            aria-label="Send message"
          >
            <Send className="size-4 transition-transform duration-200 hover:translate-x-px" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
