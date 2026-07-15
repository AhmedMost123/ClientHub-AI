import ProjectCard from "./ProjectCard";

import { ProjectCardData } from "@/types/project";

interface Props {
  projects: ProjectCardData[];
  role: "CLIENT" | "FREELANCER";
}

export default function ProjectGrid({ projects, role }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} role={role} />
      ))}
    </div>
  );
}
