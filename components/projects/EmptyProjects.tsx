import Link from "next/link";

import { FolderOpen } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function EmptyProjects() {
  return (
    <div className="rounded-2xl border border-dashed p-16 text-center">
      <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground" />

      <h2 className="mt-4 text-xl font-semibold">No projects yet</h2>

      <p className="mt-2 text-muted-foreground">
        Create your first project and start collaborating.
      </p>

      <Button className="mt-6" asChild>
        <Link href="/projects/new">New Project</Link>
      </Button>
    </div>
  );
}
