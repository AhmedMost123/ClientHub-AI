import { NotificationEvent, NotificationType } from "@prisma/client";

import { notificationRepository } from "@/lib/repositories/notification.repository";
import { realtimeNotificationService } from "@/lib/services/realtime-notification.service";

async function createAndSend(data: {
  userId: string;
  projectId?: string;
  title: string;
  message: string;
  link?: string;
  type: NotificationType;
  event: NotificationEvent;
}) {
  const notification = await notificationRepository.create(data);
  realtimeNotificationService.send(data.userId, notification);
  return notification;
}

export const notificationService = {
  async sendProjectInvitation(
    projectId: string,
    freelancerName: string,
    projectTitle: string,
    clientId: string,
    invitationId: string,
  ) {
    return createAndSend({
      userId: clientId,
      projectId,
      title: "📩 Project Invitation",
      message: `${freelancerName} invited you to join '${projectTitle}'.`,
      link: `/client/projects/${projectId}?invitationId=${invitationId}`,
      type: NotificationType.INFO,
      event: NotificationEvent.PROJECT_INVITATION,
    });
  },

  async projectInvitationAccepted(
    freelancerId: string,
    clientName: string,
    projectTitle: string,
    projectId: string,
  ) {
    return createAndSend({
      userId: freelancerId,
      projectId,
      title: "🎉 Invitation Accepted",
      message: `Great news! ${clientName} accepted your invitation to '${projectTitle}'.`,
      link: `/projects/${projectId}`,
      type: NotificationType.SUCCESS,
      event: NotificationEvent.PROJECT_INVITATION_ACCEPTED,
    });
  },

  async projectInvitationDeclined(
    freelancerId: string,
    clientName: string,
    projectTitle: string,
  ) {
    return createAndSend({
      userId: freelancerId,
      title: "😔 Invitation Declined",
      message: `${clientName} declined your invitation to '${projectTitle}'.`,
      type: NotificationType.WARNING,
      event: NotificationEvent.PROJECT_INVITATION_DECLINED,
    });
  },

  async projectStatusUpdated(
    userId: string,
    status: string,
    projectTitle: string,
    projectId: string,
  ) {
    let title = "📋 Status Updated";
    let message = `Project '${projectTitle}' status changed to ${status}.`;

    if (status === "IN_PROGRESS") {
      title = "🚀 Project Started";
      message = `Your project '${projectTitle}' is now In Progress.`;
    } else if (status === "REVIEW") {
      title = "📋 Project in Review";
      message = `Project '${projectTitle}' is ready for your review.`;
    } else if (status === "COMPLETED") {
      title = "🎉 Project Completed";
      message = `Congratulations! '${projectTitle}' is now completed.`;
    } else if (status === "CANCELLED") {
      title = "❌ Project Cancelled";
      message = `Project '${projectTitle}' has been cancelled.`;
    }

    return createAndSend({
      userId,
      projectId,
      title,
      message,
      link: `/projects/${projectId}`,
      type: NotificationType.INFO,
      event: NotificationEvent.PROJECT_COMPLETED, // General project event
    });
  },

  async messageSent(
    receiverId: string,
    senderName: string,
    projectId: string,
  ) {
    return createAndSend({
      userId: receiverId,
      projectId,
      title: "💬 New Message",
      message: `${senderName} sent you a message.`,
      link: `/projects/${projectId}`,
      type: NotificationType.INFO,
      event: NotificationEvent.NEW_MESSAGE,
    });
  },

  async fileShared(
    receiverId: string,
    senderName: string,
    projectId: string,
  ) {
    return createAndSend({
      userId: receiverId,
      projectId,
      title: "📎 File Shared",
      message: `${senderName} shared a file.`,
      link: `/projects/${projectId}`,
      type: NotificationType.INFO,
      event: NotificationEvent.FILE_UPLOADED,
    });
  },
};
