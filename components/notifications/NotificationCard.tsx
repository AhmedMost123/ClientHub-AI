"use client";

import { Card, CardContent } from "@/components/ui/card";
import { NotificationType } from "@prisma/client";
import { Bell, CheckCircle, Info, AlertTriangle, XCircle } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { handleProjectInvitation } from "@/lib/actions/project/handle-project-invitation";
import { handleInvoice } from "@/lib/actions/invoice/handle-invoice";
import { useNotifications } from "@/components/providers/notification-provider";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface NotificationCardProps {
  notification: {
    id: string;
    title: string;
    message: string;
    link: string | null;
    type: NotificationType;
    event?: string | null;
    isHandled?: boolean;
    projectId?: string | null;
    createdAt: Date | string;
    isRead: boolean;
  };
  onClick?: () => void;
}

export function NotificationCard({ notification, onClick }: NotificationCardProps) {
  const [isPending, startTransition] = useTransition();
  const { markAsHandled } = useNotifications();

  // ── Project Invitation logic ──────────────────────────────────────────────
  const isInvitation = notification.event === "PROJECT_INVITATION";
  const invitationId = isInvitation && notification.link && notification.link.includes("?")
    ? new URLSearchParams(notification.link.split("?")[1]).get("invitationId")
    : null;
  const invitationTargetId = invitationId || notification.projectId;

  // ── Invoice logic ─────────────────────────────────────────────────────────
  const isInvoice = notification.event === "INVOICE_CREATED";
  const invoiceId = isInvoice && notification.link && notification.link.includes("invoiceId=")
    ? new URLSearchParams(notification.link.split("?")[1]).get("invoiceId")
    : null;

  const handleInvitationAction = async (e: React.MouseEvent, action: "ACCEPT" | "DECLINE") => {
    e.preventDefault();
    e.stopPropagation();
    if (!invitationTargetId) return;

    startTransition(async () => {
      const result = await handleProjectInvitation(invitationTargetId, notification.id, action);
      if (result.success) {
        toast.success(action === "ACCEPT" ? "Invitation accepted!" : "Invitation declined.");
        markAsHandled(notification.id, action);
      } else {
        toast.error(result.error || "Failed to handle invitation");
      }
    });
  };

  const handleInvoiceAction = async (e: React.MouseEvent, action: "CONFIRM" | "REJECT") => {
    e.preventDefault();
    e.stopPropagation();
    if (!invoiceId) return;

    startTransition(async () => {
      const result = await handleInvoice(invoiceId, notification.id, action);
      if (result.success) {
        toast.success(action === "CONFIRM" ? "Payment confirmed!" : "Invoice rejected.");
        markAsHandled(notification.id, action === "CONFIRM" ? "ACCEPT" : "DECLINE");
      } else {
        toast.error(result.error || "Failed to handle invoice");
      }
    });
  };

  const Icon = {
    INFO: Info,
    SUCCESS: CheckCircle,
    WARNING: AlertTriangle,
    ERROR: XCircle,
  }[notification.type] || Bell;

  const colorClass = {
    INFO: "text-blue-500 bg-blue-500/10",
    SUCCESS: "text-green-500 bg-green-500/10",
    WARNING: "text-yellow-500 bg-yellow-500/10",
    ERROR: "text-red-500 bg-red-500/10",
  }[notification.type];

  const isActionable = isInvitation || isInvoice;

  const content = (
    <Card className={cn("rounded-2xl border bg-card shadow-sm transition-all hover:shadow-md dark:bg-[#1C1C22]", notification.isRead ? "border-white/5 opacity-80" : "border-purple-500/20")}>
      <CardContent className="flex items-start gap-4 p-5">
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", colorClass)}>
          <Icon className="size-5" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-base">{notification.title}</h4>
            <span className="text-xs text-muted-foreground mt-1 shrink-0">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{notification.message}</p>

          {/* Project Invitation actions */}
          {isInvitation && !notification.isHandled && invitationTargetId && (
            <div className="mt-3 flex items-center gap-3">
              <Button
                size="sm"
                className="h-9 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-sm font-medium text-white shadow-[0_2px_8px_rgba(124,58,237,0.3)] transition-all"
                onClick={(e) => handleInvitationAction(e, "ACCEPT")}
                disabled={isPending}
              >
                {isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <CheckCircle className="mr-2 size-4" />}
                Accept
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 rounded-lg text-sm font-medium"
                onClick={(e) => handleInvitationAction(e, "DECLINE")}
                disabled={isPending}
              >
                {isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <XCircle className="mr-2 size-4 text-destructive" />}
                Decline
              </Button>
            </div>
          )}

          {isInvitation && notification.isHandled && (
            <div className="mt-2">
              <span className={cn(
                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                notification.type === "SUCCESS" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
              )}>
                {notification.type === "SUCCESS" ? "Accepted" : "Declined"}
              </span>
            </div>
          )}

          {/* Invoice actions */}
          {isInvoice && !notification.isHandled && invoiceId && (
            <div className="mt-3 flex items-center gap-3">
              <Button
                size="sm"
                className="h-9 px-4 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-sm font-medium text-white shadow-[0_2px_8px_rgba(22,163,74,0.3)] transition-all"
                onClick={(e) => handleInvoiceAction(e, "CONFIRM")}
                disabled={isPending}
              >
                {isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <CheckCircle className="mr-2 size-4" />}
                Confirm Payment
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 rounded-lg text-sm font-medium"
                onClick={(e) => handleInvoiceAction(e, "REJECT")}
                disabled={isPending}
              >
                {isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <XCircle className="mr-2 size-4 text-destructive" />}
                Reject
              </Button>
            </div>
          )}

          {isInvoice && notification.isHandled && (
            <div className="mt-2">
              <span className={cn(
                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                notification.type === "SUCCESS" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-600"
              )}>
                {notification.type === "SUCCESS" ? "✅ Payment Confirmed" : "❌ Invoice Rejected"}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (notification.link && !isActionable) {
    return (
      <Link href={notification.link} className="block" onClick={onClick}>
        {content}
      </Link>
    );
  }

  return <div onClick={onClick} className={onClick && !isActionable ? "cursor-pointer" : ""}>{content}</div>;
}
