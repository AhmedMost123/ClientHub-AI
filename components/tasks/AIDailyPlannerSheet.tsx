"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Clock, Target, AlertTriangle, Sparkles, Coffee } from "lucide-react";
import { toast } from "sonner";

interface Task {
  title: string;
  priority: string;
  estimatedHours: number | null;
  dueDate: Date | null;
  status: string;
  project: { title: string };
}

interface ScheduleEntry {
  startTime: string;
  endTime: string;
  taskTitle: string;
  projectTitle: string;
  activity: string;
  type: "deep_work" | "review" | "testing" | "meeting" | "break";
}

interface PlanData {
  schedule: ScheduleEntry[];
  totalHours: number;
  focusTask: string;
  recommendation: string;
  risks: string[];
}

interface Props {
  tasks: Task[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const typeConfig = {
  deep_work: { label: "Deep Work", color: "bg-blue-500/10 text-blue-600 border-blue-200" },
  review: { label: "Review", color: "bg-violet-500/10 text-violet-600 border-violet-200" },
  testing: { label: "Testing", color: "bg-green-500/10 text-green-600 border-green-200" },
  meeting: { label: "Meeting", color: "bg-amber-500/10 text-amber-600 border-amber-200" },
  break: { label: "Break", color: "bg-muted text-muted-foreground border-border" },
};

export default function AIDailyPlannerSheet({ tasks, open, onOpenChange }: Props) {
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/daily-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks: tasks
            .filter((t) => t.status !== "DONE")
            .slice(0, 20)
            .map((t) => ({
              title: t.title,
              priority: t.priority,
              estimatedHours: t.estimatedHours,
              dueDate: t.dueDate,
              status: t.status,
              projectTitle: t.project.title,
            })),
          workHoursPerDay: 8,
        }),
      });
      const json = await res.json();
      if (json.data) {
        setPlanData(json.data);
      } else {
        toast.error("Failed to generate daily plan.");
      }
    } catch {
      toast.error("Failed to connect to AI planner.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10">
              <Calendar className="size-4 text-primary" />
            </div>
            <SheetTitle className="text-base">AI Daily Planner</SheetTitle>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            AI creates today&apos;s optimal work schedule based on your tasks, priorities, and deadlines.
          </p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 pt-4 pb-8">
          {!planData && !loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Calendar className="size-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">Plan Your Day</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-64">
                  AI will analyze your {tasks.filter((t) => t.status !== "DONE").length} active tasks and create an optimal schedule.
                </p>
              </div>
              <Button
                onClick={generatePlan}
                style={{ background: "var(--gradient-brand)" }}
                className="text-white shadow-md hover:shadow-lg transition-all"
              >
                <Sparkles className="mr-2 size-4" />
                Generate Today&apos;s Plan
              </Button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="relative">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="size-6 text-primary" />
                </div>
                <Loader2 className="absolute -top-1 -right-1 size-4 animate-spin text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">AI is building your schedule...</p>
            </div>
          )}

          {planData && (
            <div className="space-y-6">
              {/* Focus task */}
              <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-primary/10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="size-4 text-primary" />
                  <p className="text-sm font-semibold">Today&apos;s Focus</p>
                </div>
                <p className="text-sm text-muted-foreground">{planData.focusTask}</p>
              </div>

              {/* Recommendation */}
              <div className="rounded-xl border bg-amber-500/5 border-amber-200/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="size-4 text-amber-500" />
                  <p className="text-sm font-semibold">AI Recommendation</p>
                </div>
                <p className="text-sm text-muted-foreground">{planData.recommendation}</p>
              </div>

              {/* Schedule */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Clock className="size-4 text-blue-500" />
                    Today&apos;s Schedule
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {planData.totalHours}h total
                  </Badge>
                </div>

                <div className="space-y-2">
                  {planData.schedule?.map((entry, i) => {
                    const config = typeConfig[entry.type] ?? typeConfig.deep_work;
                    const isBreak = entry.type === "break";
                    return (
                      <div
                        key={i}
                        className={`flex gap-3 rounded-xl border p-3 ${isBreak ? "bg-muted/30" : "bg-card"}`}
                      >
                        <div className="flex flex-col items-center text-xs text-muted-foreground font-mono shrink-0 min-w-16">
                          <span>{entry.startTime}</span>
                          <div className="flex-1 w-px bg-border my-1" />
                          <span>{entry.endTime}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-medium truncate">{entry.taskTitle}</p>
                            <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${config.color}`}>
                              {config.label}
                            </span>
                          </div>
                          {!isBreak && (
                            <p className="text-xs text-muted-foreground mt-0.5">{entry.projectTitle}</p>
                          )}
                          {entry.activity && (
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              {isBreak ? <Coffee className="size-3" /> : <Target className="size-3" />}
                              {entry.activity}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Risks */}
              {planData.risks?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <AlertTriangle className="size-4 text-amber-500" />
                    Risks to Watch
                  </h3>
                  <ul className="space-y-1">
                    {planData.risks.map((risk, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <AlertTriangle className="size-4 shrink-0 text-amber-500 mt-0.5" />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                onClick={() => { setPlanData(null); generatePlan(); }}
                variant="outline"
                className="w-full"
              >
                <Sparkles className="mr-2 size-4" />
                Regenerate Plan
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
