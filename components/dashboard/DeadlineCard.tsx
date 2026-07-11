import { Badge } from "@/components/ui/badge";
import type { Deadline } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type DeadlineCardProps = {
  deadline: Deadline;
  className?: string;
};

export function DeadlineCard({ deadline, className }: DeadlineCardProps) {
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
        variant={deadline.urgent ? "destructive" : "secondary"}
        className="shrink-0"
      >
        {deadline.date}
      </Badge>
    </div>
  );
}
