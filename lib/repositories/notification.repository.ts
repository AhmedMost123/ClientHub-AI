import { prisma } from "@/lib/prisma";
import { NotificationEvent, NotificationType } from "@prisma/client";

export const notificationRepository = {
  async create(data: {
    userId: string;
    projectId?: string;
    title: string;
    message: string;
    link?: string;
    type: NotificationType;
    event: NotificationEvent;
  }) {
    return prisma.notification.create({
      data,
    });
  },

  async findById(id: string) {
    return prisma.notification.findUnique({
      where: {
        id,
      },
    });
  },

  async markAsRead(id: string) {
    return prisma.notification.update({
      where: {
        id,
      },
      data: {
        isRead: true,
      },
    });
  },

  async markAsHandled(id: string) {
    return prisma.notification.update({
      where: {
        id,
      },
      data: {
        isHandled: true,
        handledAt: new Date(),
      },
    });
  },

  async findForUser(userId: string) {
    return prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        project: {
          select: {
            title: true,
          }
        }
      }
    });
  },
};
