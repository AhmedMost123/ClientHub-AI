"use client";

import FilePreview from "./FilePreview";

import { UploadingFile } from "@/types/file-upload";

interface Props {
  uploads: UploadingFile[];

  onRemove(id: string): void;

  onRetry(upload: UploadingFile): void;
}

export default function FilePreviewList({ uploads, onRemove, onRetry }: Props) {
  if (!uploads.length) {
    return null;
  }

  return (
    <div className="space-y-2">
      {uploads.map((upload) => (
        <FilePreview
          key={upload.id}
          upload={upload}
          onRemove={() => onRemove(upload.id)}
          onRetry={() => onRetry(upload)}
        />
      ))}
    </div>
  );
}
