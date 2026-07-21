"use server";

import { auth } from "@/auth";
import { notificationRepository } from "@/lib/repositories/notification.repository";
import { success, failure } from "./action-result";

export async function getNotifications() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return failure("Unauthorized");
    }

    const notifications = await notificationRepository.findForUser(session.user.id);
    return success(notifications);
  } catch (error: any) {
    console.error("Failed to fetch notifications:", error);
    return failure("Failed to fetch notifications");
  }
}
