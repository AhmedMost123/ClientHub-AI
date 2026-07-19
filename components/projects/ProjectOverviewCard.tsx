import Link from "next/link";
import { format } from "date-fns";
import { Calendar, CheckCircle2, ChevronRight, MoreHorizontal } from "lucide-react";
import { ProjectStatus } from "@prisma/client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    customerName: string;
    status: ProjectStatus;
    dueDate: Date | null;
    budget: number | null;
    isArchived: boolean;
    _count?: { tasks: number };
  };
}

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  PLANNING: { label: "Planning", className: "bg-muted text-muted-foreground" },
  IN_PROGRESS: { label: "In Progress", className: "bg-blue-500/10 text-blue-500" },
  REVIEW: { label: "Review", className: "bg-orange-500/10 text-orange-500" },
  COMPLETED: { label: "Completed", className: "bg-green-500/10 text-green-500" },
  CANCELLED: { label: "Cancelled", className: "bg-red-500/10 text-red-500" },
  PENDING: { label: "Pending", className: "bg-muted text-muted-foreground" },
};

export function ProjectOverviewCard({ project }: ProjectCardProps) {
  const statusInfo = statusConfig[project.status];

  return (
    <Link href={`/projects/${project.id}`} className="group block">
      <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold tracking-tight text-foreground line-clamp-1">
              {project.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {project.customerName}
            </p>
          </div>
          <Badge variant="secondary" className={cn("shrink-0 rounded-md px-2 py-0.5 text-xs font-medium border-transparent", statusInfo.className)}>
            {statusInfo.label}
          </Badge>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 size-4 opacity-70" />
            {project.dueDate ? format(new Date(project.dueDate), "MMM d, yyyy") : "No due date"}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <CheckCircle2 className="mr-2 size-4 opacity-70" />
            {project._count?.tasks ?? 0} Tasks
          </div>
        </div>

        <div className="mt-auto pt-6 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            {project.budget ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(project.budget) : "TBD"}
          </span>
          <div className="flex size-8 items-center justify-center rounded-full bg-secondary/50 text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <ChevronRight className="size-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
