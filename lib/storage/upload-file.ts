import { supabaseAdmin } from "@/lib/supabase/server";
import { validateFile } from "./validate-file";
import { sanitizeOriginalName, generateStorageName } from "./file-name";

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET;

export interface UploadFileResult {
  storagePath: string;
  publicUrl: string;
  storageName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
}

export async function uploadFile(
  projectId: string,
  file: File,
): Promise<UploadFileResult> {
  if (!BUCKET) {
    throw new Error("Supabase storage bucket is not configured.");
  }

  // Validate first — throws on invalid type, size, or empty file.
  validateFile(file);

  // Display name: sanitized from user input, stored in DB, never used as path.
  const originalName = sanitizeOriginalName(file.name);

  // Storage name: derived from the validated MIME type, completely independent
  // of the user-supplied filename — prevents path traversal and extension spoofing.
  const storageName = generateStorageName(file.type);

  const storagePath = `${projectId}/${storageName}`;

  const buffer = await file.arrayBuffer();

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(storagePath, buffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    console.error("[uploadFile] Supabase upload error:", error.message);
    throw new Error("File upload failed.");
  }

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(storagePath);

  return {
    storagePath,
    publicUrl: data.publicUrl,
    storageName,
    originalName,
    mimeType: file.type,
    fileSize: file.size,
  };
}
