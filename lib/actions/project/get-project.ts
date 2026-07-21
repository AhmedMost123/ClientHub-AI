"use server";

import { auth } from "@/auth";
import { success, failure } from "@/lib/utils/action-result";
import { projectRepository } from "@/lib/repositories/project.repository";

export async function getProject(projectId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return failure("Unauthorized");
    }

    const project = await projectRepository.findProjectDetails(projectId);

    if (!project) {
      return failure("Project not found");
    }

    if (
      session.user.role === "FREELANCER" &&
      project.ownerId !== session.user.id
    ) {
      return failure("Forbidden");
    }

    if (
      session.user.role === "CLIENT" &&
      project.linkedClientId !== session.user.id &&
      project.ownerId !== session.user.id
    ) {
      return failure("Forbidden");
    }

    return success(project);
  } catch (error) {
    console.error(error);

    return failure("Failed to fetch project");
  }
}
