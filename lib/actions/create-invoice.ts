"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { success, failure } from "./action-result";
import { revalidatePath } from "next/cache";
import { CreateInvoiceSchema, CreateInvoiceInput } from "@/lib/validations/invoice";
import { invoiceRepository } from "@/lib/repositories/invoice.repository";
import { projectRepository } from "@/lib/repositories/project.repository";
import { notificationService } from "@/lib/services/notification.service";

export async function createInvoice(data: CreateInvoiceInput) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return failure("Unauthorized");
    }

    if (session.user.role === "CLIENT") {
      return failure("Clients cannot create invoices");
    }

    const validatedFields = CreateInvoiceSchema.safeParse(data);
    if (!validatedFields.success) {
      return failure("Invalid fields");
    }

    // Security: Verify freelancer owns the project
    const project = await projectRepository.findProjectById(data.projectId);
    if (!project) {
      return failure("Project not found");
    }

    if (project.ownerId !== session.user.id) {
      return failure("Forbidden");
    }

    const invoice = await invoiceRepository.createInvoice({
      projectId: project.id,
      amount: validatedFields.data.amount,
      dueDate: validatedFields.data.dueDate ?? null,
      notes: validatedFields.data.notes ?? null,
    });

    // Create activity log
    await prisma.activityLog.create({
      data: {
        action: "INVOICE_SENT",
        projectId: project.id,
        userId: session.user.id,
      },
    });

    // Notify the linked client if one exists
    if (project.linkedClientId) {
      await notificationService.invoiceCreated(
        project.linkedClientId,
        session.user.name ?? "Your freelancer",
        validatedFields.data.amount,
        project.title,
        project.id,
        invoice.id,
      );
    }

    revalidatePath(`/projects/${project.id}`);
    revalidatePath("/dashboard");

    return success(invoice, "Invoice created successfully");
  } catch (error: any) {
    console.error("Failed to create invoice:", error);
    return failure(error.message || "Failed to create invoice");
  }
}
