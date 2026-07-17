"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/storage/upload-file";
import { projectRepository } from "@/lib/repositories/project.repository";
import { success, failure } from "./action-result";
import { supabaseAdmin } from "@/lib/supabase/server";
export async function uploadChatFile(projectId: string, formData: FormData) {
  try {
    console.log("=== SUPABASE DIAGNOSTICS ===");
    console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "SET" : "NOT SET");
    
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
    
    // Test bucket listing
    console.log("Testing listBuckets()...");
    const { data: bucketsData, error: bucketsError } = await supabaseAdmin.storage.listBuckets();
    console.log("listBuckets result:", { data: bucketsData, error: bucketsError });
    
    if (bucketsError) {
      console.error("listBuckets failed:", bucketsError);
    }
    
    // Test bucket contents listing
    console.log("Testing bucket list()...");
    const { data: listData, error: listError } = await supabaseAdmin.storage.from("chat-files").list();
    console.log("bucket list() result:", { data: listData, error: listError });
    
    if (listError) {
      console.error("bucket list() failed:", listError);
    }
    
    console.log("=== END DIAGNOSTICS ===");
    
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
    console.error(error);

    return failure("Upload failed");
  }
}
