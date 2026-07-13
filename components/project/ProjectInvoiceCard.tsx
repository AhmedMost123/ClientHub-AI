import { Download, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const statusColors = {
  PAID: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  OVERDUE: "bg-red-500/10 text-red-500 border-red-500/20",
};

interface Invoice {
  id: string;
  projectId: string;
  projectName: string;
  amount: number;
  currency: string;
  status: keyof typeof statusColors;
  dueDate: string;
  paidDate: string | null;
}

interface ProjectInvoiceCardProps {
  invoice: Invoice | null;
}

export function ProjectInvoiceCard({ invoice }: ProjectInvoiceCardProps) {
  if (!invoice) {
    return (
      <div className="card-premium rounded-2xl p-6">
        <h2 className="mb-4 text-lg font-semibold">Invoice</h2>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div
            className="mb-3 flex size-12 items-center justify-center rounded-xl"
            style={{ background: "var(--gradient-brand-subtle)" }}
          >
            <DollarSign className="size-6" style={{ color: "var(--color-primary)" }} />
          </div>
          <h3 className="text-sm font-semibold">No invoice yet</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Invoice will appear here when issued
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-premium rounded-2xl p-6">
      <h2 className="mb-4 text-lg font-semibold">Invoice</h2>
      <div className="rounded-xl border border-border/50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium">{invoice.id}</span>
          <span
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs font-medium",
              statusColors[invoice.status],
            )}
          >
            {invoice.status}
          </span>
        </div>
        <p className="mb-1 text-sm text-muted-foreground">
          {invoice.projectName}
        </p>
        <div className="mb-3 flex items-baseline gap-1">
          <span className="text-2xl font-bold">
            ${invoice.amount.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground">
            {invoice.currency}
          </span>
        </div>
        <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>Due {new Date(invoice.dueDate).toLocaleDateString()}</span>
          {invoice.paidDate && (
            <span>Paid {new Date(invoice.paidDate).toLocaleDateString()}</span>
          )}
        </div>
        <Button variant="outline" className="w-full rounded-xl gap-2">
          <Download className="size-4" />
          Download Invoice
        </Button>
      </div>
    </div>
  );
}
