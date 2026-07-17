"use client";

import { useCallback, useState } from "react";

import { uploadChatFile } from "@/lib/actions/upload-chat-file";

import { UploadingFile } from "@/types/file-upload";

interface UseFileUploadProps {
  projectId: string;
}

export function useFileUpload({ projectId }: UseFileUploadProps) {
  const [uploads, setUploads] = useState<UploadingFile[]>([]);

  const updateUpload = useCallback(
    (id: string, updater: (file: UploadingFile) => UploadingFile) => {
      setUploads((prev) =>
        prev.map((file) => (file.id === id ? updater(file) : file)),
      );
    },
    [],
  );

  const removeUpload = useCallback((id: string) => {
    setUploads((prev) => prev.filter((file) => file.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setUploads((prev) => prev.filter((file) => file.status !== "success"));
  }, []);

  const uploadFiles = useCallback(
    async (files: File[]) => {
      for (const file of files) {
        const id = crypto.randomUUID();

        setUploads((prev) => [
          ...prev,
          {
            id,
            file,
            progress: 0,
            status: "uploading",
          },
        ]);

        try {
          updateUpload(id, (upload) => ({
            ...upload,
            progress: 20,
          }));

          const formData = new FormData();
          formData.append("file", file);
          const result = await uploadChatFile(projectId, formData);

          if (!result.success) {
            throw new Error(result.error);
          }

          updateUpload(id, (upload) => ({
            ...upload,
            progress: 100,
            status: "success",
            uploadedFile: {
              id: result.data.id,
              originalName: result.data.originalName,
              fileUrl: result.data.fileUrl,
              mimeType: result.data.mimeType,
              fileSize: result.data.fileSize,
              storagePath: result.data.storagePath,
            },
          }));
        } catch (error) {
          updateUpload(id, (upload) => ({
            ...upload,
            status: "error",
            error: error instanceof Error ? error.message : "Upload failed",
          }));
        }
      }
    },
    [projectId, updateUpload],
  );

  const retryUpload = useCallback(
    async (upload: UploadingFile) => {
      removeUpload(upload.id);

      await uploadFiles([upload.file]);
    },
    [removeUpload, uploadFiles],
  );

  return {
    uploads,

    uploadFiles,

    retryUpload,

    removeUpload,

    clearCompleted,
  };
}
