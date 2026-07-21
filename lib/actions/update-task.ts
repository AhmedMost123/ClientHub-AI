"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { auth } from "@/auth";
import { taskRepository } from "@/lib/repositories/task.repository";
import { UpdateTaskSchema, UpdateTaskInput } from "@/lib/validations/task";
import { success, failure } from "./action-result";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { projectRepository } from "@/lib/repositories/project.repository";

export async function updateTask(data: UpdateTaskInput) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return failure("Unauthorized");
    }

    const validatedFields = UpdateTaskSchema.safeParse(data);
    if (!validatedFields.success) {
      return failure("Invalid fields");
    }

    const project = await projectRepository.findProjectById(data.projectId);
    if (!project) {
      return failure("Project not found");
    }

    if (session.user.role === "CLIENT") {
      return failure("Clients cannot edit tasks");
    }

    if (session.user.role === "FREELANCER" && project.ownerId !== session.user.id) {
      return failure("Forbidden");
    }

    const task = await taskRepository.updateTask(data.id, validatedFields.data);

    await prisma.activityLog.create({
      data: {
        action: "TASK_EDITED",
        projectId: data.projectId,
        userId: session.user.id,
      }
    });

    revalidatePath("/projects");
    revalidatePath(`/projects/${data.projectId}`);
    revalidatePath("/tasks");
    return success(task, "Task updated successfully");
  } catch (error: any) {
    console.error("Failed to update task:", error);
    return failure(error.message || "Failed to update task");
  }
}
