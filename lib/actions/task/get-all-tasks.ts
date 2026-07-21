"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { success, failure } from "./action-result";

export interface TaskWithProject {
  id: string;
  title: string;
  description: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  estimatedHours: number | null;
  dueDate: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  order: number;
  projectId: string;
  project: {
    id: string;
    title: string;
    status: string;
    customerName: string;
  };
}

export async function getAllTasks() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return failure("Unauthorized");
    }

    if (session.user.role === "CLIENT") {
      return failure("Clients cannot view this page");
    }

    const tasks = await prisma.task.findMany({
      where: {
        deletedAt: null,
        project: {
          ownerId: session.user.id,
          isArchived: false,
        },
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            status: true,
            customerName: true,
          },
        },
      },
      orderBy: [{ dueDate: "asc" }, { priority: "desc" }, { createdAt: "desc" }],
    });

    return success(tasks as TaskWithProject[]);
  } catch (error: unknown) {
    console.error("Failed to fetch tasks:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch tasks";
    return failure(message);
  }
}
