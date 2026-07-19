import Link from "next/link";
import { FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectEmptyStateProps {
  role: "FREELANCER" | "CLIENT";
}

export function ProjectEmptyState({ role }: ProjectEmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-primary/10">
        <FolderOpen className="size-10 text-primary" strokeWidth={1.5} />
      </div>
      <h3 className="mb-2 text-xl font-semibold tracking-tight text-foreground">
        No projects yet
      </h3>
      <p className="mb-6 max-w-md text-sm text-muted-foreground">
        {role === "FREELANCER" 
          ? "Create your first project to start organizing tasks, invoices, and communication." 
          : "You don't have any active projects with us yet. Request a new project to get started."}
      </p>
      <Button asChild className="h-11 rounded-xl px-8 shadow-md hover:scale-105 transition-all" style={{ background: "var(--gradient-primary)" }}>
        <Link href={role === "FREELANCER" ? "/projects/new" : "/client/projects/new"}>
          {role === "FREELANCER" ? "Create Project" : "Request Project"}
        </Link>
      </Button>
    </div>
  );
}
