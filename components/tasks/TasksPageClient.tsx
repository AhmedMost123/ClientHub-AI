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
import type { TaskWithProject } from "@/lib/actions/task/get-all-tasks";
import { createTask } from "@/lib/actions/task/create-task";
import { updateTask } from "@/lib/actions/task/update-task";
import { deleteTask } from "@/lib/actions/task/delete-task";
import { toggleTask } from "@/lib/actions/task/toggle-task";

import GlobalTaskDialog, { type TaskFormData } from "./GlobalTaskDialog";
import DeleteTaskDialog from "./DeleteTaskDialog";
import AITaskCoachDrawer from "./AITaskCoachDrawer";
import AIDailyPlannerSheet from "./AIDailyPlannerSheet";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StatsCard } from "@/components/shared/StatsCard";
import { useTaskFilters } from "@/hooks/useTaskFilters";
import { TaskCard } from "./components/TaskCard";
import { KanbanColumn } from "./components/KanbanColumn";
import { AIHealthCard } from "./components/AIHealthCard";
import { EmptyTasksState } from "./components/EmptyTasksState";

interface Project {
  id: string;
  title: string;
  status: string;
}

interface Props {
  initialTasks: TaskWithProject[];
  projects: Project[];
}

const PRIORITY_ORDER = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

// Replaced with shared badges

// Replaced with components from ./components/

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TasksPageClient({ initialTasks, projects }: Props) {
  const [tasks, setTasks] = useState<TaskWithProject[]>(initialTasks);
  const [, startTransition] = useTransition();
  const [optimisticStatuses, addOptimisticStatus] = useOptimistic(
    tasks,
    (state: TaskWithProject[], update: { id: string; status: "TODO" | "IN_PROGRESS" | "DONE" }) =>
      state.map((t) => (t.id === update.id ? { ...t, status: update.status } : t))
  );

  const {
    view,
    setView,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    projectFilter,
    setProjectFilter,
    priorityFilter,
    setPriorityFilter,
    statusFilter,
    setStatusFilter,
    totalTasks,
    inProgressCount,
    completedCount,
    overdueCount,
    filteredTasks,
    groupedByProject,
    kanbanCols,
  } = useTaskFilters(optimisticStatuses);

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
              <Select value={projectFilter} onValueChange={(v) => setProjectFilter(v || "all")}>
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
              <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v || "all")}>
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
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v || "all")}>
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
          const result = await import("@/lib/actions/task/get-all-tasks").then((m) => m.getAllTasks());
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
