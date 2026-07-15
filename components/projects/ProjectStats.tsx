import { Calendar, DollarSign, CheckCircle2, CircleDashed, ListTodo, Percent } from "lucide-react";
import { format } from "date-fns";
import { formatBudget } from "@/lib/project-utils";
import { Progress } from "@/components/ui/progress";

interface Props {
  project: {
    budget: number | null;
    dueDate: Date | null;
    tasks: { status: string }[];
  };
}

export default function ProjectStats({ project }: Props) {
  const totalTasks = project.tasks?.length || 0;
  const completedTasks = project.tasks?.filter((t) => t.status === "DONE").length || 0;
  const remainingTasks = totalTasks - completedTasks;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <ListTodo className="mb-3 size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Total Tasks</p>
          <p className="mt-1 text-2xl font-bold">{totalTasks}</p>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <CheckCircle2 className="mb-3 size-5 text-green-500" />
          <p className="text-sm text-muted-foreground">Completed Tasks</p>
          <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-500">{completedTasks}</p>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <CircleDashed className="mb-3 size-5 text-amber-500" />
          <p className="text-sm text-muted-foreground">Remaining Tasks</p>
          <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-500">{remainingTasks}</p>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <Percent className="mb-3 size-5 text-primary" />
          <p className="text-sm text-muted-foreground">Completion</p>
          <p className="mt-1 text-2xl font-bold text-primary">{progressPercent}%</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <DollarSign className="size-4" />
              Budget
            </p>
            <p className="mt-1 text-xl font-semibold">{formatBudget(project.budget)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground flex items-center gap-2 justify-end">
              <Calendar className="size-4" />
              Due Date
            </p>
            <p className="mt-1 text-xl font-semibold">
              {project.dueDate ? format(project.dueDate, "MMM d, yyyy") : "Not set"}
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm flex flex-col justify-center">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-muted-foreground">Project Progress</span>
            <span className="font-medium">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2.5" />
        </div>
      </div>
    </div>
  );
}
