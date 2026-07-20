import { InvoiceStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  InvoiceStatus,
  { label: string; className: string }
> = {
  DRAFT: {
    label: "Draft",
    className: "border-border text-muted-foreground",
  },
  SENT: {
    label: "Sent",
    className: "border-blue-500/30 bg-blue-500/10 text-blue-500",
  },
  PAID: {
    label: "Paid",
    className: "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400",
  },
  OVERDUE: {
    label: "Overdue",
    className: "border-red-500/30 bg-red-500/10 text-red-500",
  },
  REJECTED: {
    label: "Rejected",
    className: "border-muted bg-muted/50 text-muted-foreground",
  },
};

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

export function InvoiceStatusBadge({ status, className }: InvoiceStatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.DRAFT;
  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium", config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
