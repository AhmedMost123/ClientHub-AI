"use client";

import { useRef } from "react";

import { Paperclip } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  disabled?: boolean;

  onFilesSelected(files: File[]): void;
}

export default function UploadButton({ disabled, onFilesSelected }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        hidden
        multiple
        type="file"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);

          if (files.length) {
            onFilesSelected(files);
          }

          e.target.value = "";
        }}
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        <Paperclip className="size-5" />
      </Button>
    </>
  );
}
