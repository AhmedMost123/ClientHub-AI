import {
  IMAGE_TYPES,
  VIDEO_TYPES,
  DOCUMENT_TYPES,
} from "@/lib/storage/allowed-files";

export function isImage(type: string) {
  return IMAGE_TYPES.includes(type);
}

export function isVideo(type: string) {
  return VIDEO_TYPES.includes(type);
}

export function isDocument(type: string) {
  return DOCUMENT_TYPES.includes(type);
}
