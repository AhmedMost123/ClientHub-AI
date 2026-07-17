import { MessageSquare } from "lucide-react";

export default function EmptyConversation() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 py-16 text-center shadow-sm">
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted">
        <MessageSquare className="size-7 text-muted-foreground" />
      </div>

      <h3 className="text-lg font-medium text-foreground">No messages yet</h3>

      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Start the conversation by sending a message. Messages, files and AI summaries
        will appear here.
      </p>
    </div>
  );
}
