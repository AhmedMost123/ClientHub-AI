"use server";

import { auth } from "@/auth";
import { projectRepository } from "@/lib/repositories/project.repository";
import { success, failure } from "./action-result";

export async function getProject(projectId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return failure("Unauthorized");
    }

    const project = await projectRepository.findProjectDetails(projectId);

    if (!project) {
      return failure("Project not found.");
    }

    // Role-based authorization
    if (session.user.role === "CLIENT") {
      if (project.linkedClientId !== session.user.id && project.ownerId !== session.user.id) {
        return failure("Forbidden");
      }
    } else if (session.user.role === "FREELANCER") {
      if (project.ownerId !== session.user.id) {
        return failure("Forbidden");
      }
    }

    return success(project);
  } catch (error: any) {
    console.error("Failed to fetch project:", error);
    return failure("Failed to fetch project");
  }
}
