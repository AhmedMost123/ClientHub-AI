import { useState, useMemo } from "react";
import { isToday, isPast, addDays, isWithinInterval, startOfDay } from "date-fns";
import type { TaskWithProject } from "@/lib/actions/task/get-all-tasks";

export type FilterType =
  | "all"
  | "today"
  | "upcoming"
  | "completed"
  | "overdue"
  | "high-priority"
  | "quick-wins";

export type ViewMode = "list" | "kanban";

const PRIORITY_ORDER = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

export function useTaskFilters(optimisticStatuses: TaskWithProject[]) {
  const [view, setView] = useState<ViewMode>("list");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const totalTasks = optimisticStatuses.length;
  const inProgressCount = optimisticStatuses.filter((t) => t.status === "IN_PROGRESS").length;
  const completedCount = optimisticStatuses.filter((t) => t.status === "DONE").length;
  const overdueCount = optimisticStatuses.filter(
    (t) => t.dueDate && isPast(new Date(t.dueDate)) && t.status !== "DONE"
  ).length;

  const filteredTasks = useMemo(() => {
    let result = optimisticStatuses;

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

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.project.title.toLowerCase().includes(q)
      );
    }

    if (projectFilter !== "all") {
      result = result.filter((t) => t.projectId === projectFilter);
    }

    if (priorityFilter !== "all") {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter);
    }

    return [...result].sort((a, b) => {
      if (a.status === "DONE" && b.status !== "DONE") return 1;
      if (b.status === "DONE" && a.status !== "DONE") return -1;
      return (PRIORITY_ORDER[a.priority as keyof typeof PRIORITY_ORDER] ?? 2) -
        (PRIORITY_ORDER[b.priority as keyof typeof PRIORITY_ORDER] ?? 2);
    });
  }, [optimisticStatuses, activeFilter, searchQuery, projectFilter, priorityFilter, statusFilter]);

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

  const kanbanCols = useMemo(
    () => ({
      TODO: filteredTasks.filter((t) => t.status === "TODO"),
      IN_PROGRESS: filteredTasks.filter((t) => t.status === "IN_PROGRESS"),
      DONE: filteredTasks.filter((t) => t.status === "DONE"),
    }),
    [filteredTasks]
  );

  return {
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
  };
}
