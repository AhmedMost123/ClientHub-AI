"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { success, failure } from "./action-result";
import { revalidatePath } from "next/cache";
import { invoiceRepository } from "@/lib/repositories/invoice.repository";
import { notificationService } from "@/lib/services/notification.service";
import { InvoiceStatus } from "@prisma/client";

export async function handleInvoice(
  invoiceId: string,
  notificationId: string,
  action: "CONFIRM" | "REJECT"
) {
  const session = await auth();

  if (!session?.user?.id) {
    return failure("Unauthorized");
  }

  if (session.user.role !== "CLIENT") {
    return failure("Only clients can confirm or reject invoices");
  }

  // Fetch invoice with project info — never trust client-provided project/owner IDs
  const invoice = await invoiceRepository.findById(invoiceId);

  if (!invoice) {
    return failure("Invoice not found");
  }

  // Security: The authenticated client must be the linked client on this project
  if (invoice.project.linkedClientId !== session.user.id) {
    return failure("Forbidden");
  }

  if (invoice.status !== InvoiceStatus.SENT) {
    return failure("This invoice has already been handled");
  }

  const amount = Number(invoice.amount);
  const projectTitle = invoice.project.title;
  const freelancerId = invoice.project.ownerId;
  const projectId = invoice.project.id;
  const clientName = session.user.name ?? "The client";

  if (action === "CONFIRM") {
    // Mark invoice as PAID
    await invoiceRepository.updateStatus(invoiceId, InvoiceStatus.PAID, new Date());

    // Activity log
    await prisma.activityLog.create({
      data: {
        action: "INVOICE_PAID",
        projectId,
        userId: session.user.id,
      },
    });

    // Notify freelancer
    if (freelancerId) {
      await notificationService.invoicePaid(
        freelancerId,
        clientName,
        amount,
        projectTitle,
        projectId,
      );
    }

    // Update the original notification to handled state
    await prisma.notification.update({
      where: { id: notificationId },
      data: {
        isHandled: true,
        handledAt: new Date(),
        title: "✅ Payment Confirmed",
        message: `You confirmed payment of $${amount.toLocaleString()} for ${projectTitle}.`,
        type: "SUCCESS",
      },
    });
  } else {
    // Mark invoice as REJECTED
    await invoiceRepository.updateStatus(invoiceId, InvoiceStatus.REJECTED);

    // Activity log
    await prisma.activityLog.create({
      data: {
        action: "INVOICE_SENT", // closest existing type; INVOICE_REJECTED not in ActivityType
        projectId,
        userId: session.user.id,
      },
    });

    // Notify freelancer
    if (freelancerId) {
      await notificationService.invoiceRejected(
        freelancerId,
        clientName,
        projectTitle,
        amount,
        projectId,
      );
    }

    // Update the original notification to handled state
    await prisma.notification.update({
      where: { id: notificationId },
      data: {
        isHandled: true,
        handledAt: new Date(),
        title: "❌ Payment Rejected",
        message: `You rejected the invoice for ${projectTitle} ($${amount.toLocaleString()}).`,
        type: "WARNING",
      },
    });
  }

  revalidatePath("/notifications");
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/client");
  revalidatePath("/dashboard");

  return success({ status: action });
}
