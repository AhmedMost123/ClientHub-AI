import { ReactNode } from "react";

interface ProjectWorkspaceLayoutProps {
  header: ReactNode;
  leftColumn: ReactNode;
  rightColumn: ReactNode;
}

export function ProjectWorkspaceLayout({
  header,
  leftColumn,
  rightColumn,
}: ProjectWorkspaceLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      {header}

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Left Column - 70% */}
        <div className="lg:col-span-3 space-y-6">
          {leftColumn}
        </div>

        {/* Right Column - 30% */}
        <div className="lg:col-span-1 space-y-6">
          {rightColumn}
        </div>
      </div>
    </div>
  );
}
