import Link from "next/link";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ProjectHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Projects</h1>

        <p className="mt-2 text-muted-foreground">
          Create and manage all your projects.
        </p>
      </div>

      <Button asChild className="rounded-xl">
        <Link href="/projects/new">
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Link>
      </Button>
    </div>
  );
}
