import Link from "next/link";
import { clientProjects } from "@/lib/mock/client-dashboard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const statusColors = {
  IN_PROGRESS: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  PLANNING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  COMPLETED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  ON_HOLD: "bg-slate-500/10 text-slate-500 border-slate-500/20",
};

export function ClientProjects() {
  if (clientProjects.length === 0) {
    return (
      <div className="card-premium rounded-2xl p-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div
            className="mb-4 flex size-16 items-center justify-center rounded-2xl"
            style={{ background: "var(--gradient-brand-subtle)" }}
          >
            <svg
              className="size-8"
              style={{ color: "var(--color-primary)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">No projects assigned yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Your freelancer will assign work here soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-premium rounded-2xl p-6">
      <h2 className="mb-6 text-xl font-semibold">Assigned Projects</h2>
      <div className="space-y-4">
        {clientProjects.map((project) => (
          <Link
            key={project.id}
            href={`/client/projects/${project.id}`}
            className="card-interactive block rounded-xl border border-border/50 p-4 transition-all hover:border-border"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="font-semibold">{project.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {project.company} • {project.freelancer.name}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs font-medium",
                      statusColors[project.status],
                    )}
                  >
                    {project.status.replace("_", " ")}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Due {new Date(project.deadline).toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${project.progress}%`,
                        background: "var(--gradient-brand)",
                      }}
                    />
                  </div>
                </div>
              </div>

              <Button variant="outline" size="sm" className="rounded-lg">
                View Details
              </Button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
