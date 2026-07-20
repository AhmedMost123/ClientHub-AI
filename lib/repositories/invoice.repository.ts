import { prisma } from "@/lib/prisma";
import { InvoiceStatus } from "@prisma/client";
import { format } from "date-fns";

export const invoiceRepository = {
  /**
   * Generate a unique invoice number: INV-YYYYMMDD-XXXX
   */
  async generateInvoiceNumber(): Promise<string> {
    const datePart = format(new Date(), "yyyyMMdd");
    const count = await prisma.invoice.count();
    const seq = String(count + 1).padStart(4, "0");
    return `INV-${datePart}-${seq}`;
  },

  async createInvoice(data: {
    projectId: string;
    amount: number;
    dueDate?: Date | null;
    notes?: string | null;
    status?: InvoiceStatus;
    paidAt?: Date | null;
  }) {
    const invoiceNumber = await this.generateInvoiceNumber();
    return prisma.invoice.create({
      data: {
        invoiceNumber,
        projectId: data.projectId,
        amount: data.amount,
        dueDate: data.dueDate ?? null,
        notes: data.notes ?? null,
        status: data.status ?? InvoiceStatus.SENT,
        paidAt: data.paidAt ?? null,
      },
      include: {
        project: {
          select: {
            title: true,
            customerName: true,
            ownerId: true,
            linkedClientId: true,
          },
        },
      },
    });
  },

  async findByProject(projectId: string) {
    return prisma.invoice.findMany({
      where: { projectId, deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(id: string) {
    return prisma.invoice.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            customerName: true,
            ownerId: true,
            linkedClientId: true,
          },
        },
      },
    });
  },

  async hasPaidInvoice(projectId: string): Promise<boolean> {
    const count = await prisma.invoice.count({
      where: { projectId, status: InvoiceStatus.PAID, deletedAt: null },
    });
    return count > 0;
  },

  async updateStatus(
    id: string,
    status: InvoiceStatus,
    paidAt?: Date | null
  ) {
    return prisma.invoice.update({
      where: { id },
      data: {
        status,
        ...(paidAt !== undefined ? { paidAt } : {}),
      },
    });
  },
};
