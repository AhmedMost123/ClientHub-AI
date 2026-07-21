import React from "react";
import { cn } from "@/lib/utils";

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const config = {
    TODO: "bg-muted text-muted-foreground",
    IN_PROGRESS: "bg-blue-500/10 text-blue-600",
    DONE: "bg-emerald-500/10 text-emerald-600",
  }[status] ?? "bg-muted text-muted-foreground";

  const labels: Record<string, string> = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    DONE: "Done",
  };

  return (
    <span className={cn(`text-xs font-medium px-1.5 py-0.5 rounded ${config}`, className)}>
      {labels[status] ?? status}
    </span>
  );
}
