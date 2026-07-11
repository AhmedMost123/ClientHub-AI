import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { projects } from "@/lib/mock-data";

export default function ActiveProjects() {
  return (
    <section className="space-y-5">
      <SectionHeader
        title="Active Projects"
        description="Track progress across your current engagements"
        actionLabel="View all"
        actionHref="/projects"
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
