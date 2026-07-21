import type { ClientDashboardFile } from "@/lib/actions/get-client-dashboard-data";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { formatFileSize } from "@/lib/format-file-size";

// ─── Skeleton ──────────────────────────────────────────────────────────────────

function FileRowSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
      <div className="flex items-center gap-3">
        <div className="size-10 animate-pulse rounded-lg bg-muted" />
        <div className="space-y-1.5">
          <div className="h-3 w-36 animate-pulse rounded-full bg-muted" />
          <div className="h-2.5 w-24 animate-pulse rounded-full bg-muted/70" />
        </div>
      </div>
      <div className="size-8 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────

interface ClientFilesProps {
  files: ClientDashboardFile[] | null;
}

export function ClientFiles({ files }: ClientFilesProps) {
  // Loading skeleton
  if (files === null) {
    return (
      <div className="card-premium rounded-2xl p-6">
        <div className="mb-4 h-5 w-28 animate-pulse rounded-full bg-muted" />
        <div className="space-y-3">
          <FileRowSkeleton />
          <FileRowSkeleton />
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="card-premium rounded-2xl p-6">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div
            className="mb-3 flex size-12 items-center justify-center rounded-xl"
            style={{ background: "var(--gradient-brand-subtle)" }}
          >
            <FileText className="size-6" style={{ color: "var(--color-primary)" }} />
          </div>
          <h3 className="text-sm font-semibold">No files have been shared yet.</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Files shared by your freelancer will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-premium rounded-2xl p-6">
      <h2 className="mb-4 text-lg font-semibold">Recent Files</h2>
      <div className="space-y-3">
        {files.map((file) => (
          <a
            key={file.id}
            href={file.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg border border-border/50 p-3 transition-all hover:border-border"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex size-10 items-center justify-center rounded-lg"
                style={{ background: "var(--gradient-brand-subtle)" }}
              >
                <FileText className="size-5" style={{ color: "var(--color-primary)" }} />
              </div>
              <div>
                <p className="text-sm font-medium line-clamp-1">{file.originalName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.fileSize)} •{" "}
                  {new Date(file.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              aria-label={`Download ${file.originalName}`}
              asChild
            >
              <span>
                <Download className="size-4" />
              </span>
            </Button>
          </a>
        ))}
      </div>
    </div>
  );
}
