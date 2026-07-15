"use server";

import { auth } from "@/auth";
import { CreateProjectInput, CreateProjectSchema } from "@/lib/validations/project";
import { projectRepository } from "@/lib/repositories/project.repository";
import { ActionResult, failure, success } from "./action-result";
import { revalidatePath } from "next/cache";

export async function createProject(data: CreateProjectInput): Promise<ActionResult<string>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return failure("Unauthorized");
    }

    const parsedData = CreateProjectSchema.parse(data);

    // Clients cannot set a linked client or arbitrary status
    if (session.user.role === "CLIENT") {
      parsedData.linkedClientId = null;
      parsedData.status = "PLANNING";
    }

    const project = await projectRepository.createProject(session.user.id, parsedData);

    revalidatePath("/dashboard");
    revalidatePath("/projects");

    return success(project.id, "Project created successfully");
  } catch (error: any) {
    console.error("Failed to create project:", error);
    return failure(error.message || "Failed to create project");
  }
}
