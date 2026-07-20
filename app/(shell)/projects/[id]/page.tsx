import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import { getProject } from "@/lib/actions/get-project";

import ProjectHeader from "@/components/projects/ProjectHeader";
import ProjectStats from "@/components/projects/ProjectStats";
import ProjectDescription from "@/components/projects/ProjectDescription";
import ProjectStatusControl from "@/components/projects/ProjectStatusControl";
import TaskList from "@/components/tasks/TaskList";
import Conversation from "@/components/messages/Conversation";
import ProjectActivity from "@/components/projects/ProjectActivity";
import ProjectQuickActions from "@/components/projects/ProjectQuickActions";
import InvoiceList from "@/components/invoices/InvoiceList";

interface ProjectDetailsPageProps {
  params: { id: string };
}

export default async function ProjectDetailsPage({
  params,
}: ProjectDetailsPageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const result = await getProject(id);

  if (!result.success) {
    if (result.error === "Forbidden") {
      redirect("/unauthorized");
    }
    notFound();
  }

  const project = result.data;
  const role = session.user.role === "CLIENT" ? "CLIENT" : "FREELANCER";
  const isOwner = role === "FREELANCER" && project.ownerId === session.user.id;

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12 pt-4">
      <Link
        href="/projects"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-2 size-4" />
        Back to Projects
      </Link>

      <ProjectHeader project={project as any} role={role} />

      {/* Inline Status Control */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">Status:</span>
        <ProjectStatusControl
          projectId={project.id}
          currentStatus={project.status}
          canEdit={isOwner}
        />
      </div>

      <ProjectStats project={project} />

      {project.description && (
        <ProjectDescription description={project.description} />
      )}

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <TaskList
          tasks={project.tasks ?? []}
          projectId={project.id}
          canEdit={isOwner}
        />
      </div>

      <div id="conversation-section">
        <Conversation
          currentUserId={session.user.id}
          currentUserName={session.user.name ?? null}
          projectId={project.id}
          hasLinkedClient={!!project.linkedClientId}
          conversation={project.conversation}
        />
      </div>

      <ProjectActivity activities={project.activities || []} />

      {/* Invoices section */}
      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold tracking-tight">Invoices</h2>
        <InvoiceList
          invoices={(project.invoices ?? []).map((inv) => ({
            ...inv,
            amount: Number(inv.amount),
          }))}
          projectId={project.id}
          canCreate={isOwner}
        />
      </section>

      <ProjectQuickActions project={project} role={role} />
    </div>
  );
}

