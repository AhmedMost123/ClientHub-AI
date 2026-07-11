import { Badge } from "@/components/ui/badge";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { recentInvoices } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusStyles = {
  paid: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  overdue: "bg-destructive/10 text-destructive",
};

export function RecentInvoices() {
  return (
    <ChartCard title="Recent Invoices" description="Payment status overview">
      <ul className="space-y-1" aria-label="Recent invoices">
        {recentInvoices.map((invoice) => (
          <li
            key={invoice.id}
            className="flex items-center justify-between gap-4 rounded-xl p-3 transition-colors hover:bg-muted/40"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium">{invoice.client}</p>
              <p className="text-xs text-muted-foreground">
                {invoice.id} · Due {invoice.dueDate}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-sm font-semibold tabular-nums">
                {invoice.amount}
              </span>
              <Badge
                variant="secondary"
                className={cn("capitalize", statusStyles[invoice.status])}
              >
                {invoice.status}
              </Badge>
            </div>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}
