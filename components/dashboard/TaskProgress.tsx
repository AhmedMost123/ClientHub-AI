import { ChartCard } from "@/components/dashboard/ChartCard";
import { Progress } from "@/components/ui/progress";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function TaskProgressWidget() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const tasks = await prisma.task.findMany({
    where: { project: { ownerId: session.user.id } },
    select: { status: true },
  });

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "DONE").length;
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const todo = tasks.filter((t) => t.status === "TODO").length;

  const taskData = [
    { id: "1", label: "Completed", count: completed, total },
    { id: "2", label: "In Progress", count: inProgress, total },
    { id: "3", label: "To Do", count: todo, total },
  ];

  return (
    <ChartCard title="Task Progress" description="Overall completion status">
      <div className="space-y-5">
        {taskData.map((item) => {
          const percent =
            item.total > 0 ? Math.round((item.count / item.total) * 100) : 0;
          return (
            <div key={item.id} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.label}</span>
                <span className="tabular-nums text-muted-foreground">
                  {item.count}/{item.total}
                </span>
              </div>
              <Progress value={percent} className="h-1.5" />
            </div>
          );
        })}
      </div>
    </ChartCard>
  );
}
