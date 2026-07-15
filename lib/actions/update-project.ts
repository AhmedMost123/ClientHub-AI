"use server";

import { auth } from "@/auth";
import { CreateProjectInput, UpdateProjectSchema } from "@/lib/validations/project";
import { projectRepository } from "@/lib/repositories/project.repository";
import { ActionResult, failure, success } from "./action-result";
import { revalidatePath } from "next/cache";

export async function updateProject(id: string, data: Partial<CreateProjectInput>): Promise<ActionResult<string>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return failure("Unauthorized");
    }

    const project = await projectRepository.findProjectById(id);
    if (!project) {
      return failure("Project not found");
    }

    // Authorization
    if (session.user.role === "CLIENT") {
      // Clients can only update their own project before work begins (PLANNING status)
      if (project.ownerId !== session.user.id && project.linkedClientId !== session.user.id) {
        return failure("Forbidden");
      }
      if (project.status !== "PLANNING") {
        return failure("Cannot edit project after work has begun");
      }

      // Clients cannot change budget, status, assigned freelancer, or linked client
      delete data.budget;
      delete data.status;
      delete data.linkedClientId;
    } else if (session.user.role === "FREELANCER") {
      if (project.ownerId !== session.user.id) {
        return failure("Forbidden");
      }
    } else {
      return failure("Forbidden");
    }

    await projectRepository.updateProject(id, data);

    revalidatePath("/dashboard");
    revalidatePath("/projects");
    revalidatePath(`/projects/${id}`);

    return success(id, "Project updated successfully");
  } catch (error: any) {
    console.error("Failed to update project:", error);
    return failure(error.message || "Failed to update project");
  }
}
