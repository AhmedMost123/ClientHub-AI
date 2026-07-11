import { ChartCard } from "@/components/dashboard/ChartCard";
import { recentActivity } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const typeColors = {
  invoice: "bg-chart-4/20 text-chart-4",
  project: "bg-chart-1/20 text-chart-1",
  message: "bg-chart-2/20 text-chart-2",
  payment: "bg-success/15 text-success",
};

export function RecentActivity() {
  return (
    <ChartCard title="Recent Activity" description="Latest updates across your workspace">
      <ul className="space-y-1" aria-label="Recent activity">
        {recentActivity.map((item, index) => (
          <li
            key={item.id}
            className="flex items-center gap-4 rounded-xl p-3 transition-all duration-200 hover:bg-muted/40 hover:translate-x-1"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div
              className={cn(
                "size-2 shrink-0 rounded-full transition-transform duration-200 group-hover:scale-125",
                typeColors[item.type].split(" ")[0]
              )}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm">
                <span className="text-muted-foreground">{item.action}</span>{" "}
                <span className="font-medium transition-colors duration-200 hover:text-foreground">{item.target}</span>
              </p>
            </div>
            <time className="shrink-0 text-xs text-muted-foreground">{item.time}</time>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}
