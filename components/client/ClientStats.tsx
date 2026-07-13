import { FolderKanban, TrendingUp, DollarSign, MessageSquare } from "lucide-react";
import { clientStats } from "@/lib/mock/client-dashboard";
import { cn } from "@/lib/utils";

export function ClientStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Assigned Projects */}
      <div
        className="card-interactive group relative overflow-hidden rounded-2xl p-6"
        style={{ background: "var(--gradient-card-violet)" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-background/60 shadow-sm backdrop-blur-sm transition-all duration-200 group-hover:scale-110 group-hover:shadow-md">
            <FolderKanban className="size-[18px] text-foreground/80 transition-transform duration-200" aria-hidden />
          </div>
        </div>

        <div className="mt-5 space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Assigned Projects</p>
          <p className="text-3xl font-semibold tracking-tight tabular-nums">
            {clientStats.assignedProjects}
          </p>
          <p className="text-xs text-muted-foreground">Currently active</p>
        </div>
      </div>

      {/* Overall Progress */}
      <div
        className="card-interactive group relative overflow-hidden rounded-2xl p-6"
        style={{ background: "var(--gradient-card-blue)" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-background/60 shadow-sm backdrop-blur-sm transition-all duration-200 group-hover:scale-110 group-hover:shadow-md">
            <TrendingUp className="size-[18px] text-foreground/80 transition-transform duration-200" aria-hidden />
          </div>
        </div>

        <div className="mt-5 space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
          <p className="text-3xl font-semibold tracking-tight tabular-nums">
            {clientStats.overallProgress}%
          </p>
          <p className="text-xs text-muted-foreground">Across all projects</p>
        </div>
      </div>

      {/* Pending Invoice */}
      <div
        className="card-interactive group relative overflow-hidden rounded-2xl p-6"
        style={{ background: "var(--gradient-card-amber)" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-background/60 shadow-sm backdrop-blur-sm transition-all duration-200 group-hover:scale-110 group-hover:shadow-md">
            <DollarSign className="size-[18px] text-foreground/80 transition-transform duration-200" aria-hidden />
          </div>
        </div>

        <div className="mt-5 space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Pending Invoice</p>
          <p className="text-3xl font-semibold tracking-tight tabular-nums">
            ${clientStats.pendingInvoice.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">Awaiting payment</p>
        </div>
      </div>

      {/* Unread Messages */}
      <div
        className="card-interactive group relative overflow-hidden rounded-2xl p-6"
        style={{ background: "var(--gradient-card-emerald)" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-background/60 shadow-sm backdrop-blur-sm transition-all duration-200 group-hover:scale-110 group-hover:shadow-md">
            <MessageSquare className="size-[18px] text-foreground/80 transition-transform duration-200" aria-hidden />
          </div>
        </div>

        <div className="mt-5 space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Unread Messages</p>
          <p className="text-3xl font-semibold tracking-tight tabular-nums">
            {clientStats.unreadMessages}
          </p>
          <p className="text-xs text-muted-foreground">New updates</p>
        </div>
      </div>
    </div>
  );
}
