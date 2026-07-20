import { supabaseAdmin } from "@/lib/supabase/server";

export async function deleteFile(storagePath: string) {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET;

  if (!bucket) {
    throw new Error("Supabase storage bucket is not configured.");
  }

  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .remove([storagePath]);

  if (error) {
    throw new Error(error.message);
  }
}
