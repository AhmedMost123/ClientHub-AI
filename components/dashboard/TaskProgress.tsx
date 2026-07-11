import { ChartCard } from "@/components/dashboard/ChartCard";
import { Progress } from "@/components/ui/progress";
import { taskProgress } from "@/lib/mock-data";

export function TaskProgressWidget() {
  return (
    <ChartCard title="Task Progress" description="Completion by category">
      <div className="space-y-5">
        {taskProgress.map((item) => {
          const percent = Math.round((item.completed / item.total) * 100);
          return (
            <div key={item.id} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.label}</span>
                <span className="tabular-nums text-muted-foreground">
                  {item.completed}/{item.total}
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
