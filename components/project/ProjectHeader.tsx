import { User, Calendar, MoreVertical, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const statusColors = {
  IN_PROGRESS: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  PLANNING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  COMPLETED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  ON_HOLD: "bg-slate-500/10 text-slate-500 border-slate-500/20",
};

interface ProjectHeaderProps {
  project: {
    name: string;
    status: keyof typeof statusColors;
    progress: number;
    deadline: string;
    freelancer: {
      name: string;
      avatar: string | null;
      online: boolean;
    };
    client: {
      name: string;
      avatar: string | null;
    };
  };
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div className="card-premium rounded-2xl p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* Left: Project Info */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
                {project.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium",
                    statusColors[project.status],
                  )}
                >
                  {project.status.replace("_", " ")}
                </span>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="size-4" />
                  <span>Due {new Date(project.deadline).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
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

        {/* Right: Members & Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center lg:flex-col lg:items-end">
          {/* Members */}
          <div className="flex items-center gap-3">
            {/* Freelancer */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <div
                  className="flex size-10 items-center justify-center rounded-full"
                  style={{ background: "var(--gradient-brand-subtle)" }}
                >
                  {project.freelancer.avatar ? (
                    <img
                      src={project.freelancer.avatar}
                      alt={project.freelancer.name}
                      className="size-10 rounded-full object-cover"
                    />
                  ) : (
                    <User className="size-5" style={{ color: "var(--color-primary)" }} />
                  )}
                </div>
                {project.freelancer.online && (
                  <div className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-background bg-emerald-500" />
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{project.freelancer.name}</p>
                <p className="text-xs text-muted-foreground">Freelancer</p>
              </div>
            </div>

            {/* Client */}
            <div className="flex items-center gap-2">
              <div
                className="flex size-10 items-center justify-center rounded-full"
                style={{ background: "var(--gradient-brand-subtle)" }}
              >
                {project.client.avatar ? (
                  <img
                    src={project.client.avatar}
                    alt={project.client.name}
                    className="size-10 rounded-full object-cover"
                  />
                ) : (
                  <User className="size-5" style={{ color: "var(--color-primary)" }} />
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{project.client.name}</p>
                <p className="text-xs text-muted-foreground">Client</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-lg">
              <Download className="size-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-lg">
              <Share2 className="size-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-lg">
              <MoreVertical className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
