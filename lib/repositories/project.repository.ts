import { prisma } from "@/lib/prisma";
import { ProjectStatus } from "@prisma/client";
import { CreateProjectInput } from "@/lib/validations/project";

export const projectRepository = {
  async createProject(userId: string, data: CreateProjectInput) {
    return prisma.project.create({
      data: {
        title: data.title,
        customerName: data.customerName,
        description: data.description,
        budget: data.budget,
        status: data.status,
        dueDate: data.dueDate,
        linkedClientId: data.linkedClientId,
        ownerId: userId,
      },
    });
  },

  async updateProject(id: string, data: Partial<CreateProjectInput>) {
    return prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        customerName: data.customerName,
        description: data.description,
        budget: data.budget,
        status: data.status,
        dueDate: data.dueDate,
        linkedClientId: data.linkedClientId,
      },
    });
  },

  async deleteProject(id: string) {
    return prisma.project.delete({
      where: { id },
    });
  },

  async archiveProject(id: string) {
    return prisma.project.update({
      where: { id },
      data: {
        isArchived: true,
        archivedAt: new Date(),
      },
    });
  },

  async findProjectById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true, avatar: true } },
        linkedClient: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        _count: { select: { tasks: true, invoices: true, files: true } },
      },
    });
  },

  async findProjectDetails(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true, avatar: true } },
        linkedClient: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        tasks: { orderBy: { order: "asc" } },
        files: { orderBy: { createdAt: "desc" } },
        invoices: { orderBy: { createdAt: "desc" } },
        activities: {
          orderBy: { createdAt: "desc" },
          include: { user: { select: { name: true, avatar: true } } },
        },
      },
    });
  },

  async findProjects(
    ownerId: string,
    filters?: { status?: ProjectStatus; isArchived?: boolean },
  ) {
    return prisma.project.findMany({
      where: {
        ownerId,
        ...(filters?.status && { status: filters.status }),
        ...(filters?.isArchived !== undefined
          ? { isArchived: filters.isArchived }
          : { isArchived: false }),
      },
      include: {
        linkedClient: { select: { id: true, name: true, avatar: true } },
        _count: { select: { tasks: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async findProjectsForClient(clientId: string) {
    return prisma.project.findMany({
      where: {
        OR: [
          { linkedClientId: clientId },
          { ownerId: clientId }, // Client requested projects
        ],
        isArchived: false,
      },
      include: {
        owner: { select: { id: true, name: true, avatar: true } },
        _count: { select: { tasks: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async updateStatus(id: string, status: ProjectStatus) {
    return prisma.project.update({
      where: { id },
      data: { status },
    });
  },
};
