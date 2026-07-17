export type UploadStatus =
  | "idle"
  | "uploading"
  | "success"
  | "error"
  | "cancelled";

export interface UploadedFile {
  id: string;

  originalName: string;

  fileUrl: string;

  mimeType: string;

  fileSize: number;

  storagePath: string;
}

export interface UploadingFile {
  id: string;

  file: File;

  progress: number;

  status: UploadStatus;

  uploadedFile?: UploadedFile;

  error?: string;

  abortController?: AbortController;
}
