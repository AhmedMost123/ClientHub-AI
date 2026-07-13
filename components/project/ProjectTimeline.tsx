import { Clock, User, FileText, DollarSign, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  event: string;
  timestamp: string;
  actor: "client" | "freelancer" | "system";
  projectId: string;
}

interface ProjectTimelineProps {
  events: TimelineEvent[];
}

export function ProjectTimeline({ events }: ProjectTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="card-premium rounded-2xl p-6">
        <h2 className="mb-4 text-lg font-semibold">Activity Timeline</h2>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div
            className="mb-3 flex size-12 items-center justify-center rounded-xl"
            style={{ background: "var(--gradient-brand-subtle)" }}
          >
            <Clock className="size-6" style={{ color: "var(--color-primary)" }} />
          </div>
          <h3 className="text-sm font-semibold">No activity yet</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Project activity will appear here
          </p>
        </div>
      </div>
    );
  }

  const getIcon = (event: string) => {
    if (event.includes("uploaded")) return FileText;
    if (event.includes("Invoice")) return DollarSign;
    if (event.includes("complete")) return CheckCircle;
    return Clock;
  };

  const getActorLabel = (actor: string) => {
    if (actor === "client") return "You";
    if (actor === "freelancer") return "Freelancer";
    return "System";
  };

  return (
    <div className="card-premium rounded-2xl p-6">
      <h2 className="mb-4 text-lg font-semibold">Activity Timeline</h2>
      <div className="space-y-4">
        {events.map((event, index) => {
          const Icon = getIcon(event.event);
          return (
            <div key={event.id} className="flex gap-3">
              {/* Timeline Line */}
              {index !== events.length - 1 && (
                <div className="absolute mt-8 ml-4 h-full w-0.5 bg-border" />
              )}

              {/* Icon */}
              <div
                className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-background"
                style={{ background: "var(--gradient-brand-subtle)" }}
              >
                <Icon className="size-4" style={{ color: "var(--color-primary)" }} />
              </div>

              {/* Content */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{event.event}</p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(event.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  by {getActorLabel(event.actor)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
