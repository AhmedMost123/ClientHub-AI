"use server";

import { auth } from "@/auth";
import { notificationRepository } from "@/lib/repositories/notification.repository";
import { success, failure } from "@/lib/utils/action-result";
import { prisma } from "@/lib/prisma";

export async function markNotificationRead(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return failure("Unauthorized");
    }

    const notification = await notificationRepository.findById(id);
    if (!notification || notification.userId !== session.user.id) {
      return failure("Not found or forbidden");
    }

    await notificationRepository.markAsRead(id);
    return success(true);
  } catch (error: any) {
    console.error("Failed to mark notification read:", error);
    return failure("Failed to mark read");
  }
}

export async function markAllNotificationsRead() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return failure("Unauthorized");
    }

    await prisma.notification.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true },
    });

    return success(true);
  } catch (error: any) {
    console.error("Failed to mark all notifications read:", error);
    return failure("Failed to mark all read");
  }
}
