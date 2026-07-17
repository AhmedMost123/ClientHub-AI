"use client";

import { useEffect, useState } from "react";

import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";

import UploadButton from "./UploadButton";
import FileDropZone from "./FileDropZone";
import FilePreviewList from "./FilePreviewList";

import { useFileUpload } from "@/hooks/useFileUpload";

interface Props {
  projectId: string;

  disabled?: boolean;

  onSend(message: string, uploadedFileIds: string[]): void;
}

export default function MessageInput({ projectId, disabled, onSend }: Props) {
  const [message, setMessage] = useState("");

  const { uploads, uploadFiles, retryUpload, removeUpload, clearCompleted } =
    useFileUpload({
      projectId,
    });

  function submit() {
    if (!message.trim() && uploads.every((u) => u.status !== "success")) {
      return;
    }

    const fileIds = uploads
      .filter((u) => u.uploadedFile)
      .map((u) => u.uploadedFile!.id);

    onSend(message, fileIds);

    setMessage("");

    clearCompleted();
  }

  useEffect(() => {
    function paste(e: ClipboardEvent) {
      const files = Array.from(e.clipboardData?.files ?? []);

      if (files.length) {
        uploadFiles(files);
      }
    }

    window.addEventListener("paste", paste);

    return () => window.removeEventListener("paste", paste);
  }, [uploadFiles]);

  return (
    <FileDropZone disabled={disabled} onFiles={uploadFiles}>
      <div className="flex flex-col gap-3 rounded-2xl border bg-card p-3 shadow-sm transition-shadow focus-within:shadow-md">
        <FilePreviewList
          uploads={uploads}
          onRetry={retryUpload}
          onRemove={removeUpload}
        />

        <div className="flex items-end gap-3">
          <div className="pb-1">
            <UploadButton disabled={disabled} onFilesSelected={uploadFiles} />
          </div>

          <Textarea
            rows={3}
            value={message}
            disabled={disabled}
            placeholder="Write a message..."
            className="min-h-[50px] resize-none border-0 bg-transparent p-2 text-[15px] shadow-none focus-visible:ring-0"
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();

                submit();
              }
            }}
          />

          <div className="pb-1">
            <Button
              onClick={submit}
              disabled={disabled || (!message.trim() && uploads.length === 0)}
              className="size-10 shrink-0 rounded-full shadow-sm"
              size="icon"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </FileDropZone>
  );
}
