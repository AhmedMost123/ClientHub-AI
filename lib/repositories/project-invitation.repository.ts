import { prisma } from "@/lib/prisma";
import { ProjectInvitationStatus } from "@prisma/client";

export const projectInvitationRepository = {
  async create(data: {
    projectId: string;
    freelancerId: string;
    clientId: string;
  }) {
    return prisma.projectInvitation.create({
      data,
      include: {
        project: true,
        freelancer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

  async findById(id: string) {
    return prisma.projectInvitation.findUnique({
      where: { id },
      include: {
        project: true,
        freelancer: true,
        client: true,
      },
    });
  },

  async findPendingInvitation(projectId: string, userId: string) {
    return prisma.projectInvitation.findFirst({
      where: {
        projectId,
        OR: [
          { clientId: userId },
          { freelancerId: userId }
        ],
        status: ProjectInvitationStatus.PENDING,
      },
      include: {
        project: true,
      },
    });
  },

  async findPendingInvitationsForClient(clientId: string) {
    return prisma.projectInvitation.findMany({
      where: {
        clientId,
        status: ProjectInvitationStatus.PENDING,
      },
      include: {
        freelancer: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        project: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async updateStatus(id: string, status: ProjectInvitationStatus) {
    return prisma.projectInvitation.update({
      where: {
        id,
      },
      data: {
        status,
        respondedAt: new Date(),
      },
    });
  },

  async delete(id: string) {
    return prisma.projectInvitation.delete({
      where: {
        id,
      },
    });
  },
};
