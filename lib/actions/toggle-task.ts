"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { auth } from "@/auth";
import { taskRepository } from "@/lib/repositories/task.repository";
import { success, failure } from "./action-result";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { projectRepository } from "@/lib/repositories/project.repository";

export async function toggleTask(taskId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return failure("Unauthorized");
    }

    const task = await taskRepository.findTaskById(taskId);
    if (!task) {
      return failure("Task not found");
    }

    const project = await projectRepository.findProjectById(task.projectId);
    if (!project) {
      return failure("Project not found");
    }

    if (session.user.role === "CLIENT") {
      return failure("Clients cannot edit tasks");
    }

    if (session.user.role === "FREELANCER" && project.ownerId !== session.user.id) {
      return failure("Forbidden");
    }

    const updatedTask = await taskRepository.toggleTaskStatus(taskId);

    // Only log if we toggled to DONE
    if (updatedTask.status === "DONE") {
      await prisma.activityLog.create({
        data: {
          action: "TASK_COMPLETED",
          projectId: task.projectId,
          userId: session.user.id,
        }
      });
    }

    revalidatePath("/projects");
    revalidatePath(`/projects/${task.projectId}`);
    return success(updatedTask, "Task status toggled");
  } catch (error: any) {
    console.error("Failed to toggle task:", error);
    return failure(error.message || "Failed to toggle task");
  }
}
