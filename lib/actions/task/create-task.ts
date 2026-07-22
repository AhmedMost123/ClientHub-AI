"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { auth } from "@/auth";
import { taskRepository } from "@/lib/repositories/task.repository";
import { CreateTaskSchema, CreateTaskInput } from "@/lib/validations/task";
import { success, failure } from "@/lib/utils/action-result";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { projectRepository } from "@/lib/repositories/project.repository";

export async function createTask(data: CreateTaskInput) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return failure("Unauthorized");
    }

    const validatedFields = CreateTaskSchema.safeParse(data);
    if (!validatedFields.success) {
      return failure("Invalid fields");
    }

    const project = await projectRepository.findProjectById(data.projectId);
    if (!project) {
      return failure("Project not found");
    }

    // Role boundary: Only Freelancer (owner) can create tasks
    if (session.user.role === "CLIENT") {
      return failure("Clients cannot create tasks");
    }

    if (session.user.role === "FREELANCER" && project.ownerId !== session.user.id) {
      return failure("Forbidden");
    }

    const task = await taskRepository.createTask(session.user.id, validatedFields.data);

    // Create ActivityLog
    await prisma.activityLog.create({
      data: {
        action: "TASK_CREATED",
        projectId: data.projectId,
        userId: session.user.id,
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/client");
    revalidatePath("/admin");
    revalidatePath("/projects");
    revalidatePath(`/projects/${data.projectId}`);
    revalidatePath("/tasks");
    revalidatePath("/", "layout");

    return success(task, "Task created successfully");
  } catch (error: any) {
    console.error("Failed to create task:", error);
    return failure(error.message || "Failed to create task");
  }
}
