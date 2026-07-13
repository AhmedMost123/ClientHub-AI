import { TrendingUp, Calendar, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  progress: number;
  currentPhase: string;
  deadline: string;
  estimatedCompletion: string;
}

interface ProjectProgressCardProps {
  project: Project;
}

export function ProjectProgressCard({ project }: ProjectProgressCardProps) {
  return (
    <div className="card-premium rounded-2xl p-6">
      <h2 className="mb-4 text-lg font-semibold">Project Progress</h2>
      
      {/* Circular Progress */}
      <div className="mb-6 flex items-center justify-center">
        <div className="relative size-32">
          <svg className="size-32 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted/20"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - project.progress / 100)}`}
              className="transition-all duration-500"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-primary)" />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.7" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-3xl font-bold">{project.progress}%</span>
              <p className="text-xs text-muted-foreground">Complete</p>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div
            className="flex size-8 items-center justify-center rounded-lg"
            style={{ background: "var(--gradient-brand-subtle)" }}
          >
            <Target className="size-4" style={{ color: "var(--color-primary)" }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Current Phase</p>
            <p className="text-xs text-muted-foreground">{project.currentPhase}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="flex size-8 items-center justify-center rounded-lg"
            style={{ background: "var(--gradient-brand-subtle)" }}
          >
            <Calendar className="size-4" style={{ color: "var(--color-primary)" }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Deadline</p>
            <p className="text-xs text-muted-foreground">
              {new Date(project.deadline).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="flex size-8 items-center justify-center rounded-lg"
            style={{ background: "var(--gradient-brand-subtle)" }}
          >
            <TrendingUp className="size-4" style={{ color: "var(--color-primary)" }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Estimated Completion</p>
            <p className="text-xs text-muted-foreground">
              {new Date(project.estimatedCompletion).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
