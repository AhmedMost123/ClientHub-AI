import React from "react";
import { CheckSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyTasksState({ onNewTask }: { onNewTask: () => void }) {
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
