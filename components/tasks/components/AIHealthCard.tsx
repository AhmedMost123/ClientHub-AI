import React from "react";
import { isPast, isToday } from "date-fns";
import { Target, AlertTriangle, Zap, ListChecks, ChevronRight, Brain } from "lucide-react";

import type { TaskWithProject } from "@/lib/actions/task/get-all-tasks";

export function AIHealthCard({ tasks }: { tasks: TaskWithProject[] }) {
  const totalActive = tasks.filter((t) => t.status !== "DONE").length;
  const overdue = tasks.filter(
    (t) => t.dueDate && isPast(new Date(t.dueDate)) && t.status !== "DONE"
  ).length;
  const dueToday = tasks.filter(
    (t) => t.dueDate && isToday(new Date(t.dueDate)) && t.status !== "DONE"
  );
  const highPriority = tasks.filter(
    (t) => (t.priority === "HIGH" || t.priority === "URGENT") && t.status !== "DONE"
  );
  const totalEstHours = tasks
    .filter((t) => t.status !== "DONE" && t.estimatedHours)
    .reduce((acc, t) => acc + (t.estimatedHours ?? 0), 0);
  const estDays = Math.ceil(totalEstHours / 6);
  const completedCount = tasks.filter((t) => t.status === "DONE").length;
  const confidence = tasks.length > 0
    ? Math.max(40, Math.round(100 - (overdue / tasks.length) * 40 - (highPriority.length / tasks.length) * 20))
    : 95;

  const todayFocus = [
    ...dueToday.slice(0, 2).map((t) => `Finish ${t.title}`),
    ...highPriority.slice(0, 1).map((t) => `Review ${t.title}`),
  ].slice(0, 3);

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-primary/5 via-card to-primary/5 p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 size-32 rounded-full bg-primary/5 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 size-20 rounded-full bg-primary/5 translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        <h3 className="font-semibold text-lg flex items-center gap-2 mb-6">
          <Target className="size-5 text-primary" />
          Project Health
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl bg-card/80 border p-3 text-center">
            <p className={`text-2xl font-bold ${overdue > 0 ? "text-red-500" : ""}`}>{overdue}</p>
            <p className="text-xs text-muted-foreground">Overdue</p>
          </div>
          <div className="rounded-xl bg-card/80 border p-3 text-center">
            <p className="text-2xl font-bold text-emerald-500">{completedCount}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {overdue > 0 && (
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <AlertTriangle className="size-4 shrink-0" />
              <span>{overdue} task{overdue > 1 ? "s are" : " is"} overdue and need immediate attention.</span>
            </div>
          )}
          {highPriority.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
              <Zap className="size-4 shrink-0" />
              <span>{highPriority.length} high-priority task{highPriority.length > 1 ? "s" : ""} active.</span>
            </div>
          )}
          {totalActive > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="size-4 shrink-0" />
              <span>Estimated completion: ~{estDays} working day{estDays !== 1 ? "s" : ""}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Confidence</span>
              <span className="font-semibold text-emerald-600">{confidence}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>
        </div>

        {todayFocus.length > 0 && (
          <div className="rounded-xl bg-card/80 border p-3">
            <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
              <ListChecks className="size-3.5" />
              Today&apos;s Recommendation
            </p>
            <ul className="space-y-1">
              {todayFocus.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <ChevronRight className="size-3.5 text-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
