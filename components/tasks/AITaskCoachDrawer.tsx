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
import {
  Sparkles,
  BookOpen,
  GitBranch,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Code2,
  Shield,
  Layers,
  ChevronRight,
  Wrench,
  FileCode,
  ArrowRight,
  Brain,
} from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  projectId: string;
  project: {
    title: string;
  };
}

interface SubtaskSuggestion {
  title: string;
  description: string;
  estimatedHours: number;
  priority: string;
  phase: string;
}

interface Props {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateSubtasks?: (subtasks: SubtaskSuggestion[], parentTaskId: string) => Promise<void>;
}

type AIMode = "analyze" | "teach" | "subtasks";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AnalysisView({ data }: { data: any }) {
  return (
    <div className="space-y-6 pb-8">
      {/* Goal & Difficulty */}
      <div className="rounded-xl border bg-card p-4 space-y-3">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          Task Overview
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{data.goal}</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            Difficulty: {data.difficulty}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Duration: {data.estimatedDuration}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Complexity: {data.complexity}
          </Badge>
        </div>
      </div>

      {/* Implementation Steps */}
      {data.implementationSteps?.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Layers className="size-4 text-blue-500" />
            Implementation Steps
          </h3>
          <div className="space-y-2">
            {data.implementationSteps.map((step: { step: number; title: string; description: string }, i: number) => (
              <div
                key={i}
                className="flex gap-3 rounded-lg border bg-card p-3 transition-all hover:border-primary/30"
              >
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {step.step}
                </div>
                <div>
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Files to Edit */}
      {data.filesToEdit?.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <FileCode className="size-4 text-amber-500" />
            Files Likely to Edit
          </h3>
          <div className="rounded-xl border bg-muted/30 p-3 space-y-1">
            {data.filesToEdit.map((file: string, i: number) => (
              <div key={i} className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <ChevronRight className="size-3 text-primary/60" />
                {file}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Workflow */}
      {data.suggestedWorkflow?.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <GitBranch className="size-4 text-green-500" />
            Suggested Workflow
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            {data.suggestedWorkflow.map((step: string, i: number) => (
              <div key={i} className="flex items-center gap-1">
                <Badge className="text-xs bg-primary/10 text-primary border-primary/20" variant="outline">
                  {step}
                </Badge>
                {i < data.suggestedWorkflow.length - 1 && (
                  <ArrowRight className="size-3 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Tools */}
      {data.suggestedTools?.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Wrench className="size-4 text-violet-500" />
            Suggested Tools
          </h3>
          <div className="space-y-2">
            {data.suggestedTools.map((tool: { name: string; reason: string }, i: number) => (
              <div key={i} className="flex gap-2 rounded-lg border bg-card p-3">
                <Code2 className="size-4 shrink-0 text-violet-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{tool.name}</p>
                  <p className="text-xs text-muted-foreground">{tool.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Best Practices */}
      {data.bestPractices?.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Shield className="size-4 text-emerald-500" />
            Best Practices
          </h3>
          <ul className="space-y-1">
            {data.bestPractices.map((practice: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-500 mt-0.5" />
                {practice}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Common Mistakes */}
      {data.commonMistakes?.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <AlertTriangle className="size-4 text-amber-500" />
            Common Mistakes
          </h3>
          <ul className="space-y-1">
            {data.commonMistakes.map((mistake: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="size-4 shrink-0 text-amber-500 mt-0.5" />
                {mistake}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Potential Blockers */}
      {data.potentialBlockers?.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <AlertTriangle className="size-4 text-red-500" />
            Potential Blockers
          </h3>
          <ul className="space-y-1">
            {data.potentialBlockers.map((blocker: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="size-4 shrink-0 text-red-500 mt-0.5" />
                {blocker}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Testing Checklist */}
      {data.testingChecklist?.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <CheckCircle2 className="size-4 text-blue-500" />
            Testing Checklist
          </h3>
          <div className="rounded-xl border bg-card p-3 space-y-1">
            {data.testingChecklist.map((item: string, i: number) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div className="size-4 rounded border border-border flex items-center justify-center shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TeachView({ data }: { data: any }) {
  return (
    <div className="space-y-6 pb-8">
      <div className="rounded-xl border bg-card p-4">
        <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
          <Brain className="size-4 text-primary" />
          Introduction
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{data.intro}</p>
      </div>

      {data.concepts?.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Lightbulb className="size-4 text-amber-500" />
            Key Concepts
          </h3>
          <div className="space-y-2">
            {data.concepts.map((concept: { name: string; explanation: string }, i: number) => (
              <div key={i} className="rounded-lg border bg-card p-3">
                <p className="text-sm font-semibold text-primary">{concept.name}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{concept.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.steps?.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Layers className="size-4 text-blue-500" />
            Step-by-Step Guide
          </h3>
          <div className="space-y-3">
            {data.steps.map((step: { step: number; title: string; explanation: string; tip: string }, i: number) => (
              <div key={i} className="rounded-xl border bg-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {step.step}
                  </div>
                  <p className="text-sm font-semibold">{step.title}</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.explanation}</p>
                {step.tip && (
                  <div className="mt-2 flex items-start gap-2 rounded-lg bg-amber-500/10 p-2">
                    <Lightbulb className="size-3.5 shrink-0 text-amber-500 mt-0.5" />
                    <p className="text-xs text-amber-700 dark:text-amber-400">{step.tip}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.keyInsights?.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Sparkles className="size-4 text-violet-500" />
            Key Insights
          </h3>
          <ul className="space-y-2">
            {data.keyInsights.map((insight: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Sparkles className="size-4 shrink-0 text-violet-500 mt-0.5" />
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.watchOut?.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <AlertTriangle className="size-4 text-red-500" />
            Watch Out For
          </h3>
          <ul className="space-y-1">
            {data.watchOut.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="size-4 shrink-0 text-red-500 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

interface SubtaskViewProps {
  data: { subtasks: SubtaskSuggestion[] };
  onAccept: (subtasks: SubtaskSuggestion[]) => void;
  isCreating: boolean;
}

function SubtaskView({ data, onAccept, isCreating }: SubtaskViewProps) {
  const [selected, setSelected] = useState<Set<number>>(
    new Set(data.subtasks.map((_, i) => i))
  );

  const toggle = (i: number) => {
    const next = new Set(selected);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setSelected(next);
  };

  const phaseColors: Record<string, string> = {
    Backend: "bg-blue-500/10 text-blue-600 border-blue-200",
    Frontend: "bg-violet-500/10 text-violet-600 border-violet-200",
    Testing: "bg-green-500/10 text-green-600 border-green-200",
    Documentation: "bg-amber-500/10 text-amber-600 border-amber-200",
    DevOps: "bg-orange-500/10 text-orange-600 border-orange-200",
  };

  return (
    <div className="space-y-4 pb-8">
      <p className="text-sm text-muted-foreground">
        Review the suggested subtasks. Uncheck any you want to skip, then click &quot;Create Selected&quot;.
      </p>
      <div className="space-y-2">
        {data.subtasks.map((subtask, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            className={`w-full flex items-start gap-3 rounded-xl border p-3 text-left transition-all hover:shadow-sm ${
              selected.has(i) ? "border-primary/40 bg-primary/5" : "border-border bg-card opacity-60"
            }`}
          >
            <div className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
              selected.has(i) ? "border-primary bg-primary" : "border-border"
            }`}>
              {selected.has(i) && <CheckCircle2 className="size-3 text-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium">{subtask.title}</p>
                <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${phaseColors[subtask.phase] || "bg-muted text-muted-foreground border-border"}`}>
                  {subtask.phase}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{subtask.description}</p>
              <p className="text-xs text-muted-foreground mt-1">
                ~{subtask.estimatedHours}h · {subtask.priority} priority
              </p>
            </div>
          </button>
        ))}
      </div>
      <Button
        onClick={() => onAccept(data.subtasks.filter((_, i) => selected.has(i)))}
        disabled={selected.size === 0 || isCreating}
        className="w-full"
        style={{ background: "var(--gradient-brand)" }}
      >
        {isCreating ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Creating {selected.size} subtasks...
          </>
        ) : (
          <>
            <CheckCircle2 className="mr-2 size-4" />
            Create {selected.size} Selected Subtasks
          </>
        )}
      </Button>
    </div>
  );
}

export default function AITaskCoachDrawer({ task, open, onOpenChange, onCreateSubtasks }: Props) {
  const [mode, setMode] = useState<AIMode>("analyze");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<Record<AIMode, any>>({ analyze: null, teach: null, subtasks: null });
  const [loading, setLoading] = useState<Record<AIMode, boolean>>({ analyze: false, teach: false, subtasks: false });
  const [isCreatingSubtasks, setIsCreatingSubtasks] = useState(false);

  const fetchAIData = async (m: AIMode) => {
    if (!task || data[m]) return;
    setLoading((prev) => ({ ...prev, [m]: true }));
    try {
      const res = await fetch("/api/ai/task-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: {
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
            projectTitle: task.project.title,
          },
          mode: m,
        }),
      });
      const json = await res.json();
      if (json.data) {
        setData((prev) => ({ ...prev, [m]: json.data }));
      } else {
        toast.error("AI failed to analyze this task.");
      }
    } catch {
      toast.error("Failed to connect to AI coach.");
    } finally {
      setLoading((prev) => ({ ...prev, [m]: false }));
    }
  };

  const handleModeChange = (m: AIMode) => {
    setMode(m);
    fetchAIData(m);
  };

  const handleCreateSubtasks = async (subtasks: SubtaskSuggestion[]) => {
    if (!task || !onCreateSubtasks) return;
    setIsCreatingSubtasks(true);
    try {
      await onCreateSubtasks(subtasks, task.id);
      toast.success(`Created ${subtasks.length} subtasks!`);
      onOpenChange(false);
    } catch {
      toast.error("Failed to create subtasks.");
    } finally {
      setIsCreatingSubtasks(false);
    }
  };

  // Auto-fetch analyze on open
  const handleOpen = (val: boolean) => {
    if (val && task && !data.analyze) {
      fetchAIData("analyze");
    }
    if (!val) {
      setData({ analyze: null, teach: null, subtasks: null });
      setMode("analyze");
    }
    onOpenChange(val);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpen}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="size-4 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-base">AI Task Coach</SheetTitle>
              {task && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-64">{task.title}</p>
              )}
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-1 rounded-xl bg-muted p-1 mt-3">
            {(
              [
                { id: "analyze", label: "Analyze", icon: Sparkles },
                { id: "teach", label: "Teach Me", icon: BookOpen },
                { id: "subtasks", label: "Subtasks", icon: GitBranch },
              ] as const
            ).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => handleModeChange(id)}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-all ${
                  mode === id
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-3.5" />
                {label}
              </button>
            ))}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 pt-4">
          {loading[mode] ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="relative">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="size-6 text-primary animate-pulse" />
                </div>
                <Loader2 className="absolute -top-1 -right-1 size-4 animate-spin text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">AI is analyzing your task...</p>
            </div>
          ) : data[mode] ? (
            <>
              {mode === "analyze" && <AnalysisView data={data[mode]} />}
              {mode === "teach" && <TeachView data={data[mode]} />}
              {mode === "subtasks" && (
                <SubtaskView
                  data={data[mode]}
                  onAccept={handleCreateSubtasks}
                  isCreating={isCreatingSubtasks}
                />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="size-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Click a mode above to get AI insights for this task.
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
