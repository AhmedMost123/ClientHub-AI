import Link from "next/link";
import { Edit, DollarSign, Calendar, User, UserCheck } from "lucide-react";
import { TaskStatus } from "@prisma/client";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { formatBudget } from "@/lib/project-utils";

interface Props {
  role: "CLIENT" | "FREELANCER";

  project: {
    id: string;
    title: string;
    customerName: string;
    status: string;
    budget: number | null;
    dueDate: Date | null;
    owner?: { name: string | null } | null;
    linkedClient?: { name: string | null } | null;
    tasks?: {
      status: TaskStatus;
    }[];
  };
}

export default function ProjectHeader({ project, role }: Props) {
  const totalTasks = project.tasks?.length || 0;
  const completedTasks = project.tasks?.filter((t) => t.status === "DONE").length || 0;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <section className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">{project.status.replace("_", " ")}</Badge>
        </div>

        <p className="text-muted-foreground">
          Customer{" "}
          <span className="font-medium text-foreground">
            {project.customerName}
          </span>
        </p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <DollarSign className="size-4" />
            <span>{formatBudget(project.budget)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="size-4" />
            <span>{project.dueDate ? format(project.dueDate, "MMM d, yyyy") : "No due date"}</span>
          </div>
          {project.owner && (
            <div className="flex items-center gap-1.5">
              <User className="size-4" />
              <span>Owner: {project.owner.name || "Unknown"}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <UserCheck className="size-4" />
            <span>Client: {project.linkedClient?.name || "Not linked"}</span>
          </div>
        </div>

        {totalTasks > 0 && (
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">
              {progressPercent}% Complete
            </span>
            <span className="text-muted-foreground">
              {completedTasks} / {totalTasks} Tasks
            </span>
          </div>
        )}
      </div>

      {role === "FREELANCER" && (
        <Button asChild>
          <Link href={`/projects/${project.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Project
          </Link>
        </Button>
      )}
    </section>
  );
}
