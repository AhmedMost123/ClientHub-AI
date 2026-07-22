"use server";

import { auth } from "@/auth";
import { projectRepository } from "@/lib/repositories/project.repository";
import { success, failure } from "@/lib/utils/action-result";
import { revalidatePath } from "next/cache";

export async function restoreProject(projectId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return failure("Unauthorized");
    }

    const project = await projectRepository.findProjectById(projectId);
    if (!project) {
      return failure("Project not found");
    }

    if (session.user.role === "CLIENT") {
      return failure("Clients cannot restore projects");
    }

    if (
      session.user.role === "FREELANCER" &&
      project.ownerId !== session.user.id
    ) {
      return failure("Forbidden");
    }

    await projectRepository.restoreProject(projectId);

    revalidatePath("/dashboard");
    revalidatePath("/client");
    revalidatePath("/admin");
    revalidatePath("/projects", "layout");
    revalidatePath(`/projects/${projectId}`, "layout");
    revalidatePath("/", "layout");
    
    return success(projectId, "Project restored successfully");
  } catch (error: unknown) {
    console.error("Failed to restore project:", error);

    if (error instanceof Error) {
      return failure(error.message);
    }

    return failure("Failed to restore project");
  }
}
