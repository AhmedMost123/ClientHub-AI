import { supabaseAdmin } from "@/lib/supabase/server";
import { validateFile } from "./validate-file";
import { generateUniqueFileName } from "./file-name";

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET!;

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
  validateFile(file);

  const storageName = generateUniqueFileName(file.name);

  const storagePath = `${projectId}/${storageName}`;

  const buffer = await file.arrayBuffer();
  console.log("=== UPLOAD FILE DIAGNOSTICS ===");
  console.log("Bucket:", BUCKET);
  console.log("Project ID:", projectId);
  console.log("Storage name:", storageName);
  console.log("Storage path:", storagePath);
  console.log("File name:", file.name);
  console.log("File type:", file.type);
  console.log("File size:", file.size);
  console.log("Buffer size:", buffer.byteLength);
  console.log("Buffer type:", buffer.constructor.name);
  
  try {
    console.log("Calling supabaseAdmin.storage.from(BUCKET).upload()...");
    console.log("Parameters:", {
      bucket: BUCKET,
      path: storagePath,
      bufferLength: buffer.byteLength,
      options: {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      },
    });
    
    const result = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(storagePath, buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    console.log("Upload result:", {
      bucket: BUCKET,
      storagePath,
      result,
    });

    if (result.error) {
      console.error("Upload error details:", result.error);
      throw new Error(JSON.stringify(result.error, null, 2));
    }
  } catch (e) {
    console.error("UPLOAD FAILED");
    console.error({
      bucket: BUCKET,
      storagePath,
      projectId,
      storageName,
      fileName: file.name,
      fileType: file.type,
      error: e,
    });
    throw e;
  }

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(storagePath);

  return {
    storagePath,
    publicUrl: data.publicUrl,
    storageName,
    originalName: file.name,
    mimeType: file.type,
    fileSize: file.size,
  };
}
