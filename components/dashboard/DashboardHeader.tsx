"use client";

import { useState, useEffect } from "react";
import { Calendar, Download } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { DashboardTimeRange } from "@/lib/types/dashboard";
import { TIME_RANGE_LABELS } from "@/lib/types/dashboard";
import { exportDashboardPdf } from "@/lib/export/dashboard-pdf";
import type { DashboardData } from "@/lib/actions/dashboard/get-dashboard-data";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

type DashboardHeaderProps = {
  userName: string;
  data: DashboardData | null;
  className?: string;
};

export function DashboardHeader({ userName, data, className }: DashboardHeaderProps) {
  const [timeRange, setTimeRange] = useState<DashboardTimeRange>("this_month");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  function handleExport() {
    if (!data) return;
    const exportPayload = {
      userName,
      stats: data.stats,
      invoices: data.recentInvoices,
      activities: data.activities,
      activeProjectsCount: data.stats.activeProjectsCount,
    };
    exportDashboardPdf(exportPayload, timeRange);
  }

  return (
    <section
      className={cn(
        "flex flex-col justify-between gap-4 lg:flex-row lg:items-center",
        className
      )}
    >
      <div className="space-y-2 animate-in-slide-up">
        <p className="text-sm font-medium text-muted-foreground">{mounted ? today : "\u00A0"}</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
          {mounted ? getGreeting() : "Welcome"},{" "}
          <span className="gradient-text">{userName}</span>
        </h1>
        <p className="max-w-xl text-base text-muted-foreground leading-relaxed">
          Here&apos;s what&apos;s happening with your business today.
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3 animate-in-slide-up stagger-1">
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(buttonVariants({ variant: "outline" }), "gap-2 rounded-xl hover-lift")}>
            <Calendar className="size-4 transition-transform duration-200" aria-hidden />
            {TIME_RANGE_LABELS[timeRange]}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {(Object.entries(TIME_RANGE_LABELS) as [DashboardTimeRange, string][]).map(([key, label]) => (
              <DropdownMenuItem
                key={key}
                onClick={() => setTimeRange(key)}
                className={cn("cursor-pointer", timeRange === key && "bg-muted font-medium")}
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          onClick={handleExport}
          disabled={!data}
          className="gap-2 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02]" 
          style={{ background: "var(--gradient-brand)" }}
        >
          <Download className="size-4 transition-transform duration-200" aria-hidden />
          Export
        </Button>
      </div>
    </section>
  );
}
