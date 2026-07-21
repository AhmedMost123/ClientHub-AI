"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/storage/upload-file";
import { projectRepository } from "@/lib/repositories/project.repository";
import { success, failure } from "@/lib/utils/action-result";

export async function uploadChatFile(projectId: string, formData: FormData) {
  try {
    const file = formData.get("file") as File;

    if (!file || !(file instanceof File)) {
      return failure("No file provided");
    }

    const session = await auth();

    if (!session?.user?.id) {
      return failure("Unauthorized");
    }

    const project = await projectRepository.findProjectById(projectId);

    if (!project) {
      return failure("Project not found");
    }

    if (!project.linkedClientId) {
      return failure("Chat is unavailable until a client is linked.");
    }

    if (
      session.user.role === "CLIENT" &&
      project.linkedClientId !== session.user.id
    ) {
      return failure("Forbidden");
    }

    if (
      session.user.role === "FREELANCER" &&
      project.ownerId !== session.user.id
    ) {
      return failure("Forbidden");
    }

    const uploaded = await uploadFile(projectId, file);

    const created = await prisma.file.create({
      data: {
        name: uploaded.storageName,

        originalName: uploaded.originalName,

        storagePath: uploaded.storagePath,

        fileUrl: uploaded.publicUrl,

        fileSize: uploaded.fileSize,

        mimeType: uploaded.mimeType,

        uploadedById: session.user.id,

        projectId,
      },
    });

    return success(created);
  } catch (error) {
    console.error("[uploadChatFile] Upload failed:", error instanceof Error ? error.message : error);

    return failure("Upload failed");
  }
}
