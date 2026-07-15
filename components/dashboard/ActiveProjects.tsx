import { auth } from "@/auth";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { projectRepository } from "@/lib/repositories/project.repository";

export default async function ActiveProjects() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const projects = await projectRepository.findProjects(session.user.id, { isArchived: false });
  // Limit to 4 recent active projects
  const recentProjects = projects.slice(0, 4);

  return (
    <section className="space-y-5">
      <SectionHeader
        title="Active Projects"
        description="Track progress across your current engagements"
        actionLabel="View all"
        actionHref="/projects"
      />
      {recentProjects.length === 0 ? (
        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed text-muted-foreground">
          No active projects.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {recentProjects.map((project) => (
            <ProjectCard key={project.id} project={project as any} />
          ))}
        </div>
      )}
    </section>
  );
}
