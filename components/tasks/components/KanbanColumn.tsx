import React from "react";
import type { TaskWithProject } from "@/lib/actions/task/get-all-tasks";
import { TaskCard } from "./TaskCard";

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

export function KanbanColumn({
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
