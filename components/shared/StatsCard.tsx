import React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatsCard({
  label,
  value,
  icon: Icon,
  color,
  active,
  onClick,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const iconStyles: Record<string, { bg: string; text: string }> = {
    "bg-primary": { bg: "bg-primary/10", text: "text-primary" },
    "bg-blue-500": { bg: "bg-blue-500/10", text: "text-blue-500" },
    "bg-emerald-500": { bg: "bg-emerald-500/10", text: "text-emerald-500" },
    "bg-red-500": { bg: "bg-red-500/10", text: "text-red-500" },
    "bg-amber-500": { bg: "bg-amber-500/10", text: "text-amber-500" },
  };

  const style = iconStyles[color] || { bg: color, text: "text-white" };

  const Component = onClick ? "button" : "div";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "group flex flex-col gap-3 rounded-2xl border bg-card p-5 text-left transition-all hover:shadow-md",
        onClick && "hover:border-primary/30",
        active && "border-primary/40 ring-1 ring-primary/20 bg-primary/5",
        !onClick && "hover:shadow-sm"
      )}
    >
      <div className="flex items-center justify-between">
        <div className={cn("flex size-9 items-center justify-center rounded-xl", style.bg)}>
          <Icon className={cn("size-4", style.text)} />
        </div>
        {active && <ChevronRight className="size-4 text-primary" />}
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </Component>
  );
}
