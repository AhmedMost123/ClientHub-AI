import { clientMessages } from "@/lib/mock/client-dashboard";
import { Button } from "@/components/ui/button";
import { MessageCircle, User } from "lucide-react";

export function ClientMessages() {
  if (clientMessages.length === 0) {
    return (
      <div className="card-premium rounded-2xl p-6">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div
            className="mb-3 flex size-12 items-center justify-center rounded-xl"
            style={{ background: "var(--gradient-brand-subtle)" }}
          >
            <MessageCircle className="size-6" style={{ color: "var(--color-primary)" }} />
          </div>
          <h3 className="text-sm font-semibold">No messages yet</h3>
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
        {clientMessages.slice(0, 3).map((message) => (
          <div
            key={message.id}
            className="flex items-start gap-3 rounded-lg border border-border/50 p-3 transition-all hover:border-border"
          >
            <div
              className="flex size-10 items-center justify-center rounded-full"
              style={{ background: "var(--gradient-brand-subtle)" }}
            >
              <User className="size-5" style={{ color: "var(--color-primary)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{message.senderName}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {message.time}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {message.preview}
              </p>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" className="mt-4 w-full rounded-xl">
        Open Chat
      </Button>
    </div>
  );
}
