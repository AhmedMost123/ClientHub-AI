"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { success, failure } from "@/lib/utils/action-result";
import { InvoiceStatus } from "@prisma/client";

// ─── Types ──────────────────────────────────────────────────────────────────

export type ClientDashboardProject = {
  id: string;
  title: string;
  status: string;
  dueDate: Date | null;
  progress: number;
  /** Name of the freelancer who owns the project (ownerId) */
  freelancerName: string | null;
};

export type ClientDashboardFile = {
  id: string;
  originalName: string;
  fileSize: number;
  fileUrl: string;
  mimeType: string;
  createdAt: Date;
};

export type ClientDashboardInvoice = {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  amount: number;
  currency: string;
  dueDate: Date | null;
  projectTitle: string;
  createdAt: Date;
};

export type ClientDashboardMessage = {
  id: string;
  content: string | null;
  isRead: boolean;
  createdAt: Date;
  senderName: string;
  hasAttachment: boolean;
  projectId: string;
};

export type ClientDashboardStats = {
  assignedProjectsCount: number;
  overallProgress: number;
  pendingInvoiceTotal: number;
  unreadMessagesCount: number;
};

export type ClientDashboardData = {
  stats: ClientDashboardStats;
  projects: ClientDashboardProject[];
  recentFiles: ClientDashboardFile[];
  latestUnpaidInvoice: ClientDashboardInvoice | null;
  unpaidInvoicesCount: number;
  recentMessages: ClientDashboardMessage[];
};

// Statuses that count as "unpaid"
// Note: the schema has no PENDING — valid values are DRAFT | SENT | PAID | OVERDUE | REJECTED
const UNPAID_STATUSES: InvoiceStatus[] = [
  InvoiceStatus.DRAFT,
  InvoiceStatus.SENT,
  InvoiceStatus.OVERDUE,
];

// ─── Main action ────────────────────────────────────────────────────────────

export async function getClientDashboardData() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "CLIENT") {
    return failure("Unauthorized");
  }

  const clientId = session.user.id;

  // ── Parallel queries scoped to this client ──────────────────────────────
  const [projects, recentFiles, unpaidInvoices, unreadMessagesCount] =
    await Promise.all([
      // 1. All projects where this user is the linked client
      prisma.project.findMany({
        where: {
          linkedClientId: clientId,
          isArchived: false,
        },
        select: {
          id: true,
          title: true,
          status: true,
          dueDate: true,
          tasks: {
            where: { deletedAt: null },
            select: { status: true },
          },
          owner: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),

      // 2. Recent files across all client's projects (newest first, up to 5)
      prisma.file.findMany({
        where: {
          project: { linkedClientId: clientId },
          isDeleted: false,
        },
        select: {
          id: true,
          originalName: true,
          fileSize: true,
          fileUrl: true,
          mimeType: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),

      // 3. Unpaid invoices across all client's projects (newest first)
      prisma.invoice.findMany({
        where: {
          project: { linkedClientId: clientId },
          status: { in: UNPAID_STATUSES },
          deletedAt: null,
        },
        select: {
          id: true,
          invoiceNumber: true,
          status: true,
          amount: true,
          currency: true,
          dueDate: true,
          createdAt: true,
          project: { select: { title: true } },
        },
        orderBy: { createdAt: "desc" },
      }),

      // 4. Unread messages count — messages NOT sent by the client, in
      //    conversations belonging to the client's projects, that are unread
      prisma.message.count({
        where: {
          conversation: {
            project: { linkedClientId: clientId },
          },
          isRead: false,
          senderId: { not: clientId },
        },
      }),
    ]);

  // ── Recent messages preview (up to 5, newest first) ─────────────────────
  // Fetch after we know which projects exist to reuse the scoping logic
  const recentMessages = await prisma.message.findMany({
    where: {
      conversation: {
        project: { linkedClientId: clientId },
      },
      // Only TEXT / FILE / IMAGE messages (skip SYSTEM)
      type: { not: "SYSTEM" },
    },
    select: {
      id: true,
      content: true,
      isRead: true,
      createdAt: true,
      type: true,
      files: { select: { id: true }, take: 1 },
      sender: { select: { name: true } },
      conversation: {
        select: { projectId: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // ── Derive progress per project ──────────────────────────────────────────
  const mappedProjects: ClientDashboardProject[] = projects.map((p) => {
    const total = p.tasks.length;
    const done = p.tasks.filter((t) => t.status === "DONE").length;
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;
    return {
      id: p.id,
      title: p.title,
      status: p.status,
      dueDate: p.dueDate,
      progress,
      freelancerName: p.owner?.name ?? null,
    };
  });

  // ── Stats ────────────────────────────────────────────────────────────────
  const overallProgress =
    mappedProjects.length > 0
      ? Math.round(
          mappedProjects.reduce((sum, p) => sum + p.progress, 0) /
            mappedProjects.length
        )
      : 0;

  const pendingInvoiceTotal = unpaidInvoices.reduce(
    (sum, inv) => sum + Number(inv.amount),
    0
  );

  const stats: ClientDashboardStats = {
    assignedProjectsCount: projects.length,
    overallProgress,
    pendingInvoiceTotal,
    unreadMessagesCount,
  };

  // ── Latest unpaid invoice ────────────────────────────────────────────────
  const latestUnpaidInvoice: ClientDashboardInvoice | null =
    unpaidInvoices.length > 0
      ? {
          id: unpaidInvoices[0].id,
          invoiceNumber: unpaidInvoices[0].invoiceNumber,
          status: unpaidInvoices[0].status,
          amount: Number(unpaidInvoices[0].amount),
          currency: unpaidInvoices[0].currency,
          dueDate: unpaidInvoices[0].dueDate,
          projectTitle: unpaidInvoices[0].project.title,
          createdAt: unpaidInvoices[0].createdAt,
        }
      : null;

  // ── Map messages ─────────────────────────────────────────────────────────
  const mappedMessages: ClientDashboardMessage[] = recentMessages.map((m) => ({
    id: m.id,
    content: m.content,
    isRead: m.isRead,
    createdAt: m.createdAt,
    senderName: m.sender.name,
    hasAttachment: m.files.length > 0 || m.type === "FILE" || m.type === "IMAGE",
    projectId: m.conversation.projectId,
  }));

  return success<ClientDashboardData>({
    stats,
    projects: mappedProjects,
    recentFiles,
    latestUnpaidInvoice,
    unpaidInvoicesCount: unpaidInvoices.length,
    recentMessages: mappedMessages,
  });
}
