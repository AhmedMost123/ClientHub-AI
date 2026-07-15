"use server";

import { auth } from "@/auth";
import { projectRepository } from "@/lib/repositories/project.repository";
import { success, failure } from "./action-result";
import { revalidatePath } from "next/cache";

export async function archiveProject(projectId: string) {
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
      return failure("Clients cannot archive projects");
    }

    if (
      session.user.role === "FREELANCER" &&
      project.ownerId !== session.user.id
    ) {
      return failure("Forbidden");
    }

    await projectRepository.archiveProject(projectId);

    revalidatePath("/projects");
    return success(projectId, "Project archived successfully");
  } catch (error: unknown) {
    console.error("Failed to archive project:", error);

    if (error instanceof Error) {
      return failure(error.message);
    }

    return failure("Failed to archive project");
  }
}
