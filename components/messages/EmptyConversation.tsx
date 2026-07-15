import { MessageSquare } from "lucide-react";

export default function EmptyConversation() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-14 text-center">
      <MessageSquare className="mb-4 size-10 text-muted-foreground" />

      <h3 className="text-lg font-semibold">No conversation yet</h3>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Start the discussion with your client. Messages, files and AI summaries
        will appear here.
      </p>
    </div>
  );
}
