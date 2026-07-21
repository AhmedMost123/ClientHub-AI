"use server";

import { auth } from "@/auth";
import { projectRepository } from "@/lib/repositories/project.repository";
import { success, failure } from "@/lib/utils/action-result";
import { revalidatePath } from "next/cache";

export async function deleteProject(projectId: string) {
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
      return failure("Clients cannot delete projects");
    }

    if (
      session.user.role === "FREELANCER" &&
      project.ownerId !== session.user.id
    ) {
      return failure("Forbidden");
    }

    await projectRepository.deleteProject(projectId);

    revalidatePath("/projects");
    return success(projectId, "Project deleted successfully");
  } catch (error: unknown) {
    console.error("Failed to delete project:", error);

    if (error instanceof Error) {
      return failure(error.message);
    }

    return failure("Failed to delete project");
  }
}
