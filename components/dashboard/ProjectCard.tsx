import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProjectStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const statusLabels: Record<ProjectStatus, string> = {
  PLANNING: "Planning",
  IN_PROGRESS: "In Progress",
  REVIEW: "In Review",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const statusVariants: Record<ProjectStatus, "default" | "secondary" | "outline"> = {
  PLANNING: "outline",
  IN_PROGRESS: "default",
  REVIEW: "secondary",
  COMPLETED: "outline",
  CANCELLED: "outline",
};

type ProjectCardProps = {
  project: {
    id: string;
    title: string;
    customerName: string;
    status: ProjectStatus;
    dueDate: Date | null;
    _count?: { tasks: number };
  };
  className?: string;
};

export function ProjectCard({ project, className }: ProjectCardProps) {
  // A mock progress calculation since we don't track completed task count in this small query right now
  const progress = project.status === "COMPLETED" ? 100 : project.status === "PLANNING" ? 0 : 50;

  return (
    <article
      className={cn(
        "card-interactive rounded-2xl bg-card p-5 group",
        className
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold transition-colors duration-200 group-hover:text-foreground">{project.title}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{project.customerName}</p>
        </div>
        <Badge variant={statusVariants[project.status]} className="transition-all duration-200 group-hover:scale-105">
          {statusLabels[project.status]}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span className="font-medium tabular-nums text-foreground">
            {progress}%
          </span>
        </div>
        <Progress value={progress} className="h-1.5 transition-all duration-300" />
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Due in <span className="font-medium text-foreground">{project.dueDate ? formatDistanceToNow(new Date(project.dueDate)) : "N/A"}</span>
      </p>
    </article>
  );
}
