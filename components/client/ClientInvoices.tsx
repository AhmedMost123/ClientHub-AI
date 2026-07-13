import { clientInvoices } from "@/lib/mock/client-dashboard";
import { cn } from "@/lib/utils";

const statusColors = {
  PAID: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  OVERDUE: "bg-red-500/10 text-red-500 border-red-500/20",
};

export function ClientInvoices() {
  if (clientInvoices.length === 0) {
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
          <h3 className="text-sm font-semibold">No invoices yet</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Invoices will appear here when issued
          </p>
        </div>
      </div>
    );
  }

  const latestInvoice = clientInvoices[0];

  return (
    <div className="card-premium rounded-2xl p-6">
      <h2 className="mb-4 text-lg font-semibold">Invoice Status</h2>
      <div className="rounded-xl border border-border/50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium">{latestInvoice.id}</span>
          <span
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs font-medium",
              statusColors[latestInvoice.status],
            )}
          >
            {latestInvoice.status}
          </span>
        </div>
        <p className="mb-1 text-sm text-muted-foreground">
          {latestInvoice.projectName}
        </p>
        <div className="mb-3 flex items-baseline gap-1">
          <span className="text-2xl font-bold">
            ${latestInvoice.amount.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground">
            {latestInvoice.currency}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Due {new Date(latestInvoice.dueDate).toLocaleDateString()}</span>
          {latestInvoice.paidDate && (
            <span>Paid {new Date(latestInvoice.paidDate).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </div>
  );
}
