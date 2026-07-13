import { clientProjects } from "@/lib/mock/client-dashboard";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

export function ClientFiles() {
  // Aggregate files from all projects for dashboard overview
  const allFiles = clientProjects.flatMap((project) => {
    const { getProjectFiles } = require("@/lib/mock/client-dashboard");
    return getProjectFiles(project.id);
  });

  if (allFiles.length === 0) {
    return (
      <div className="card-premium rounded-2xl p-6">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div
            className="mb-3 flex size-12 items-center justify-center rounded-xl"
            style={{ background: "var(--gradient-brand-subtle)" }}
          >
            <FileText className="size-6" style={{ color: "var(--color-primary)" }} />
          </div>
          <h3 className="text-sm font-semibold">No files yet</h3>
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
        {allFiles.slice(0, 4).map((file: any) => (
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
              <div>
                <p className="text-sm font-medium">{file.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {file.fileSize} • {new Date(file.uploadDate).toLocaleDateString()}
                </p>
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
