import React from "react";
import { cn } from "@/lib/utils";

export function PriorityBadge({ priority, className }: { priority: string; className?: string }) {
  const config = {
    URGENT: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-900",
    HIGH: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-900",
    MEDIUM: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900",
    LOW: "bg-muted text-muted-foreground border-border",
  }[priority] ?? "bg-muted text-muted-foreground border-border";

  return (
    <span className={cn(`text-xs font-medium px-1.5 py-0.5 rounded border ${config}`, className)}>
      {priority.charAt(0) + priority.slice(1).toLowerCase()}
    </span>
  );
}
