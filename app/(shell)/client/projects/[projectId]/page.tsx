import { requireClient } from "@/lib/auth/authorization";
import { notFound } from "next/navigation";
import {
  getProjectById,
  getProjectFiles,
  getProjectInvoices,
  getProjectMessages,
  getProjectTimeline,
} from "@/lib/mock/client-dashboard";

import { ProjectHeader } from "@/components/project/ProjectHeader";
import { ProjectChat } from "@/components/project/ProjectChat";
import { ProjectFiles } from "@/components/project/ProjectFiles";
import { ProjectTimeline } from "@/components/project/ProjectTimeline";
import { ProjectInvoiceCard } from "@/components/project/ProjectInvoiceCard";
import { ProjectProgressCard } from "@/components/project/ProjectProgressCard";
import { ProjectMembersCard } from "@/components/project/ProjectMembersCard";
import { ProjectWorkspaceLayout } from "@/components/project/ProjectWorkspaceLayout";

interface ProjectPageProps {
  params: {
    projectId: string;
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  await requireClient();

  const project = getProjectById(params.projectId);

  if (!project) {
    notFound();
  }

  const files = getProjectFiles(params.projectId) as any[];
  const invoices = getProjectInvoices(params.projectId) as any[];
  const messages = getProjectMessages(params.projectId) as any[];
  const timeline = getProjectTimeline(params.projectId) as any[];

  const latestInvoice = invoices[0] || null;

  return (
    <ProjectWorkspaceLayout
      header={<ProjectHeader project={project} />}
      leftColumn={
        <>
          <ProjectChat messages={messages} />
          <ProjectFiles files={files} />
        </>
      }
      rightColumn={
        <>
          <ProjectProgressCard project={project} />
          <ProjectInvoiceCard invoice={latestInvoice} />
          <ProjectTimeline events={timeline} />
          <ProjectMembersCard
            freelancer={{
              name: project.freelancer.name,
              avatar: project.freelancer.avatar,
              role: "Freelancer",
              online: project.freelancer.online,
            }}
            client={{
              name: project.client.name,
              avatar: project.client.avatar,
              role: "Client",
              online: false,
            }}
          />
        </>
      }
    />
  );
}
