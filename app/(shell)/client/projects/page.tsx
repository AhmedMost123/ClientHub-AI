import Link from "next/link";
import { Plus } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { PageContainer } from "@/components/shared/PageContainer";
import { Button } from "@/components/ui/button";

import { ProjectEmptyState } from "@/components/projects/ProjectEmptyState";
import ProjectGrid from "@/components/projects/ProjectGrid";
import { ProjectArchiveFilter } from "@/components/projects/ProjectArchiveFilter";

import { getProjects } from "@/lib/actions/project/get-projects";

interface ClientProjectsPageProps {
  searchParams: { archived?: string };
}

export default async function ClientProjectsPage({ searchParams }: ClientProjectsPageProps) {
  const session = await auth();

  if (!session?.user || session.user.role !== "CLIENT") {
    redirect("/login");
  }

  const role = "CLIENT";
  
  const params = await searchParams;
  const includeArchived = params.archived === "true";

  // getProjects uses findProjectsForClient when role is CLIENT
  const result = await getProjects({ includeArchived });

  if (!result.success) {
    return (
      <PageContainer>
        <div className="rounded-xl border p-8 text-destructive">{result.error}</div>
      </PageContainer>
    );
  }

  const projects = result.data;

  return (
    <PageContainer className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
              Projects
            </h1>
            <ProjectArchiveFilter defaultArchived={includeArchived} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage projects you're collaborating on.
          </p>
        </div>
        <Button
          asChild
          className="h-10 rounded-xl px-4 shadow-sm hover:scale-105 transition-all"
          style={{ background: "var(--gradient-brand)" }}
        >
          <Link href="/client/projects/new">
            <Plus className="mr-2 size-4" />
            New Project
          </Link>
        </Button>
      </section>

      {projects.length === 0 ? (
        <ProjectEmptyState role={role} />
      ) : (
        <ProjectGrid projects={projects} role={role} />
      )}
    </PageContainer>
  );
}
