"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  disabled?: boolean;
  onFiles(files: File[]): void;
  children: React.ReactNode;
}

export default function FileDropZone({ disabled, onFiles, children }: Props) {
  const [dragging, setDragging] = useState(false);

  function stop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  function drop(e: React.DragEvent) {
    stop(e);
    setDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);

    if (files.length) {
      onFiles(files);
    }
  }

  return (
    <div
      onDragEnter={() => setDragging(true)}
      onDragLeave={() => setDragging(false)}
      onDragOver={stop}
      onDrop={drop}
      className={cn(
        "relative rounded-2xl transition-all duration-200",
        dragging && "ring-4 ring-primary/20 bg-primary/5",
      )}
    >
      {dragging && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary bg-background/80 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
            <UploadCloud className="size-7 text-primary" />
          </div>

          <p className="text-lg font-semibold text-foreground">Drop files here</p>

          <p className="mt-1 text-sm font-medium text-muted-foreground">
            Images, videos and documents
          </p>
        </div>
      )}

      {children}
    </div>
  );
}
