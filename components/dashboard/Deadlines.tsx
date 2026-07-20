import { CalendarClock } from "lucide-react";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DeadlineCard } from "@/components/dashboard/DeadlineCard";
import type { DeadlineItem } from "@/lib/actions/get-dashboard-data";

type DeadlinesProps = {
  deadlines: DeadlineItem[];
};

export default function Deadlines({ deadlines }: DeadlinesProps) {
  return (
    <ChartCard title="Upcoming Deadlines" description="Tasks & projects due soon">
      {deadlines.length > 0 ? (
        <div className="divide-y divide-border/60">
          {deadlines.map((deadline) => (
            <DeadlineCard key={`${deadline.type}-${deadline.id}`} deadline={deadline} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
          <CalendarClock className="size-8 text-muted-foreground/40" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">No upcoming deadlines</p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Tasks and projects with due dates will appear here.
            </p>
          </div>
        </div>
      )}
    </ChartCard>
  );
}
