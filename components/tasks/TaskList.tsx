"use client";

import { useOptimistic, useState, useTransition } from "react";
import { TaskStatus, Priority } from "@prisma/client";
import { toast } from "sonner";

import TaskCard from "./TaskCard";
import EmptyTasks from "./EmptyTasks";
import TaskDialog, { TaskFormData } from "./TaskDialog";
import DeleteTaskDialog from "./DeleteTaskDialog";

import { createTask } from "@/lib/actions/create-task";
import { updateTask } from "@/lib/actions/update-task";
import { deleteTask } from "@/lib/actions/delete-task";
import { toggleTask } from "@/lib/actions/toggle-task";

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  estimatedHours: number | null;
  dueDate: Date | null;
  order: number;
}

interface Props {
  tasks: Task[];
  projectId: string;
  canEdit?: boolean;
}

export default function TaskList({ tasks, projectId, canEdit = false }: Props) {
  // Optimistic UI for toggling
  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    tasks,
    (state: Task[], updatedTask: { id: string; status: TaskStatus }) =>
      state.map((task) =>
        task.id === updatedTask.id ? { ...task, status: updatedTask.status } : task
      )
  );

  const [isPending, startTransition] = useTransition();

  // State for Dialogs
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async (taskId: string, currentStatus: TaskStatus) => {
    if (!canEdit) return;
    const newStatus = currentStatus === "DONE" ? "TODO" : "DONE";

    startTransition(() => {
      addOptimisticTask({ id: taskId, status: newStatus });
    });

    const result = await toggleTask(taskId);
    if (!result.success) {
      toast.error(result.error || "Failed to toggle task");
    }
  };

  const handleSaveTask = async (data: TaskFormData) => {
    if (editingTask) {
      const result = await updateTask({ id: editingTask.id, ...data });
      if (result.success) {
        toast.success("Task updated");
      } else {
        toast.error(result.error || "Failed to update task");
        throw new Error("Failed");
      }
    } else {
      const result = await createTask(data);
      if (result.success) {
        toast.success("Task created");
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
        setDeleteDialogOpen(false);
        setTaskToDelete(null);
      } else {
        toast.error(result.error || "Failed to delete task");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const openCreateDialog = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const openDeleteDialog = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteDialogOpen(true);
  };

  if (tasks.length === 0) {
    return (
      <>
        <EmptyTasks canEdit={canEdit} onAdd={openCreateDialog} />
        {canEdit && (
          <TaskDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSubmit={handleSaveTask}
            projectId={projectId}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Tasks</h2>
        {canEdit && (
          <button
            onClick={openCreateDialog}
            className="text-sm font-medium text-primary hover:underline"
          >
            + Add Task
          </button>
        )}
      </div>

      <div className="space-y-3">
        {optimisticTasks.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            title={task.title}
            description={task.description}
            status={task.status}
            priority={task.priority}
            estimatedHours={task.estimatedHours}
            dueDate={task.dueDate}
            canEdit={canEdit}
            onToggle={() => handleToggle(task.id, task.status)}
            onEdit={() => openEditDialog(task)}
            onDelete={() => openDeleteDialog(task.id)}
          />
        ))}
      </div>

      {canEdit && (
        <>
          <TaskDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSubmit={handleSaveTask}
            projectId={projectId}
            defaultValues={editingTask || undefined}
          />

          <DeleteTaskDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={handleDeleteConfirm}
            isDeleting={isDeleting}
          />
        </>
      )}
    </>
  );
}
