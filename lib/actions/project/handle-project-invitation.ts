"use server";

import { auth } from "@/auth";
import { success, failure } from "@/lib/utils/action-result";
import { projectInvitationRepository } from "@/lib/repositories/project-invitation.repository";
import { projectRepository } from "@/lib/repositories/project.repository";
import { notificationService } from "@/lib/services/notification.service";
import { prisma } from "@/lib/prisma";
import { ProjectInvitationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function handleProjectInvitation(
  invitationIdOrProjectId: string,
  notificationId: string,
  action: "ACCEPT" | "DECLINE"
) {
  const session = await auth();

  if (!session?.user?.id) {
    return failure("Unauthorized");
  }

  let invitation = await projectInvitationRepository.findById(invitationIdOrProjectId);

  if (!invitation) {
    // Fallback: the string might actually be a projectId from an older notification
    invitation = await projectInvitationRepository.findPendingInvitation(invitationIdOrProjectId, session.user.id) as any;
  }

  if (!invitation) {
    return failure("Invitation not found");
  }

  if (invitation.clientId !== session.user.id && invitation.freelancerId !== session.user.id) {
    return failure("Forbidden");
  }

  if (invitation.status !== ProjectInvitationStatus.PENDING) {
    return failure("Invitation already handled.");
  }

  const isClientAccepting = session.user.id === invitation.clientId;
  const targetUserIdToNotify = isClientAccepting ? invitation.freelancerId : invitation.clientId;
  const responderName = session.user.name ?? (isClientAccepting ? "The client" : "The freelancer");

  if (action === "ACCEPT") {
    await projectInvitationRepository.updateStatus(
      invitation.id,
      ProjectInvitationStatus.ACCEPTED,
    );
    
    // Both client and freelancer must be linked to the project
    // If client created it, owner=client, linkedClient=null initially. Wait, actually `createClientProject` sets `linkedClientId = session.user.id` and `ownerId = null`.
    // If freelancer created it, owner=freelancer, linkedClient=null initially.
    // So if the client is accepting, we link the client. If freelancer is accepting, we link the freelancer (as owner).
    if (isClientAccepting) {
      await projectRepository.linkClient(invitation.projectId, session.user.id);
    } else {
      // If freelancer is accepting, they become the owner
      await prisma.project.update({
        where: { id: invitation.projectId },
        data: { ownerId: session.user.id }
      });
    }

    await projectRepository.createConversation(invitation.projectId);
    
    await notificationService.projectInvitationAccepted(
      targetUserIdToNotify,
      responderName,
      invitation.project.title,
      invitation.projectId,
    );
  } else {
    await projectInvitationRepository.updateStatus(
      invitation.id,
      ProjectInvitationStatus.DECLINED,
    );
    await notificationService.projectInvitationDeclined(
      targetUserIdToNotify,
      responderName,
      invitation.project.title,
    );
  }

  await prisma.notification.update({
    where: { id: notificationId },
    data: {
      isHandled: true,
      handledAt: new Date(),
      title: action === "ACCEPT" ? "🎉 Invitation Accepted" : "😔 Invitation Declined",
      message: action === "ACCEPT" ? `You accepted the invitation to '${invitation.project.title}'.` : `You declined the invitation to '${invitation.project.title}'.`,
      type: action === "ACCEPT" ? "SUCCESS" : "WARNING",
    },
  });

  revalidatePath("/notifications");
  revalidatePath("/projects");
  revalidatePath("/dashboard");
  revalidatePath("/client/projects");
  revalidatePath("/client");

  return success({ status: action });
}
