"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

import { success, failure } from "@/lib/utils/action-result";
import { projectRepository } from "@/lib/repositories/project.repository";

import { UpdateProjectInput } from "@/lib/validations/project";

export async function updateProject(id: string, data: UpdateProjectInput) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return failure("Unauthorized");
    }

    const project = await projectRepository.findProjectById(id);

    if (!project) {
      return failure("Project not found");
    }

    if (project.ownerId !== session.user.id) {
      return failure("Forbidden");
    }

    await projectRepository.updateProject(id, data);

    revalidatePath("/projects");
    revalidatePath(`/projects/${id}`);

    return success(id, "Project updated");
  } catch (error) {
    console.error(error);

    return failure("Failed to update project");
  }
}
