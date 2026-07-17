export interface UploadedFile {
  id: string;
  name: string;
  originalName?: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  createdAt: Date;
}

export interface UploadResponse {
  success: boolean;
  file?: UploadedFile;
  error?: string;
}
