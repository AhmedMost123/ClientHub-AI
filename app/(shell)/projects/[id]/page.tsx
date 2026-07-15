import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Edit, Settings, Trash, CheckSquare } from "lucide-react";
import { format } from "date-fns";
import { auth } from "@/auth";

import { getProject } from "@/lib/actions/get-project";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProjectDetailsPageProps {
  params: { id: string };
}

export default async function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const result = await getProject(params.id);

  if (!result.success) {
    if (result.error === "Forbidden") {
      redirect("/unauthorized");
    }
    notFound();
  }

  const project = result.data;
  const role = session.user.role === "CLIENT" ? "CLIENT" : "FREELANCER";
  
  // Tasks will be fetched from project relations if we extended the getProject
  // But for now, we just mock the empty state for the UI, or display what's in project.tasks
  const tasks = project.tasks || [];

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12 pt-4">
      {/* Back Link */}
      <Link
        href="/projects"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-2 size-4" />
        Back to Projects
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
              {project.title}
            </h1>
            <Badge variant="secondary" className="rounded-md">
              {project.status.replace("_", " ")}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Customer: <span className="font-medium text-foreground">{project.customerName}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {role === "FREELANCER" && (
            <Button variant="outline" size="sm" asChild className="h-9 rounded-lg">
              <Link href={`/projects/${project.id}/edit`}>
                <Edit className="mr-2 size-4" />
                Edit Project
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground mb-1">Budget</div>
          <div className="text-2xl font-bold">
            {project.budget ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(project.budget) : "TBD"}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground mb-1">Due Date</div>
          <div className="flex items-center text-xl font-semibold">
            <Calendar className="mr-2 size-5 text-muted-foreground" />
            {project.dueDate ? format(new Date(project.dueDate), "MMM d, yyyy") : "Not set"}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground mb-1">Linked Client</div>
          <div className="text-lg font-medium">
            {project.linkedClient?.name || "None"}
          </div>
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-3">Description</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{project.description}</p>
        </div>
      )}

      {/* Tasks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Tasks</h2>
          {role === "FREELANCER" && (
            <Button size="sm" className="rounded-lg">
              Add Task
            </Button>
          )}
        </div>
        
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">
            <CheckSquare className="mb-4 size-8 opacity-50" />
            <p>No tasks created yet.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {tasks.map((task: any, index: number) => (
              <div key={task.id} className={cn("flex items-center gap-4 p-4", index !== tasks.length - 1 && "border-b border-border")}>
                <div className={cn("size-5 rounded border", task.completed ? "bg-primary border-primary" : "border-input bg-background")} />
                <span className={cn("flex-1", task.completed && "line-through text-muted-foreground")}>{task.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
