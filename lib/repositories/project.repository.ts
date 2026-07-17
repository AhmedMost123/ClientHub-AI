import { prisma } from "@/lib/prisma";
import { MessageType } from "@prisma/client";
import { Prisma, ProjectStatus } from "@prisma/client";
import { CreateProjectInput } from "@/lib/validations/project";
import { projectCardInclude } from "./project.includes";

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

  async restoreProject(id: string) {
    return prisma.project.update({
      where: { id },
      data: {
        isArchived: false,
        archivedAt: null,
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
        owner: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        linkedClient: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        tasks: {
          orderBy: { order: "asc" },
        },
        files: {
          orderBy: { createdAt: "desc" },
        },
        invoices: {
          orderBy: { createdAt: "desc" },
        },
        activities: {
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { name: true, avatar: true } },
          },
        },
        // Integrated conversation block
        conversation: {
          include: {
            messages: {
              include: {
                sender: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                  },
                },

                files: {
                  orderBy: {
                    createdAt: "asc",
                  },
                },
              },

              orderBy: {
                createdAt: "asc",
              },
            },
          },
        },
      },
    });
  },

  async findProjects(
    ownerId: string,
    filters?: {
      status?: ProjectStatus;
      isArchived?: boolean;
      includeArchived?: boolean;
    },
  ) {
    return prisma.project.findMany({
      where: {
        ownerId,
        ...(filters?.status && {
          status: filters.status,
        }),
        ...(filters?.includeArchived
          ? {}
          : filters?.isArchived !== undefined
            ? { isArchived: filters.isArchived }
            : { isArchived: false }),
      },

      include: projectCardInclude,

      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async findProjectsForClient(
    clientId: string,
    filters?: { includeArchived?: boolean },
  ) {
    return prisma.project.findMany({
      where: {
        linkedClientId: clientId,
        ...(filters?.includeArchived ? {} : { isArchived: false }),
      },

      include: projectCardInclude,

      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async updateStatus(id: string, status: ProjectStatus) {
    return prisma.project.update({
      where: { id },
      data: { status },
    });
  },
  async findConversation(projectId: string) {
    return prisma.conversation.findUnique({
      where: {
        projectId,
      },

      include: {
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },

            files: true,
          },

          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
  },
  async createConversation(projectId: string) {
    const existing = await prisma.conversation.findUnique({
      where: { projectId },
    });

    if (existing) {
      return existing;
    }

    return prisma.conversation.create({
      data: {
        projectId,
      },
    });
  },

  async sendMessage(
    conversationId: string,
    senderId: string,
    data: {
      content?: string;
      fileIds?: string[];
    },
  ) {
    return prisma.$transaction(async (tx) => {
      let type: MessageType = MessageType.TEXT;

      if (data.fileIds?.length) {
        const uploadedFiles = await tx.file.findMany({
          where: {
            id: {
              in: data.fileIds,
            },
          },
        });

        const hasImage = uploadedFiles.some((file) =>
          file.mimeType.startsWith("image/"),
        );

        type = hasImage ? "IMAGE" : "FILE";
      }

      return tx.message.create({
        data: {
          conversationId,
          senderId,
          type,
          content: data.content?.trim() || null,
          files: data.fileIds?.length
            ? {
                connect: data.fileIds.map((id) => ({ id })),
              }
            : undefined,
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          files: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
    });
  },
  async sendMessageWithFiles(
    conversationId: string,
    senderId: string,
    data: {
      content?: string;
      type: "TEXT" | "FILE" | "IMAGE";
      fileIds?: string[];
    },
  ) {
    return prisma.$transaction(async (tx) => {
      return tx.message.create({
        data: {
          conversationId,
          senderId,
          type: data.type,
          content: data.content ?? null,
          files: data.fileIds?.length
            ? {
                connect: data.fileIds.map((id) => ({ id })),
              }
            : undefined,
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          files: true,
        },
      });
    });
  },

  async markConversationAsRead(conversationId: string, userId: string) {
    return prisma.message.updateMany({
      where: {
        conversationId,
        senderId: {
          not: userId,
        },
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  },
  async linkClient(projectId: string, clientId: string) {
    return prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        linkedClientId: clientId,
      },
    });
  },
};
