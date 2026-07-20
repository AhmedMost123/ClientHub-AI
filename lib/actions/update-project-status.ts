"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { projectRepository } from "@/lib/repositories/project.repository";
import { invoiceRepository } from "@/lib/repositories/invoice.repository";
import { notificationService } from "@/lib/services/notification.service";
import { ProjectStatus, InvoiceStatus } from "@prisma/client";
import { success, failure } from "./action-result";
import { revalidatePath } from "next/cache";

export async function updateProjectStatus(
  projectId: string,
  status: ProjectStatus,
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return failure("Unauthorized");
    }

    const project = await projectRepository.findProjectById(projectId);
    if (!project) {
      return failure("Project not found");
    }

    if (session.user.role === "CLIENT") {
      return failure("Clients cannot change project status");
    }

    if (session.user.role === "FREELANCER" && project.ownerId !== session.user.id) {
      return failure("Forbidden");
    }

    await projectRepository.updateStatus(projectId, status);

    // Activity log for status change
    await prisma.activityLog.create({
      data: {
        action: status === "COMPLETED" ? "PROJECT_COMPLETED" : "PROJECT_UPDATED",
        projectId,
        userId: session.user.id,
      },
    });

    // Notify project members
    if (project.ownerId) {
      await notificationService.projectStatusUpdated(project.ownerId, status, project.title, projectId);
    }
    if (project.linkedClientId) {
      await notificationService.projectStatusUpdated(project.linkedClientId, status, project.title, projectId);
    }

    // Auto-invoice: When a no-client project is COMPLETED, record revenue automatically
    if (status === ProjectStatus.COMPLETED && !project.linkedClientId) {
      const budget = project.budget;
      if (budget && budget > 0) {
        // Guard: don't double-create if already has a PAID invoice
        const alreadyPaid = await invoiceRepository.hasPaidInvoice(projectId);
        if (!alreadyPaid) {
          await invoiceRepository.createInvoice({
            projectId,
            amount: budget,
            status: InvoiceStatus.PAID,
            paidAt: new Date(),
            notes: "Automatically recorded on project completion",
          });

          await prisma.activityLog.create({
            data: {
              action: "INVOICE_PAID",
              projectId,
              userId: session.user.id,
            },
          });
        }
      }
    }

    revalidatePath("/projects");
    revalidatePath(`/projects/${projectId}`);
    revalidatePath("/dashboard");
    return success(projectId, "Project status updated");
  } catch (error: any) {
    console.error("Failed to update project status:", error);
    return failure("Failed to update project status");
  }
}

