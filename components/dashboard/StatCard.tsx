import { TrendingDown, TrendingUp } from "lucide-react";

import type { StatItem } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type StatCardProps = StatItem & {
  className?: string;
  index?: number;
};

export default function StatCard({
  title,
  value,
  description,
  change,
  trend = "neutral",
  icon: Icon,
  gradient,
  className,
  index = 0,
}: StatCardProps) {
  return (
    <article
      className={cn(
        "card-interactive group relative overflow-hidden rounded-2xl p-6 animate-in-slide-up",
        className
      )}
      style={{
        background: gradient,
        animationDelay: `${index * 50}ms`,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-10 items-center justify-center rounded-xl bg-background/60 shadow-sm backdrop-blur-sm transition-all duration-200 group-hover:scale-110 group-hover:shadow-md">
          <Icon className="size-[18px] text-foreground/80 transition-transform duration-200" aria-hidden />
        </div>
        {change && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset transition-all duration-200",
              trend === "up" && "bg-success/10 text-success ring-success/20",
              trend === "down" && "bg-destructive/10 text-destructive ring-destructive/20",
              trend === "neutral" && "bg-muted text-muted-foreground ring-border"
            )}
          >
            {trend === "up" && <TrendingUp className="size-3 transition-transform duration-200 group-hover:scale-110" aria-hidden />}
            {trend === "down" && (
              <TrendingDown className="size-3 transition-transform duration-200 group-hover:scale-110" aria-hidden />
            )}
            {change}
          </span>
        )}
      </div>

      <div className="mt-5 space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-3xl font-semibold tracking-tight tabular-nums">
          {value}
        </p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </article>
  );
}
