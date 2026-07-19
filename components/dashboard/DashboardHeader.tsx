import { Calendar, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { APP_USER } from "@/lib/constants";
import { cn } from "@/lib/utils";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

type DashboardHeaderProps = {
  className?: string;
};

export function DashboardHeader({ className }: DashboardHeaderProps) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <section
      className={cn(
        "flex flex-col justify-between gap-4 lg:flex-row lg:items-center",
        className
      )}
    >
      <div className="space-y-2 animate-in-slide-up">
        <p className="text-sm font-medium text-muted-foreground">{today}</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
          {getGreeting()},{" "}
          <span className="gradient-text">{APP_USER.name}</span>
        </h1>
        <p className="max-w-xl text-base text-muted-foreground leading-relaxed">
          Here&apos;s what&apos;s happening with your business today.
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3 animate-in-slide-up stagger-1">
        <Button variant="outline" className="gap-2 rounded-xl hover-lift">
          <Calendar className="size-4 transition-transform duration-200" aria-hidden />
          This Month
        </Button>
        <Button className="gap-2 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02]" style={{ background: "var(--gradient-brand)" }}>
          <Download className="size-4 transition-transform duration-200" aria-hidden />
          Export
        </Button>
      </div>
    </section>
  );
}
