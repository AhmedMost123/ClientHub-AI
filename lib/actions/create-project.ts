"use server";

import { auth } from "@/auth";
import { projectRepository } from "@/lib/repositories/project.repository";
import { CreateProjectSchema } from "@/lib/validations/project";

export async function createProject(data: unknown) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const validated = CreateProjectSchema.safeParse(data);

  if (!validated.success) {
    throw new Error("Invalid project data.");
  }

  return projectRepository.createProject(session.user.id, validated.data);
}
