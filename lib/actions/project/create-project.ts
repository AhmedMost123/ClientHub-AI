"use server";

import { revalidatePath } from "next/cache";
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

  const project = await projectRepository.createProject(
    session.user.id,
    validated.data,
  );

  revalidatePath("/dashboard");
  revalidatePath("/client");
  revalidatePath("/admin");
  revalidatePath("/projects");
  revalidatePath("/", "layout");

  return project;
}
