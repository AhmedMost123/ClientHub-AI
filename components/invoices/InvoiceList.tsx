"use client";

import { useState } from "react";
import { InvoiceStatus } from "@prisma/client";
import { format } from "date-fns";
import { Receipt } from "lucide-react";
import { toast } from "sonner";

import InvoiceDialog from "@/components/invoices/InvoiceDialog";
import { InvoiceStatusBadge } from "@/components/invoices/InvoiceStatusBadge";
import { createInvoice } from "@/lib/actions/create-invoice";
import type { CreateInvoiceInput } from "@/lib/validations/invoice";

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  amount: number | { toNumber: () => number };
  status: InvoiceStatus;
  issueDate: Date;
  dueDate: Date | null;
  paidAt: Date | null;
  notes: string | null;
}

interface Props {
  invoices: InvoiceItem[];
  projectId: string;
  canCreate: boolean;
}

function toNumber(amount: number | { toNumber: () => number }): number {
  return typeof amount === "number" ? amount : amount.toNumber();
}

export default function InvoiceList({ invoices, projectId, canCreate }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreate = async (data: CreateInvoiceInput) => {
    const result = await createInvoice(data);
    if (result.success) {
      toast.success("Invoice created and client notified");
    } else {
      toast.error(result.error || "Failed to create invoice");
      throw new Error("Failed");
    }
  };

  if (invoices.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <Receipt className="size-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">No invoices yet</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {canCreate
                ? "Create your first invoice for this project."
                : "No invoices have been created for this project."}
            </p>
          </div>
          {canCreate && (
            <button
              onClick={() => setDialogOpen(true)}
              className="text-sm font-medium text-primary hover:underline"
            >
              + Create Invoice
            </button>
          )}
        </div>

        {canCreate && (
          <InvoiceDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSubmit={handleCreate}
            projectId={projectId}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Invoices</h2>
        {canCreate && (
          <button
            onClick={() => setDialogOpen(true)}
            className="text-sm font-medium text-primary hover:underline"
          >
            + Create Invoice
          </button>
        )}
      </div>

      <div className="space-y-3">
        {invoices.map((inv) => {
          const amount = toNumber(inv.amount);
          return (
            <div
              key={inv.id}
              className="flex flex-col gap-2 rounded-xl border border-border/60 bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{inv.invoiceNumber}</span>
                  <InvoiceStatusBadge status={inv.status} />
                </div>
                <p className="text-base font-bold text-foreground">
                  ${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                  <span>Issued {format(new Date(inv.issueDate), "MMM d, yyyy")}</span>
                  {inv.dueDate && (
                    <span>Due {format(new Date(inv.dueDate), "MMM d, yyyy")}</span>
                  )}
                  {inv.paidAt && (
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      Paid {format(new Date(inv.paidAt), "MMM d, yyyy")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {canCreate && (
        <InvoiceDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleCreate}
          projectId={projectId}
        />
      )}
    </>
  );
}
