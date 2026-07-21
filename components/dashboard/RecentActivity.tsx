import { formatDistanceToNow } from "date-fns";
import { Bell } from "lucide-react";
import { ChartCard } from "@/components/dashboard/ChartCard";
import type { ActivityItem } from "@/lib/actions/dashboard/get-dashboard-data";
import { NotificationEvent } from "@prisma/client";
import { cn } from "@/lib/utils";

type RecentActivityProps = {
  activities: ActivityItem[];
};

/**
 * Maps each NotificationEvent to a dot colour class matching the existing palette.
 */
function eventColour(event: NotificationEvent): string {
  switch (event) {
    case NotificationEvent.INVOICE_PAID:
      return "bg-success";
    case NotificationEvent.NEW_MESSAGE:
      return "bg-chart-2";
    case NotificationEvent.PROJECT_COMPLETED:
      return "bg-chart-1";
    case NotificationEvent.FILE_UPLOADED:
      return "bg-chart-4";
    case NotificationEvent.TASK_ASSIGNED:
      return "bg-chart-3";
    case NotificationEvent.PROJECT_INVITATION:
    case NotificationEvent.PROJECT_INVITATION_ACCEPTED:
    case NotificationEvent.PROJECT_INVITATION_DECLINED:
    default:
      return "bg-muted-foreground/40";
  }
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <ChartCard title="Recent Activity" description="Latest updates across your workspace">
      {activities.length > 0 ? (
        <ul className="space-y-1" aria-label="Recent activity">
          {activities.map((item, index) => (
            <li
              key={item.id}
              className="flex items-center gap-4 rounded-xl p-3 transition-all duration-200 hover:bg-muted/40 hover:translate-x-1"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  eventColour(item.event),
                )}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="text-muted-foreground">{item.title}</span>{" "}
                  {item.message && (
                    <span className="font-medium transition-colors duration-200 hover:text-foreground">
                      {item.message}
                    </span>
                  )}
                </p>
              </div>
              <time className="shrink-0 text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
              </time>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
          <Bell className="size-8 text-muted-foreground/40" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">No recent activity</p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Actions like messages, invoices, and project updates will appear here.
            </p>
          </div>
        </div>
      )}
    </ChartCard>
  );
}
