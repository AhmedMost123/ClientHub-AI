"use client";

export function AITypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      <span
        className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce"
        style={{ animationDelay: "0ms", animationDuration: "1.2s" }}
      />
      <span
        className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce"
        style={{ animationDelay: "200ms", animationDuration: "1.2s" }}
      />
      <span
        className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce"
        style={{ animationDelay: "400ms", animationDuration: "1.2s" }}
      />
    </div>
  );
}
