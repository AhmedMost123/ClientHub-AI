import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CreateClientProjectForm } from "@/components/client/projects/CreateClientProjectForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function NewClientProjectPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "CLIENT") {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12 pt-4">
      <Link
        href="/client/projects"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-2 size-4" />
        Back to Projects
      </Link>

      <div className="space-y-1.5">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
          Request Project
        </h1>
        <p className="text-muted-foreground">
          Create a new project and invite a freelancer to collaborate.
        </p>
      </div>

      <CreateClientProjectForm />
    </div>
  );
}
