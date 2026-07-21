import React from "react";
import { format, isPast, isToday, isTomorrow } from "date-fns";
import {
  CheckCircle2,
  Circle,
  FolderKanban,
  Calendar,
  Clock,
  AlertTriangle,
  Sparkles,
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { TaskWithProject } from "@/lib/actions/task/get-all-tasks";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskCardProps {
  task: TaskWithProject;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAskAI: () => void;
  onDuplicate: () => void;
  isOptimisticDone?: boolean;
}

export function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
  onAskAI,
  onDuplicate,
  isOptimisticDone,
}: TaskCardProps) {
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
