export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024;

export const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

export const IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
];

export const DOCUMENT_TYPES = [
  "application/pdf",

  "application/msword",

  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  "application/vnd.ms-excel",

  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

  "application/vnd.ms-powerpoint",

  "application/vnd.openxmlformats-officedocument.presentationml.presentation",

  "text/plain",

  "text/csv",

  "application/zip",

  "application/x-zip-compressed",
];

export const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

export const ALLOWED_MIME_TYPES = [
  ...IMAGE_TYPES,
  ...DOCUMENT_TYPES,
  ...VIDEO_TYPES,
];

/**
 * Maps every allowed MIME type to a canonical, safe file extension.
 * Used to derive storage filenames from MIME type rather than user input,
 * preventing path-traversal and extension-spoofing attacks.
 */
export const MIME_TO_EXTENSION: Record<string, string> = {
  // Images
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  // Documents
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "pptx",
  "text/plain": "txt",
  "text/csv": "csv",
  "application/zip": "zip",
  "application/x-zip-compressed": "zip",
  // Videos
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "video/webm": "webm",
};
