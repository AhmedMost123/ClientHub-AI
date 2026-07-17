import { NotificationEvent, NotificationType } from "@prisma/client";

import { notificationRepository } from "@/lib/repositories/notification.repository";

export const notificationService = {
  async sendProjectInvitation(
    projectId: string,
    freelancerName: string,
    projectTitle: string,
    clientId: string,
  ) {
    return notificationRepository.create({
      userId: clientId,
      projectId,
      title: "Project Invitation",
      message: `${freelancerName} invited you to collaborate on "${projectTitle}".`,
      link: `/notifications`,
      type: NotificationType.INFO,
      event: NotificationEvent.PROJECT_INVITATION,
    });
  },

  async projectInvitationAccepted(
    freelancerId: string,
    projectTitle: string,
  ) {
    return notificationRepository.create({
      userId: freelancerId,
      title: "Invitation Accepted",
      message: `The client accepted your invitation to "${projectTitle}".`,
      type: NotificationType.SUCCESS,
      event: NotificationEvent.PROJECT_INVITATION_ACCEPTED,
    });
  },

  async projectInvitationDeclined(
    freelancerId: string,
    projectTitle: string,
  ) {
    return notificationRepository.create({
      userId: freelancerId,
      title: "Invitation Declined",
      message: `The client declined your invitation to "${projectTitle}".`,
      type: NotificationType.WARNING,
      event: NotificationEvent.PROJECT_INVITATION_DECLINED,
    });
  },
};
