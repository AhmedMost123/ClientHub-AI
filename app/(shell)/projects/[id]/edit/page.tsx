import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/auth";

import { getProject } from "@/lib/actions/get-project";
import { ProjectForm } from "@/components/projects/ProjectForm";

interface EditProjectPageProps {
  params: { id: string };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
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

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12 pt-4">
      <Link
        href={`/projects/${params.id}`}
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-2 size-4" />
        Back to Project Details
      </Link>

      <div className="space-y-1.5">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
          Edit Project
        </h1>
        <p className="text-muted-foreground">
          Update the high-level details of this project.
        </p>
      </div>

      <ProjectForm
        mode="edit"
        role={role}
        id={project.id}
        initialValues={{
          title: project.title,
          customerName: project.customerName,
          description: project.description || undefined,
          budget: project.budget || undefined,
          status: project.status,
          dueDate: project.dueDate || undefined,
          linkedClientId: project.linkedClientId || undefined,
        }}
      />
    </div>
  );
}
