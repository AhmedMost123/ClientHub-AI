import { Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ChartCard } from "@/components/dashboard/ChartCard";
import type { RecentInvoiceItem } from "@/lib/actions/dashboard/get-dashboard-data";
import { InvoiceStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

type RecentInvoicesProps = {
  invoices: RecentInvoiceItem[];
};

const statusStyles: Record<InvoiceStatus, string> = {
  PAID:    "bg-success/10 text-success",
  SENT:    "bg-warning/10 text-warning",
  OVERDUE: "bg-destructive/10 text-destructive",
  DRAFT:   "bg-muted text-muted-foreground",
  REJECTED: "bg-muted text-muted-foreground",
};

const statusLabels: Record<InvoiceStatus, string> = {
  PAID:    "Paid",
  SENT:    "Pending",
  OVERDUE: "Overdue",
  DRAFT:   "Draft",
  REJECTED: "Rejected",
};

export function RecentInvoices({ invoices }: RecentInvoicesProps) {
  return (
    <ChartCard title="Recent Invoices" description="Payment status overview">
      {invoices.length > 0 ? (
        <ul className="space-y-1" aria-label="Recent invoices">
          {invoices.map((invoice) => (
            <li
              key={invoice.id}
              className="flex items-center justify-between gap-4 rounded-xl p-3 transition-colors hover:bg-muted/40"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium">{invoice.customerName}</p>
                <p className="text-xs text-muted-foreground">
                  {invoice.invoiceNumber}
                  {invoice.dueDate
                    ? ` · Due ${invoice.dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                    : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-sm font-semibold tabular-nums">
                  ${invoice.amount.toLocaleString()}
                </span>
                <Badge
                  variant="secondary"
                  className={cn("capitalize", statusStyles[invoice.status])}
                >
                  {statusLabels[invoice.status]}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
          <Receipt className="size-8 text-muted-foreground/40" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">No invoices yet</p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Invoices you create will appear here with their payment status.
            </p>
          </div>
        </div>
      )}
    </ChartCard>
  );
}
