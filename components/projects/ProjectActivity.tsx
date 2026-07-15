import { formatDistanceToNow } from "date-fns";

interface Props {
  activities: {
    id: string;
    action: string;
    createdAt: Date;
    user: {
      name: string | null;
    } | null;
  }[];
}

const formatAction = (action: string) => {
  switch (action) {
    case "TASK_CREATED":
      return "added a new task";
    case "TASK_EDITED":
      return "edited a task";
    case "TASK_COMPLETED":
      return "completed a task";
    case "TASK_DELETED":
      return "deleted a task";
    case "MESSAGE_SENT":
      return "sent a message";
    case "PROJECT_CREATED":
      return "created the project";
    case "PROJECT_UPDATED":
      return "updated the project details";
    case "PROJECT_COMPLETED":
      return "marked the project as completed";
    case "INVOICE_SENT":
      return "sent an invoice";
    case "INVOICE_PAID":
      return "paid an invoice";
    case "FILE_UPLOADED":
      return "uploaded a file";
    default:
      return action.replace(/_/g, " ").toLowerCase();
  }
};

export default function ProjectActivity({ activities }: Props) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold tracking-tight">Activity Log</h2>

      {activities.length === 0 && (
        <p className="text-muted-foreground text-sm">No activity yet.</p>
      )}

      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="relative pl-4 border-l-2 border-muted">
            <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-primary" />
            <p className="text-sm">
              <span className="font-medium text-foreground">{activity.user?.name ?? "Unknown"}</span>{" "}
              <span className="text-muted-foreground">{formatAction(activity.action)}</span>
            </p>

            <p className="text-xs text-muted-foreground mt-0.5">
              {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
