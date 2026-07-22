"use server";

import { auth } from "@/auth";
import { taskRepository } from "@/lib/repositories/task.repository";
import { success, failure } from "@/lib/utils/action-result";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { projectRepository } from "@/lib/repositories/project.repository";

export async function deleteTask(taskId: string) {
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

    // Role boundary: Only Freelancer (owner) can delete tasks
    if (session.user.role === "CLIENT") {
      return failure("Clients cannot delete tasks");
    }

    if (
      session.user.role === "FREELANCER" &&
      project.ownerId !== session.user.id
    ) {
      return failure("Forbidden");
    }

    await taskRepository.deleteTask(taskId);

    await prisma.activityLog.create({
      data: {
        action: "TASK_DELETED",
        projectId: task.projectId,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/client");
    revalidatePath("/admin");
    revalidatePath("/projects");
    revalidatePath(`/projects/${task.projectId}`);
    revalidatePath("/tasks");
    revalidatePath("/", "layout");

    return success(taskId, "Task deleted successfully");
  } catch (error: unknown) {
    console.error("Failed to delete task:", error);

    const message =
      error instanceof Error ? error.message : "Failed to delete task";

    return failure(message);
  }
}
