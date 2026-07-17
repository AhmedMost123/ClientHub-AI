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
