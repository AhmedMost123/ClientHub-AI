"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { auth } from "@/auth";
import { projectRepository } from "@/lib/repositories/project.repository";
import { success, failure } from "./action-result";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function sendMessage(projectId: string, content: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return failure("Unauthorized");
    }

    if (!content || content.trim().length === 0) {
      return failure("Message content cannot be empty");
    }

    const project = await projectRepository.findProjectById(projectId);
    if (!project) {
      return failure("Project not found");
    }

    // Role boundaries for messaging
    if (session.user.role === "CLIENT" && project.linkedClientId !== session.user.id) {
      return failure("Forbidden: You are not linked to this project");
    }
    if (session.user.role === "FREELANCER" && project.ownerId !== session.user.id) {
      return failure("Forbidden: You do not own this project");
    }

    let conversation = await projectRepository.findConversation(projectId);

    // Auto-create conversation if it doesn't exist, ONLY IF there is a linked client
    if (!conversation) {
      if (project.linkedClientId) {
        conversation = await projectRepository.createConversation(projectId);
      } else {
        return failure("Cannot send message without a linked client");
      }
    }

    const message = await projectRepository.sendMessage(conversation.id, session.user.id, content);

    // Activity Log
    await prisma.activityLog.create({
      data: {
        action: "MESSAGE_SENT",
        projectId: projectId,
        userId: session.user.id,
      }
    });

    revalidatePath("/projects");
    revalidatePath(`/projects/${projectId}`);
    return success(message, "Message sent");
  } catch (error: any) {
    console.error("Failed to send message:", error);
    return failure(error.message || "Failed to send message");
  }
}
