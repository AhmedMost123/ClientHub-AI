import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function NewProjectPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role === "CLIENT" ? "CLIENT" : "FREELANCER";
  const clientName = session.user.name || "Client";

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12 pt-4">
      <Link
        href="/projects"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-2 size-4" />
        Back to Projects
      </Link>

      <div className="space-y-1.5">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
          Create Project
        </h1>
        <p className="text-muted-foreground">
          {role === "FREELANCER"
            ? "Create a new project, link it to an existing client, and organize everything in one place."
            : "Request a new project to start collaborating with us."}
        </p>
      </div>

      <ProjectForm mode="create" role={role} clientName={clientName} />
    </div>
  );
}
