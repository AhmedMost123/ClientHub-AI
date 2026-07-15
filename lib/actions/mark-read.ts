"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { auth } from "@/auth";
import { projectRepository } from "@/lib/repositories/project.repository";
import { success, failure } from "./action-result";
import { revalidatePath } from "next/cache";

export async function markAsRead(projectId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return failure("Unauthorized");
    }

    const conversation = await projectRepository.findConversation(projectId);
    if (!conversation) {
      return failure("Conversation not found");
    }

    await projectRepository.markConversationAsRead(conversation.id, session.user.id);

    revalidatePath("/projects");
    revalidatePath(`/projects/${projectId}`);
    return success(null, "Marked as read");
  } catch (error: any) {
    console.error("Failed to mark read:", error);
    return failure("Failed to mark as read");
  }
}
