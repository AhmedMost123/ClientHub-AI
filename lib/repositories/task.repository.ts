import { prisma } from "@/lib/prisma";
import { CreateTaskInput, UpdateTaskInput } from "@/lib/validations/task";
import { TaskStatus } from "@prisma/client";

export const taskRepository = {
  async createTask(userId: string, data: CreateTaskInput) {
    // Get the highest order to append at the end
    const lastTask = await prisma.task.findFirst({
      where: { projectId: data.projectId },
      orderBy: { order: "desc" },
    });
    const order = lastTask ? lastTask.order + 1 : 0;

    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        estimatedHours: data.estimatedHours,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate,
        order,
        projectId: data.projectId,
        createdById: userId,
      },
    });
  },

  async updateTask(id: string, data: UpdateTaskInput) {
    return prisma.task.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        estimatedHours: data.estimatedHours,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate,
      },
    });
  },

  async toggleTaskStatus(id: string) {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) throw new Error("Task not found");

    const newStatus = task.status === "DONE" ? "TODO" : "DONE";
    return prisma.task.update({
      where: { id },
      data: {
        status: newStatus,
        completedAt: newStatus === "DONE" ? new Date() : null,
      },
    });
  },

  async deleteTask(id: string) {
    return prisma.task.delete({
      where: { id },
    });
  },

  async findTaskById(id: string) {
    return prisma.task.findUnique({
      where: { id },
      include: { project: true },
    });
  },

  async findByProject(projectId: string) {
    return prisma.task.findMany({
      where: { projectId, deletedAt: null },
      orderBy: { order: "asc" },
    });
  },

  async reorderTasks(projectId: string, taskIds: string[]) {
    const updates = taskIds.map((id, index) =>
      prisma.task.update({
        where: { id },
        data: { order: index },
      })
    );
    return prisma.$transaction(updates);
  },
};
