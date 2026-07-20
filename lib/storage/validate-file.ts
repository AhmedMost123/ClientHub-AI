import path from "path";
import {
  ALLOWED_MIME_TYPES,
  IMAGE_TYPES,
  VIDEO_TYPES,
  MAX_DOCUMENT_SIZE,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
} from "./allowed-files";

/**
 * Extensions that must never be stored, regardless of declared MIME type.
 * This is a secondary belt-and-suspenders check — MIME validation is primary.
 */
const DENIED_EXTENSIONS = new Set([
  ".exe", ".bat", ".cmd", ".sh", ".bash", ".zsh",
  ".ps1", ".ps2", ".psm1", ".psd1",
  ".msi", ".dll", ".so", ".dylib",
  ".scr", ".com", ".vbs", ".vbe",
  ".js",  ".jsx", ".ts",  ".tsx",
  ".py",  ".pyc", ".rb",  ".php",
  ".jar", ".class",
  ".app", ".deb", ".rpm",
]);

export function validateFile(file: File) {
  // 1. Reject empty files before anything else.
  if (file.size === 0) {
    throw new Error("File is empty.");
  }

  // 2. Primary security check: MIME type must be in the allow-list.
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("Unsupported file type.");
  }

  // 3. Belt-and-suspenders: deny dangerous extensions from the user filename.
  //    This does NOT affect the storage path (which is MIME-derived), but
  //    prevents storing files whose names would be misleading on download.
  const ext = path.extname(file.name).toLowerCase();
  if (ext && DENIED_EXTENSIONS.has(ext)) {
    throw new Error("File extension is not allowed.");
  }

  // 4. Size limits per category.
  if (IMAGE_TYPES.includes(file.type) && file.size > MAX_IMAGE_SIZE) {
    throw new Error("Image exceeds 10MB.");
  }

  if (VIDEO_TYPES.includes(file.type) && file.size > MAX_VIDEO_SIZE) {
    throw new Error("Video exceeds 50MB.");
  }

  if (
    !IMAGE_TYPES.includes(file.type) &&
    !VIDEO_TYPES.includes(file.type) &&
    file.size > MAX_DOCUMENT_SIZE
  ) {
    throw new Error("Document exceeds 20MB.");
  }
}
