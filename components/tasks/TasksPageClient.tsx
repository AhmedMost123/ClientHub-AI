"use client";

import { useState, useMemo, useTransition, useOptimistic } from "react";
import { format, isToday, isTomorrow, isPast, addDays, isWithinInterval, startOfDay } from "date-fns";
import {
  CheckSquare,
  Plus,
  Sparkles,
  Search,
  LayoutList,
  LayoutGrid,
  Filter,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Circle,
  MoreHorizontal,
  Pencil,
  Trash2,
  Copy,
  Brain,
  Target,
  TrendingUp,
  Zap,
  FolderKanban,
  Timer,
  ChevronRight,
  ListChecks,
  ArrowUpDown,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import type { TaskWithProject } from "@/lib/actions/get-all-tasks";
import { createTask } from "@/lib/actions/create-task";
import { updateTask } from "@/lib/actions/update-task";
import { deleteTask } from "@/lib/actions/delete-task";
import { toggleTask } from "@/lib/actions/toggle-task";

import GlobalTaskDialog, { type TaskFormData } from "./GlobalTaskDialog";
import DeleteTaskDialog from "./DeleteTaskDialog";
import AITaskCoachDrawer from "./AITaskCoachDrawer";
import AIDailyPlannerSheet from "./AIDailyPlannerSheet";

interface Project {
  id: string;
  title: string;
  status: string;
}

interface Props {
  initialTasks: TaskWithProject[];
  projects: Project[];
}

type FilterType =
  | "all"
  | "today"
  | "upcoming"
  | "completed"
  | "overdue"
  | "high-priority"
  | "quick-wins";

type ViewMode = "list" | "kanban";

const PRIORITY_ORDER = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

// ─── Priority Badge ──────────────────────────────────────────────────────────
function PriorityBadge({ priority }: { priority: string }) {
  const config = {
    URGENT: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-900",
    HIGH: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-900",
    MEDIUM: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900",
    LOW: "bg-muted text-muted-foreground border-border",
  }[priority] ?? "bg-muted text-muted-foreground border-border";

  return (
    <span className={`text-xs font-medium px-1.5 py-0.5 rounded border ${config}`}>
      {priority.charAt(0) + priority.slice(1).toLowerCase()}
    </span>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const config = {
    TODO: "bg-muted text-muted-foreground",
    IN_PROGRESS: "bg-blue-500/10 text-blue-600",
    DONE: "bg-emerald-500/10 text-emerald-600",
  }[status] ?? "bg-muted text-muted-foreground";

  const labels: Record<string, string> = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    DONE: "Done",
  };

  return (
    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${config}`}>
      {labels[status] ?? status}
    </span>
  );
}

// ─── Task Card (List View) ───────────────────────────────────────────────────
interface TaskCardProps {
  task: TaskWithProject;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAskAI: () => void;
  onDuplicate: () => void;
  isOptimisticDone?: boolean;
}

function TaskCard({ task, onToggle, onEdit, onDelete, onAskAI, onDuplicate, isOptimisticDone }: TaskCardProps) {
  const isDone = isOptimisticDone ?? task.status === "DONE";
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !isDone;
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));

  return (
    <div
      className={cn(
        "group relative flex items-start gap-3 rounded-xl border bg-card p-4 transition-all hover:shadow-sm hover:border-primary/20",
        isDone && "opacity-60",
        isOverdue && "border-red-200/60 dark:border-red-900/40"
      )}
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={onToggle}
        className="mt-0.5 shrink-0 cursor-pointer hover:scale-110 transition-transform"
      >
        {isDone ? (
          <CheckCircle2 className="size-5 text-emerald-500 fill-emerald-500/20" />
        ) : (
          <Circle className="size-5 text-muted-foreground hover:text-foreground transition-colors" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h3
            className={cn(
              "font-medium text-sm truncate",
              isDone && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
          </div>
        </div>

        {/* Project tag */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <FolderKanban className="size-3 shrink-0" />
          <span className="truncate">{task.project.title}</span>
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {task.dueDate && (
            <div
              className={cn(
                "flex items-center gap-1",
                isOverdue && "text-red-500",
                isDueToday && !isDone && "text-amber-500"
              )}
            >
              <Calendar className="size-3" />
              <span>
                {isToday(new Date(task.dueDate))
                  ? "Due today"
                  : isTomorrow(new Date(task.dueDate))
                    ? "Due tomorrow"
                    : format(new Date(task.dueDate), "MMM d, yyyy")}
              </span>
            </div>
          )}
          {task.estimatedHours && (
            <div className="flex items-center gap-1">
              <Clock className="size-3" />
              <span>{task.estimatedHours}h est.</span>
            </div>
          )}
          {isOverdue && (
            <div className="flex items-center gap-1 text-red-500">
              <AlertTriangle className="size-3" />
              <span>Overdue</span>
            </div>
          )}
        </div>
      </div>

      {/* Hover Actions */}
      <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={onAskAI}
          className="h-7 px-2 text-xs gap-1 text-primary hover:bg-primary/10"
        >
          <Sparkles className="size-3" />
          Ask AI
        </Button>
        <DropdownMenu>
          {/* @ts-expect-error type issue */}
          <DropdownMenuTrigger asChild>
            <Button size="icon-sm" variant="ghost" className="h-7 w-7">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
              <Pencil className="mr-2 size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDuplicate} className="cursor-pointer">
              <Copy className="mr-2 size-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <Trash2 className="mr-2 size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

// ─── Kanban Column ────────────────────────────────────────────────────────────
interface KanbanColumnProps {
  title: string;
  tasks: TaskWithProject[];
  color: string;
  icon: React.ReactNode;
  onToggle: (id: string) => void;
  onEdit: (task: TaskWithProject) => void;
  onDelete: (id: string) => void;
  onAskAI: (task: TaskWithProject) => void;
  onDuplicate: (task: TaskWithProject) => void;
  optimisticMap: Map<string, "TODO" | "IN_PROGRESS" | "DONE">;
}

function KanbanColumn({
  title,
  tasks,
  color,
  icon,
  onToggle,
  onEdit,
  onDelete,
  onAskAI,
  onDuplicate,
  optimisticMap,
}: KanbanColumnProps) {
  return (
    <div className="flex flex-col rounded-2xl border bg-muted/30 p-4 min-h-96">
      <div className="flex items-center gap-2 mb-4">
        <div className={`size-2 rounded-full ${color}`} />
        {icon}
        <h3 className="font-semibold text-sm">{title}</h3>
        <span className="ml-auto text-xs text-muted-foreground bg-card rounded-full px-2 py-0.5 border">
          {tasks.length}
        </span>
      </div>
      <div className="space-y-2 flex-1">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isOptimisticDone={optimisticMap.get(task.id) === "DONE"}
            onToggle={() => onToggle(task.id)}
            onEdit={() => onEdit(task)}
            onDelete={() => onDelete(task.id)}
            onAskAI={() => onAskAI(task)}
            onDuplicate={() => onDuplicate(task)}
          />
        ))}
        {tasks.length === 0 && (
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Stats Card ───────────────────────────────────────────────────────────────
function StatsCard({
  label,
  value,
  icon: Icon,
  color,
  active,
  onClick,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  active: boolean;
  onClick: () => void;
}) {
  const iconStyles: Record<string, { bg: string; text: string }> = {
    "bg-primary": { bg: "bg-primary/10", text: "text-primary" },
    "bg-blue-500": { bg: "bg-blue-500/10", text: "text-blue-500" },
    "bg-emerald-500": { bg: "bg-emerald-500/10", text: "text-emerald-500" },
    "bg-red-500": { bg: "bg-red-500/10", text: "text-red-500" },
  };

  const style = iconStyles[color] || { bg: color, text: "text-white" };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex flex-col gap-3 rounded-2xl border bg-card p-5 text-left transition-all hover:shadow-md hover:border-primary/30",
        active && "border-primary/40 ring-1 ring-primary/20 bg-primary/5"
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
    </button>
  );
}

// ─── AI Project Health Card ───────────────────────────────────────────────────
function AIHealthCard({ tasks }: { tasks: TaskWithProject[] }) {
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
        <div className="flex items-center gap-2 mb-4">
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10">
            <Brain className="size-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">AI Project Health</h2>
            <p className="text-xs text-muted-foreground">Real-time analysis</p>
          </div>
          <div className="ml-auto flex items-center gap-1 text-xs text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-200/50">
            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="rounded-xl bg-card/80 border p-3 text-center">
            <p className="text-2xl font-bold">{totalActive}</p>
            <p className="text-xs text-muted-foreground">Active Tasks</p>
          </div>
          <div className={`rounded-xl border p-3 text-center ${overdue > 0 ? "bg-red-500/5 border-red-200/60" : "bg-card/80"}`}>
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

// ─── Empty State ───────────────────────────────────────────────────────────────
function EmptyTasksState({ onNewTask }: { onNewTask: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <div className="relative">
        <div className="size-20 rounded-3xl bg-primary/10 flex items-center justify-center">
          <CheckSquare className="size-10 text-primary/60" />
        </div>
        <div className="absolute -top-1 -right-1 size-6 rounded-full bg-emerald-500 flex items-center justify-center">
          <Plus className="size-4 text-white" />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold">No tasks yet</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          You don&apos;t have any tasks yet. Create your first task to get started.
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          onClick={onNewTask}
          style={{ background: "var(--gradient-brand)" }}
          className="text-white shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="mr-2 size-4" />
          Create Task
        </Button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TasksPageClient({ initialTasks, projects }: Props) {
  const [tasks, setTasks] = useState<TaskWithProject[]>(initialTasks);
  const [, startTransition] = useTransition();
  const [optimisticStatuses, addOptimisticStatus] = useOptimistic(
    tasks,
    (state: TaskWithProject[], update: { id: string; status: "TODO" | "IN_PROGRESS" | "DONE" }) =>
      state.map((t) => (t.id === update.id ? { ...t, status: update.status } : t))
  );

  // View
  const [view, setView] = useState<ViewMode>("list");

  // Dialogs
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithProject | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // AI
  const [aiTask, setAITask] = useState<TaskWithProject | null>(null);
  const [aiDrawerOpen, setAIDrawerOpen] = useState(false);
  const [plannerOpen, setPlannerOpen] = useState(false);

  // Filters
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Derived stats from optimistic tasks
  const totalTasks = optimisticStatuses.length;
  const inProgressCount = optimisticStatuses.filter((t) => t.status === "IN_PROGRESS").length;
  const completedCount = optimisticStatuses.filter((t) => t.status === "DONE").length;
  const overdueCount = optimisticStatuses.filter(
    (t) => t.dueDate && isPast(new Date(t.dueDate)) && t.status !== "DONE"
  ).length;

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    let result = optimisticStatuses;

    // Quick filter
    const now = new Date();
    if (activeFilter === "today") {
      result = result.filter((t) => t.dueDate && isToday(new Date(t.dueDate)));
    } else if (activeFilter === "upcoming") {
      result = result.filter(
        (t) =>
          t.dueDate &&
          isWithinInterval(new Date(t.dueDate), {
            start: addDays(startOfDay(now), 1),
            end: addDays(startOfDay(now), 7),
          })
      );
    } else if (activeFilter === "completed") {
      result = result.filter((t) => t.status === "DONE");
    } else if (activeFilter === "overdue") {
      result = result.filter(
        (t) => t.dueDate && isPast(new Date(t.dueDate)) && t.status !== "DONE"
      );
    } else if (activeFilter === "high-priority") {
      result = result.filter((t) => t.priority === "HIGH" || t.priority === "URGENT");
    } else if (activeFilter === "quick-wins") {
      result = result.filter(
        (t) => (t.estimatedHours ?? 99) <= 2 && t.status !== "DONE"
      );
    }

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.project.title.toLowerCase().includes(q)
      );
    }

    // Project filter
    if (projectFilter !== "all") {
      result = result.filter((t) => t.projectId === projectFilter);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter);
    }

    // Sort
    return [...result].sort((a, b) => {
      // Done tasks go to the bottom
      if (a.status === "DONE" && b.status !== "DONE") return 1;
      if (b.status === "DONE" && a.status !== "DONE") return -1;
      // Then sort by priority
      return (PRIORITY_ORDER[a.priority as keyof typeof PRIORITY_ORDER] ?? 2) -
        (PRIORITY_ORDER[b.priority as keyof typeof PRIORITY_ORDER] ?? 2);
    });
  }, [optimisticStatuses, activeFilter, searchQuery, projectFilter, priorityFilter, statusFilter]);

  // Group by project for list view
  const groupedByProject = useMemo(() => {
    const groups: Record<string, { project: { id: string; title: string }; tasks: TaskWithProject[] }> = {};
    for (const task of filteredTasks) {
      if (!groups[task.projectId]) {
        groups[task.projectId] = { project: task.project, tasks: [] };
      }
      groups[task.projectId].tasks.push(task);
    }
    return Object.values(groups);
  }, [filteredTasks]);

  // Kanban columns
  const kanbanCols = useMemo(
    () => ({
      TODO: filteredTasks.filter((t) => t.status === "TODO"),
      IN_PROGRESS: filteredTasks.filter((t) => t.status === "IN_PROGRESS"),
      DONE: filteredTasks.filter((t) => t.status === "DONE"),
    }),
    [filteredTasks]
  );

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleToggle = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "DONE" ? "TODO" : "DONE";
    startTransition(() => {
      addOptimisticStatus({ id: taskId, status: newStatus as "TODO" | "IN_PROGRESS" | "DONE" });
    });
    const result = await toggleTask(taskId);
    if (!result.success) {
      toast.error(result.error || "Failed to update task");
    } else {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: result.data.status } : t))
      );
    }
  };

  const handleSaveTask = async (data: TaskFormData) => {
    if (editingTask) {
      const result = await updateTask({ id: editingTask.id, ...data });
      if (result.success) {
        toast.success("Task updated");
        setTasks((prev) =>
          prev.map((t) =>
            t.id === editingTask.id
              ? {
                ...t,
                title: data.title,
                description: data.description ?? null,
                status: data.status,
                priority: data.priority,
                estimatedHours: data.estimatedHours ?? null,
                dueDate: data.dueDate ?? null,
              }
              : t
          )
        );
      } else {
        toast.error(result.error || "Failed to update task");
        throw new Error("Failed");
      }
    } else {
      const result = await createTask(data);
      if (result.success) {
        toast.success("Task created");
        // Add new task optimistically with project info
        const proj = projects.find((p) => p.id === data.projectId);
        if (proj && result.data) {
          setTasks((prev) => [
            ...prev,
            {
              ...result.data,
              project: { id: proj.id, title: proj.title, status: proj.status, customerName: "" },
            } as TaskWithProject,
          ]);
        }
      } else {
        toast.error(result.error || "Failed to create task");
        throw new Error("Failed");
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);
    try {
      const result = await deleteTask(taskToDelete);
      if (result.success) {
        toast.success("Task deleted");
        setTasks((prev) => prev.filter((t) => t.id !== taskToDelete));
        setDeleteDialogOpen(false);
        setTaskToDelete(null);
      } else {
        toast.error(result.error || "Failed to delete task");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = async (task: TaskWithProject) => {
    const result = await createTask({
      projectId: task.projectId,
      title: `${task.title} (copy)`,
      description: task.description ?? undefined,
      status: "TODO",
      priority: task.priority,
      estimatedHours: task.estimatedHours ?? undefined,
      dueDate: task.dueDate ?? undefined,
    });
    if (result.success) {
      toast.success("Task duplicated");
      const proj = task.project;
      if (proj && result.data) {
        setTasks((prev) => [
          ...prev,
          { ...result.data, project: proj } as TaskWithProject,
        ]);
      }
    } else {
      toast.error(result.error || "Failed to duplicate task");
    }
  };

  const openNewTask = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const openEditTask = (task: TaskWithProject) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const openDeleteDialog = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteDialogOpen(true);
  };

  const openAI = (task: TaskWithProject) => {
    setAITask(task);
    setAIDrawerOpen(true);
  };

  const activeFiltersCount = [
    projectFilter !== "all",
    priorityFilter !== "all",
    statusFilter !== "all",
    searchQuery.length > 0,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearchQuery("");
    setProjectFilter("all");
    setPriorityFilter("all");
    setStatusFilter("all");
    setActiveFilter("all");
  };

  // Group unique projects from tasks
  const taskProjects = useMemo(() => {
    const seen = new Set<string>();
    return optimisticStatuses
      .filter((t) => {
        if (seen.has(t.projectId)) return false;
        seen.add(t.projectId);
        return true;
      })
      .map((t) => ({ id: t.projectId, title: t.project.title }));
  }, [optimisticStatuses]);

  return (
    <>
      <div className="space-y-6 animate-in-fade">
        {/* ─── Header ─────────────────────────────────────────────────────── */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10">
                <CheckSquare className="size-5 text-primary" />
              </div>
              <div>
                <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
                  Tasks
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage all project tasks with AI assistance.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={() => setPlannerOpen(true)}
              className="gap-2 rounded-xl hover-lift"
            >
              <Timer className="size-4 text-primary" />
              Daily Planner
            </Button>
            <Button
              onClick={openNewTask}
              style={{ background: "var(--gradient-brand)" }}
              className="gap-2 rounded-xl text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              <Plus className="size-4" />
              New Task
            </Button>
          </div>
        </section>

        {/* ─── Stats Row ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatsCard
            label="Total Tasks"
            value={totalTasks}
            icon={CheckSquare}
            color="bg-primary"
            active={activeFilter === "all"}
            onClick={() => setActiveFilter("all")}
          />
          <StatsCard
            label="In Progress"
            value={inProgressCount}
            icon={TrendingUp}
            color="bg-blue-500"
            active={activeFilter === "all"}
            onClick={() => setActiveFilter("all")}
          />
          <StatsCard
            label="Completed"
            value={completedCount}
            icon={CheckCircle2}
            color="bg-emerald-500"
            active={activeFilter === "completed"}
            onClick={() => setActiveFilter("completed")}
          />
          <StatsCard
            label="Overdue"
            value={overdueCount}
            icon={AlertTriangle}
            color="bg-red-500"
            active={activeFilter === "overdue"}
            onClick={() => setActiveFilter("overdue")}
          />
        </div>

        {/* ─── AI Health Card ──────────────────────────────────────────────── */}
        <AIHealthCard tasks={optimisticStatuses} />

        {/* ─── Filters + View Toggle ───────────────────────────────────────── */}
        <div className="space-y-3">
          {/* Quick filter chips */}
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: "all", label: "All" },
                { id: "today", label: "Due Today" },
                { id: "upcoming", label: "Upcoming" },
                { id: "completed", label: "Completed" },
                { id: "overdue", label: "Overdue" },
                { id: "high-priority", label: "High Priority" },
                { id: "quick-wins", label: "Quick Wins" },
              ] as const
            ).map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveFilter(id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
                  activeFilter === id
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Search + Filters + View */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 rounded-xl h-10"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Project filter */}
              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger className="w-36 rounded-xl h-10 text-xs">
                  <FolderKanban className="size-3.5 mr-1.5" />
                  <SelectValue placeholder="Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {taskProjects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Priority filter */}
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32 rounded-xl h-10 text-xs">
                  <ArrowUpDown className="size-3.5 mr-1.5" />
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>

              {/* Status filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 rounded-xl h-10 text-xs">
                  <Filter className="size-3.5 mr-1.5" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="TODO">To Do</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                </SelectContent>
              </Select>

              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted"
                >
                  <X className="size-3.5" />
                  Clear ({activeFiltersCount})
                </button>
              )}

              {/* View toggle */}
              <div className="flex items-center rounded-xl border bg-card p-1 gap-0.5">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className={cn(
                    "p-1.5 rounded-lg transition-all",
                    view === "list" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <LayoutList className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setView("kanban")}
                  className={cn(
                    "p-1.5 rounded-lg transition-all",
                    view === "kanban" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <LayoutGrid className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Tasks Results Summary ───────────────────────────────────────── */}
        {filteredTasks.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">{filteredTasks.length}</span> task
            {filteredTasks.length !== 1 ? "s" : ""}
            {activeFilter !== "all" && (
              <> · <span className="text-primary">{activeFilter.replace("-", " ")}</span></>
            )}
          </p>
        )}

        {/* ─── Content ────────────────────────────────────────────────────── */}
        {filteredTasks.length === 0 ? (
          <EmptyTasksState onNewTask={openNewTask} />
        ) : view === "list" ? (
          /* List View — grouped by project */
          <div className="space-y-6">
            {groupedByProject.map(({ project, tasks: projectTasks }) => (
              <div key={project.id} className="space-y-2">
                <div className="flex items-center gap-2 py-1">
                  <FolderKanban className="size-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-muted-foreground">{project.title}</h3>
                  <Badge variant="outline" className="text-xs">
                    {projectTasks.length}
                  </Badge>
                </div>
                <div className="space-y-2 pl-0">
                  {projectTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={() => handleToggle(task.id, task.status)}
                      onEdit={() => openEditTask(task)}
                      onDelete={() => openDeleteDialog(task.id)}
                      onAskAI={() => openAI(task)}
                      onDuplicate={() => handleDuplicate(task)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Kanban View */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KanbanColumn
              title="To Do"
              tasks={kanbanCols.TODO}
              color="bg-muted-foreground"
              icon={<Circle className="size-4 text-muted-foreground" />}
              onToggle={(id) => {
                const t = filteredTasks.find((x) => x.id === id);
                if (t) handleToggle(id, t.status);
              }}
              onEdit={openEditTask}
              onDelete={openDeleteDialog}
              onAskAI={openAI}
              onDuplicate={handleDuplicate}
              optimisticMap={new Map()}
            />
            <KanbanColumn
              title="In Progress"
              tasks={kanbanCols.IN_PROGRESS}
              color="bg-blue-500"
              icon={<TrendingUp className="size-4 text-blue-500" />}
              onToggle={(id) => {
                const t = filteredTasks.find((x) => x.id === id);
                if (t) handleToggle(id, t.status);
              }}
              onEdit={openEditTask}
              onDelete={openDeleteDialog}
              onAskAI={openAI}
              onDuplicate={handleDuplicate}
              optimisticMap={new Map()}
            />
            <KanbanColumn
              title="Done"
              tasks={kanbanCols.DONE}
              color="bg-emerald-500"
              icon={<CheckCircle2 className="size-4 text-emerald-500" />}
              onToggle={(id) => {
                const t = filteredTasks.find((x) => x.id === id);
                if (t) handleToggle(id, t.status);
              }}
              onEdit={openEditTask}
              onDelete={openDeleteDialog}
              onAskAI={openAI}
              onDuplicate={handleDuplicate}
              optimisticMap={new Map()}
            />
          </div>
        )}
      </div>

      {/* ─── Dialogs ──────────────────────────────────────────────────────── */}
      <GlobalTaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSaveTask}
        projects={projects}
        projectId={editingTask?.projectId}
        defaultValues={
          editingTask
            ? {
              projectId: editingTask.projectId,
              title: editingTask.title,
              description: editingTask.description ?? undefined,
              status: editingTask.status,
              priority: editingTask.priority,
              estimatedHours: editingTask.estimatedHours ?? undefined,
              dueDate: editingTask.dueDate ?? undefined,
            }
            : undefined
        }
        requireProjectSelection={!editingTask}
      />

      <DeleteTaskDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      <AITaskCoachDrawer
        task={aiTask}
        open={aiDrawerOpen}
        onOpenChange={setAIDrawerOpen}
        onCreateSubtasks={async (subtasks, parentTaskId) => {
          // Create each subtask under the same project as the parent task
          const parentTask = tasks.find((t) => t.id === parentTaskId);
          if (!parentTask) return;
          for (const subtask of subtasks) {
            await createTask({
              projectId: parentTask.projectId,
              title: subtask.title,
              description: subtask.description,
              priority: (subtask.priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT") || "MEDIUM",
              status: "TODO",
              estimatedHours: subtask.estimatedHours,
            });
          }
          // Refresh local tasks list
          const result = await import("@/lib/actions/get-all-tasks").then((m) => m.getAllTasks());
          if (result.success && result.data) {
            setTasks(result.data);
          }
        }}
      />

      <AIDailyPlannerSheet
        tasks={tasks as Parameters<typeof AIDailyPlannerSheet>[0]["tasks"]}
        open={plannerOpen}
        onOpenChange={setPlannerOpen}
      />
    </>
  );
}
