import { Calendar, DollarSign, FolderKanban, Users } from "lucide-react";
import { format } from "date-fns";

interface Props {
  project: {
    budget: number | null;
    dueDate: Date | null;
    tasks: unknown[];
    linkedClient: {
      name: string | null;
    } | null;
  };
}

export default function ProjectStats({ project }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-xl border p-5">
        <DollarSign className="mb-3 size-5" />
        <p className="text-sm text-muted-foreground">Budget</p>
        <p className="mt-1 text-xl font-semibold">
          {project.budget
            ? new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(project.budget)
            : "Not set"}
        </p>
      </div>

      <div className="rounded-xl border p-5">
        <Calendar className="mb-3 size-5" />
        <p className="text-sm text-muted-foreground">Due Date</p>
        <p className="mt-1 text-xl font-semibold">
          {project.dueDate ? format(project.dueDate, "MMM d, yyyy") : "Not set"}
        </p>
      </div>

      <div className="rounded-xl border p-5">
        <FolderKanban className="mb-3 size-5" />
        <p className="text-sm text-muted-foreground">Tasks</p>
        <p className="mt-1 text-xl font-semibold">{project.tasks.length}</p>
      </div>

      <div className="rounded-xl border p-5">
        <Users className="mb-3 size-5" />
        <p className="text-sm text-muted-foreground">Client</p>
        <p className="mt-1 text-xl font-semibold">
          {project.linkedClient?.name ?? "Not linked"}
        </p>
      </div>
    </div>
  );
}
