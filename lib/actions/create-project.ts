"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
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

  const project = await prisma.project.create({
    data: {
      title: validated.data.title,
      description: validated.data.description,
      customerName: validated.data.customerName,
      budget: validated.data.budget,
      dueDate: validated.data.dueDate,
      status: validated.data.status,
      linkedClientId: validated.data.linkedClientId || null,
      ownerId: session.user.id,
    },
  });

  return project;
}
