"use client";

import { CheckCircle2, Circle, MoreVertical, Pencil, Trash2, Calendar, Clock } from "lucide-react";
import { TaskStatus, Priority } from "@prisma/client";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TaskPriorityBadge from "./TaskPriorityBadge";
import TaskStatusBadge from "./TaskStatusBadge";

interface Props {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: Priority;
  estimatedHours?: number | null;
  dueDate?: Date | null;

  onToggle?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;

  canEdit?: boolean;
}

export default function TaskCard({
  title,
  description,
  status,
  priority,
  estimatedHours,
  dueDate,
  onToggle,
  onEdit,
  onDelete,
  canEdit = false,
}: Props) {
  const isDone = status === "DONE";

  return (
    <div className={cn("group flex items-start justify-between rounded-xl border bg-card p-4 transition-all hover:shadow-sm", isDone && "opacity-60 grayscale-[0.3]")}>
      <div className="flex gap-4 w-full min-w-0">
        <button 
          type="button" 
          onClick={onToggle} 
          disabled={!canEdit}
          className={cn("mt-1 shrink-0", canEdit ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default opacity-70")}
        >
          {isDone ? (
            <CheckCircle2 className="size-6 text-emerald-500 fill-emerald-500/20" />
          ) : (
            <Circle className="size-6 text-muted-foreground hover:text-foreground transition-colors" />
          )}
        </button>

        <div className="w-full min-w-0 space-y-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h3
              className={cn(
                "font-medium truncate transition-colors",
                isDone && "line-through text-muted-foreground",
              )}
            >
              {title}
            </h3>

            <div className="flex items-center gap-2 shrink-0">
              <TaskPriorityBadge priority={priority} />
              <TaskStatusBadge status={status} />
            </div>
          </div>

          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            {dueDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                <span>{format(new Date(dueDate), "MMM d, yyyy")}</span>
              </div>
            )}
            
            {estimatedHours ? (
              <div className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                <span>{estimatedHours}h estimated</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {canEdit && (
        <DropdownMenu>
          {/* @ts-expect-error type issue with DropdownMenuTrigger */}
          <DropdownMenuTrigger asChild>
            <Button size="icon-sm" variant="ghost" className="ml-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 data-[state=open]:opacity-100">
              <MoreVertical className="size-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
              <Pencil className="mr-2 size-4" />
              Edit Task
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground">
              <Trash2 className="mr-2 size-4" />
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
