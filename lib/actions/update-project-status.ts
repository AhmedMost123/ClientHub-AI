"use server";

import { auth } from "@/auth";
import { projectRepository } from "@/lib/repositories/project.repository";
import { ProjectStatus } from "@prisma/client";
import { success, failure } from "./action-result";
import { revalidatePath } from "next/cache";

export async function updateProjectStatus(
  projectId: string,
  status: ProjectStatus,
) {
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
      return failure("Clients cannot change project status");
    }

    if (session.user.role === "FREELANCER" && project.ownerId !== session.user.id) {
      return failure("Forbidden");
    }

    await projectRepository.updateStatus(projectId, status);

    revalidatePath("/projects");
    revalidatePath(`/projects/${projectId}`);
    return success(projectId, "Project status updated");
  } catch (error: any) {
    console.error("Failed to update project status:", error);
    return failure("Failed to update project status");
  }
}
