import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Project } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusLabels: Record<Project["status"], string> = {
  "in-progress": "In Progress",
  review: "In Review",
  planning: "Planning",
};

const statusVariants: Record<
  Project["status"],
  "default" | "secondary" | "outline"
> = {
  "in-progress": "default",
  review: "secondary",
  planning: "outline",
};

type ProjectCardProps = {
  project: Project;
  className?: string;
};

export function ProjectCard({ project, className }: ProjectCardProps) {
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
          <p className="mt-0.5 text-sm text-muted-foreground">{project.client}</p>
        </div>
        <Badge variant={statusVariants[project.status]} className="transition-all duration-200 group-hover:scale-105">
          {statusLabels[project.status]}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span className="font-medium tabular-nums text-foreground">
            {project.progress}%
          </span>
        </div>
        <Progress value={project.progress} className="h-1.5 transition-all duration-300" />
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Due in <span className="font-medium text-foreground">{project.deadline}</span>
      </p>
    </article>
  );
}
