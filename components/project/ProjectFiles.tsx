import { FileText, Download, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface File {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadDate: string;
  uploadedBy: "freelancer" | "client";
  projectId: string;
}

interface ProjectFilesProps {
  files: File[];
}

export function ProjectFiles({ files }: ProjectFilesProps) {
  if (files.length === 0) {
    return (
      <div className="card-premium rounded-2xl p-6">
        <h2 className="mb-4 text-lg font-semibold">Shared Files</h2>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div
            className="mb-3 flex size-12 items-center justify-center rounded-xl"
            style={{ background: "var(--gradient-brand-subtle)" }}
          >
            <FileText className="size-6" style={{ color: "var(--color-primary)" }} />
          </div>
          <h3 className="text-sm font-semibold">No files yet</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Files shared in this project will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-premium rounded-2xl p-6">
      <h2 className="mb-4 text-lg font-semibold">Shared Files</h2>
      <div className="space-y-3">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between rounded-lg border border-border/50 p-3 transition-all hover:border-border"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex size-10 items-center justify-center rounded-lg"
                style={{ background: "var(--gradient-brand-subtle)" }}
              >
                <FileText className="size-5" style={{ color: "var(--color-primary)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.fileName}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{file.fileSize}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <User className="size-3" />
                    {file.uploadedBy === "freelancer" ? "Freelancer" : "You"}
                  </span>
                  <span>•</span>
                  <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
              <Download className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
