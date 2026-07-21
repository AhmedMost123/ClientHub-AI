"use server";

import { auth } from "@/auth";
import { success, failure } from "./action-result";

import { projectInvitationRepository } from "@/lib/repositories/project-invitation.repository";
import { notificationService } from "@/lib/services/notification.service";

import { ProjectInvitationStatus } from "@prisma/client";

export async function declineProjectInvitation(invitationId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return failure("Unauthorized");
  }

  const invitation = await projectInvitationRepository.findById(invitationId);

  if (!invitation) {
    return failure("Invitation not found");
  }

  if (invitation.clientId !== session.user.id) {
    return failure("Forbidden");
  }

  if (invitation.status !== ProjectInvitationStatus.PENDING) {
    return failure("Invitation already handled.");
  }

  await projectInvitationRepository.updateStatus(
    invitation.id,
    ProjectInvitationStatus.DECLINED,
  );

  await notificationService.projectInvitationDeclined(
    invitation.freelancerId,
    session.user.name ?? "The client",
    invitation.project.title,
  );

  return success(true);
}
