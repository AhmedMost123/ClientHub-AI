import { Calendar } from "lucide-react";

import { ChartCard } from "@/components/dashboard/ChartCard";
import { calendarEvents } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const typeStyles = {
  meeting: "border-l-chart-1",
  deadline: "border-l-destructive",
  call: "border-l-chart-2",
};

export function CalendarPreview() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <ChartCard
      title="Today's Schedule"
      description={today}
      action={
        <Calendar className="size-4 text-muted-foreground" aria-hidden />
      }
    >
      <ul className="space-y-2" aria-label="Today's calendar events">
        {calendarEvents.map((event) => (
          <li
            key={event.id}
            className={cn(
              "rounded-xl border border-border/60 border-l-[3px] bg-muted/20 px-4 py-3",
              typeStyles[event.type]
            )}
          >
            <p className="text-sm font-medium">{event.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{event.time}</p>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}
