"use server";

import { auth } from "@/auth";
import { projectRepository } from "@/lib/repositories/project.repository";
import { notificationService } from "@/lib/services/notification.service";
import { success, failure } from "./action-result";
import { projectInvitationRepository } from "@/lib/repositories/project-invitation.repository";

export async function inviteClient(projectId: string, clientId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return failure("Unauthorized");
  }

  const project = await projectRepository.findProjectById(projectId);

  if (!project) {
    return failure("Project not found");
  }

  if (project.ownerId !== session.user.id) {
    return failure("Forbidden");
  }

  const existing = await projectInvitationRepository.findPendingInvitation(
    projectId,
    clientId,
  );

  if (existing) {
    return failure("An invitation has already been sent.");
  }

  await projectInvitationRepository.create({
    projectId,
    freelancerId: session.user.id,
    clientId,
  });

  await notificationService.sendProjectInvitation(
    project.id,
    session.user.name ?? "Freelancer",
    project.title,
    clientId,
  );

  return success(true);
}
