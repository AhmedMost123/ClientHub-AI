import Link from "next/link";
import { Plus } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { PageContainer } from "@/components/shared/PageContainer";
import { Button } from "@/components/ui/button";

import { ProjectEmptyState } from "@/components/projects/ProjectEmptyState";
import ProjectGrid from "@/components/projects/ProjectGrid";

import { getProjects } from "@/lib/actions/get-projects";

export default async function ProjectsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role === "CLIENT" ? "CLIENT" : "FREELANCER";

  const result = await getProjects();

  if (!result.success) {
    return (
      <PageContainer>
        <div className="rounded-xl border p-8">{result.error}</div>
      </PageContainer>
    );
  }

  const projects = result.data;

  return (
    <PageContainer className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            Projects
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {role === "FREELANCER"
              ? "Manage all your customer projects and active work."
              : "View and request projects you are collaborating on."}
          </p>
        </div>
        <Button
          asChild
          className="h-10 rounded-xl px-4 shadow-sm hover:scale-105 transition-all"
          style={{ background: "var(--gradient-brand)" }}
        >
          <Link href="/projects/new">
            <Plus className="mr-2 size-4" />
            {role === "FREELANCER" ? "New Project" : "Request Project"}
          </Link>
        </Button>
      </section>

      {projects.length === 0 ? (
        <ProjectEmptyState role={role} />
      ) : (
        <ProjectGrid projects={projects} />
      )}
    </PageContainer>
  );
}
