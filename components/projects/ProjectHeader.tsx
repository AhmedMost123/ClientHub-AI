import Link from "next/link";
import { Edit } from "lucide-react";
import { TaskStatus } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  role: "CLIENT" | "FREELANCER";

  project: {
    id: string;
    title: string;
    customerName: string;
    status: string;
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
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">{project.status.replace("_", " ")}</Badge>
        </div>

        <p className="mt-2 text-muted-foreground">
          Customer{" "}
          <span className="font-medium text-foreground">
            {project.customerName}
          </span>
        </p>

        {totalTasks > 0 && (
          <div className="mt-4 flex items-center gap-3 text-sm">
            <div className="flex -space-x-1">
              {/* Optional: we could add avatars here if tasks were assigned, for now just progress text */}
            </div>
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
