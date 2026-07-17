import {
  ALLOWED_MIME_TYPES,
  IMAGE_TYPES,
  VIDEO_TYPES,
  MAX_DOCUMENT_SIZE,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
} from "./allowed-files";

export function validateFile(file: File) {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("Unsupported file type.");
  }

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
