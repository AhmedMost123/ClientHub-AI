import type { ClientDashboardInvoice } from "@/lib/actions/get-client-dashboard-data";
import { cn } from "@/lib/utils";

// ─── Status styling ────────────────────────────────────────────────────────────

const statusColors: Record<string, string> = {
  PAID: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  DRAFT: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  SENT: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  OVERDUE: "bg-red-500/10 text-red-500 border-red-500/20",
  REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
};


// ─── Component ─────────────────────────────────────────────────────────────────

interface ClientInvoicesProps {
  invoice: ClientDashboardInvoice | null;
  totalCount: number;
}

export function ClientInvoices({ invoice, totalCount }: ClientInvoicesProps) {
  if (invoice === null) {
    return (
      <div className="card-premium rounded-2xl p-6">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div
            className="mb-3 flex size-12 items-center justify-center rounded-xl"
            style={{ background: "var(--gradient-brand-subtle)" }}
          >
            <svg
              className="size-6"
              style={{ color: "var(--color-primary)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
              />
            </svg>
          </div>
          <h3 className="text-sm font-semibold">No invoices available.</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Invoices will appear here when issued
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-premium rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Invoice Status</h2>
        {totalCount > 1 && (
          <span className="text-xs text-muted-foreground">
            +{totalCount - 1} more
          </span>
        )}
      </div>
      <div className="rounded-xl border border-border/50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium">{invoice.invoiceNumber}</span>
          <span
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs font-medium",
              statusColors[invoice.status] ??
                "bg-slate-500/10 text-slate-500 border-slate-500/20"
            )}
          >
            {invoice.status}
          </span>
        </div>
        <p className="mb-1 text-sm text-muted-foreground">{invoice.projectTitle}</p>
        <div className="mb-3 flex items-baseline gap-1">
          <span className="text-2xl font-bold">
            ${invoice.amount.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground">{invoice.currency}</span>
        </div>
        {invoice.dueDate && (
          <div className="text-sm text-muted-foreground">
            Due{" "}
            {new Date(invoice.dueDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        )}
      </div>
    </div>
  );
}
