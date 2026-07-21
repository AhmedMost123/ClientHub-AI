"use client";

import { Trash2 } from "lucide-react";

import { useTransition } from "react";

import { deleteTask } from "@/lib/actions/task/delete-task";

import { Button } from "@/components/ui/button";

interface Props {
  taskId: string;
  projectId: string;
}

export default function DeleteTaskButton({ taskId, projectId }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await deleteTask(taskId);
        })
      }
    >
      <Trash2 className="size-4 text-destructive" />
    </Button>
  );
}
