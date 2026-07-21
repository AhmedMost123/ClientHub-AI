"use server";

import { auth } from "@/auth";
import { success, failure } from "@/lib/utils/action-result";

import { projectInvitationRepository } from "@/lib/repositories/project-invitation.repository";
import { projectRepository } from "@/lib/repositories/project.repository";
import { notificationService } from "@/lib/services/notification.service";

import { ProjectInvitationStatus } from "@prisma/client";

export async function acceptProjectInvitation(invitationId: string) {
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
    ProjectInvitationStatus.ACCEPTED,
  );

  await projectRepository.linkClient(invitation.projectId, session.user.id);

  await projectRepository.createConversation(invitation.projectId);

  await notificationService.projectInvitationAccepted(
    invitation.freelancerId,
    session.user.name ?? "The client",
    invitation.project.title,
    invitation.projectId,
  );

  return success(true);
}
