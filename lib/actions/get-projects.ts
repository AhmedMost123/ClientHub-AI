"use server";

import { auth } from "@/auth";
import { success, failure } from "@/lib/actions/action-result";
import { projectRepository } from "@/lib/repositories/project.repository";
import { ProjectStatus } from "@prisma/client";

export async function getProjects(filters?: {
  status?: ProjectStatus;
  isArchived?: boolean;
}) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return failure("Unauthorized");
    }

    const projects =
      session.user.role === "CLIENT"
        ? await projectRepository.findProjectsForClient(session.user.id)
        : await projectRepository.findProjects(session.user.id, filters);

    return success(projects);
  } catch (error: unknown) {
    console.error("Failed to fetch projects:", error);

    if (error instanceof Error) {
      return failure(error.message);
    }

    return failure("Failed to fetch projects");
  }
}
