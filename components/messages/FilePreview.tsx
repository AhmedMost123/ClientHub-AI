"use client";

import {
  FileText,
  ImageIcon,
  Video,
  Loader2,
  X,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { UploadingFile } from "@/types/file-upload";

import { formatFileSize } from "@/lib/format-file-size";

import { isDocument, isImage, isVideo } from "@/lib/get-file-type";
import { cn } from "@/lib/utils";

interface Props {
  upload: UploadingFile;

  onRemove(): void;

  onRetry(): void;
}

export default function FilePreview({ upload, onRemove, onRetry }: Props) {
  const type = upload.file.type;

  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm transition-all hover:border-primary/30">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        {isImage(type) && <ImageIcon className="size-5 text-primary" />}
        {isVideo(type) && <Video className="size-5 text-primary" />}
        {isDocument(type) && <FileText className="size-5 text-primary" />}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{upload.file.name}</p>

        <p className="text-xs text-muted-foreground">
          {formatFileSize(upload.file.size)}
        </p>

        {upload.status === "uploading" && (
          <>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{
                  width: `${upload.progress}%`,
                }}
              />
            </div>

            <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              <Loader2 className="size-3 animate-spin" />
              Uploading...
            </div>
          </>
        )}

        {upload.status === "error" && (
          <p className="mt-1 text-[11px] font-medium text-destructive">{upload.error}</p>
        )}
      </div>

      {upload.status === "error" && (
        <Button size="icon" variant="ghost" className="shrink-0" onClick={onRetry}>
          <RotateCcw className="size-4" />
        </Button>
      )}

      <Button size="icon" variant="ghost" className="shrink-0 text-muted-foreground hover:text-foreground" onClick={onRemove}>
        <X className="size-4" />
      </Button>
    </div>
  );
}
