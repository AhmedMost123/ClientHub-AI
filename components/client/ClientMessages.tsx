import Link from "next/link";
import type { ClientDashboardMessage } from "@/lib/actions/get-client-dashboard-data";
import { Button } from "@/components/ui/button";
import { MessageCircle, User, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Skeleton ──────────────────────────────────────────────────────────────────

function MessageRowSkeleton() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/50 p-3">
      <div className="size-10 shrink-0 animate-pulse rounded-full bg-muted" />
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="h-3 w-28 animate-pulse rounded-full bg-muted" />
          <div className="h-2.5 w-12 animate-pulse rounded-full bg-muted/70" />
        </div>
        <div className="h-2.5 w-full animate-pulse rounded-full bg-muted/70" />
        <div className="h-2.5 w-3/4 animate-pulse rounded-full bg-muted/50" />
      </div>
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────

interface ClientMessagesProps {
  messages: ClientDashboardMessage[] | null;
}

export function ClientMessages({ messages }: ClientMessagesProps) {
  // Loading skeleton
  if (messages === null) {
    return (
      <div className="card-premium rounded-2xl p-6">
        <div className="mb-4 h-5 w-36 animate-pulse rounded-full bg-muted" />
        <div className="space-y-3">
          <MessageRowSkeleton />
          <MessageRowSkeleton />
        </div>
        <div className="mt-4 h-10 w-full animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="card-premium rounded-2xl p-6">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div
            className="mb-3 flex size-12 items-center justify-center rounded-xl"
            style={{ background: "var(--gradient-brand-subtle)" }}
          >
            <MessageCircle className="size-6" style={{ color: "var(--color-primary)" }} />
          </div>
          <h3 className="text-sm font-semibold">No messages yet.</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Messages from your freelancer will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-premium rounded-2xl p-6">
      <h2 className="mb-4 text-lg font-semibold">Messages Preview</h2>
      <div className="space-y-3">
        {messages.map((message) => (
          <Link
            key={message.id}
            href={`/client/projects/${message.projectId}`}
            className={cn(
              "flex items-start gap-3 rounded-lg border p-3 transition-all hover:border-border",
              message.isRead
                ? "border-border/50"
                : "border-primary/30 bg-primary/5"
            )}
          >
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-full"
              style={{ background: "var(--gradient-brand-subtle)" }}
            >
              <User className="size-5" style={{ color: "var(--color-primary)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className={cn("text-sm font-medium", !message.isRead && "font-semibold")}>
                  {message.senderName}
                </p>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(message.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {message.hasAttachment && !message.content ? (
                  <span className="flex items-center gap-1">
                    <Paperclip className="size-3" />
                    Attachment
                  </span>
                ) : (
                  message.content
                )}
              </p>
              {message.hasAttachment && message.content && (
                <span className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Paperclip className="size-3" />
                  Has attachment
                </span>
              )}
            </div>
            {!message.isRead && (
              <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
            )}
          </Link>
        ))}
      </div>
      <Button variant="outline" className="mt-4 w-full rounded-xl" asChild>
        <Link href="/client/projects">Open Chat</Link>
      </Button>
    </div>
  );
}
