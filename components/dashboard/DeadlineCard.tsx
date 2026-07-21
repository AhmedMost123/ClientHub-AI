import { Badge } from "@/components/ui/badge";
import type { DeadlineItem } from "@/lib/actions/dashboard/get-dashboard-data";
import { cn } from "@/lib/utils";

type DeadlineCardProps = {
  deadline: DeadlineItem;
  className?: string;
};

/**
 * Format a real Date into a human-readable deadline label.
 * Returns "Overdue", "Today", "Tomorrow", or a short date string.
 */
function formatDeadlineLabel(date: Date): { label: string; urgency: "overdue" | "today" | "soon" | "future" } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((target.getTime() - today.getTime()) / 86_400_000);

  if (diffDays < 0) return { label: "Overdue", urgency: "overdue" };
  if (diffDays === 0) return { label: "Today", urgency: "today" };
  if (diffDays === 1) return { label: "Tomorrow", urgency: "soon" };
  return {
    label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    urgency: "future",
  };
}

export function DeadlineCard({ deadline, className }: DeadlineCardProps) {
  const { label, urgency } = formatDeadlineLabel(deadline.dueDate);

  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 rounded-xl p-3 transition-colors hover:bg-muted/40",
        className
      )}
    >
      <div className="min-w-0">
        <h4 className="font-medium leading-snug">{deadline.title}</h4>
        <p className="mt-0.5 text-sm text-muted-foreground">{deadline.company}</p>
      </div>
      <Badge
        variant={urgency === "overdue" || urgency === "today" ? "destructive" : "secondary"}
        className={cn(
          "shrink-0",
          urgency === "overdue" && "opacity-70",
        )}
      >
        {label}
      </Badge>
    </div>
  );
}
