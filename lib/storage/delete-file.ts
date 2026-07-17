import { supabaseAdmin } from "@/lib/supabase/server";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET!;

export async function deleteFile(storagePath: string) {
  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .remove([storagePath]);

  if (error) {
    throw new Error(error.message);
  }
}
