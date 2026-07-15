import { TaskStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Props {
  status: TaskStatus;
}

export default function TaskStatusBadge({ status }: Props) {
  const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
    TODO: { label: "To Do", className: "bg-slate-100 text-slate-700 hover:bg-slate-200 border-transparent dark:bg-slate-800 dark:text-slate-300" },
    IN_PROGRESS: { label: "In Progress", className: "bg-blue-100 text-blue-700 hover:bg-blue-200 border-transparent dark:bg-blue-900/50 dark:text-blue-300" },
    DONE: { label: "Done", className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-transparent dark:bg-emerald-900/50 dark:text-emerald-300" },
  };

  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn("whitespace-nowrap font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
