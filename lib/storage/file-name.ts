import crypto from "crypto";
import { MIME_TO_EXTENSION } from "./allowed-files";

/**
 * Returns a safe display name by stripping path separators, null bytes,
 * and control characters from the user-supplied filename.
 * This result is stored in `originalName` (DB) for display/download only —
 * it is NEVER used as the storage path.
 */
export function sanitizeOriginalName(name: string): string {
  return (
    name
      // Remove any directory traversal components
      .replace(/[/\\]/g, "_")
      // Remove null bytes and control characters
      .replace(/[\x00-\x1f\x7f]/g, "")
      // Collapse leading dots (hidden files like .bashrc)
      .replace(/^\.+/, "")
      .trim() || "file"
  );
}

/**
 * Generates a cryptographically unique storage filename whose extension is
 * derived from the validated MIME type — never from user input.
 * Storage path format: `<uuid>.<ext>`
 */
export function generateStorageName(mimeType: string): string {
  const ext = MIME_TO_EXTENSION[mimeType] ?? "bin";
  return `${crypto.randomUUID()}.${ext}`;
}

/**
 * @deprecated Use generateStorageName(mimeType) instead.
 * Kept for any existing callers — delegates to the safe version
 * using the original name only to fall back to "bin" if mime is unknown.
 */
export function generateUniqueFileName(name: string): string {
  // This should not be used in new code; callers should pass mime type.
  // We keep the signature so nothing breaks if it's referenced elsewhere.
  void name;
  return `${crypto.randomUUID()}.bin`;
}
