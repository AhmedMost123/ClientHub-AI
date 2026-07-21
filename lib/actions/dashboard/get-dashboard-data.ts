"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { success, failure } from "@/lib/utils/action-result";
import { InvoiceStatus, NotificationEvent } from "@prisma/client";

// ─── Exported Types ────────────────────────────────────────────────────────────

export type DashboardStats = {
  revenueThisMonth: number;
  activeProjectsCount: number;
  pendingInvoicesCount: number;
  overdueInvoicesCount: number;
  /** Sum of Task.estimatedHours — structured for future real time-tracking. */
  billableHoursEstimated: number;
};

export type RevenueChartPoint = {
  month: string;
  revenue: number;
};

export type DeadlineItem = {
  id: string;
  title: string;
  company: string;
  dueDate: Date;
  type: "task" | "project";
};

export type ActivityItem = {
  id: string;
  title: string;
  message: string;
  event: NotificationEvent;
  link: string | null;
  createdAt: Date;
};

export type RecentInvoiceItem = {
  id: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: Date | null;
};

export type DashboardData = {
  stats: DashboardStats;
  revenueChart: RevenueChartPoint[];
  deadlines: DeadlineItem[];
  activities: ActivityItem[];
  recentInvoices: RecentInvoiceItem[];
};

// ─── Month labels (UTC-safe index) ────────────────────────────────────────────

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

// ─── Main action ───────────────────────────────────────────────────────────────

export async function getDashboardData() {
  const session = await auth();
  if (!session?.user?.id) {
    return failure("Unauthorized");
  }
  const userId = session.user.id;

  const now = new Date();

  // Boundaries for "this month" revenue
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  // Start of the window for the 12-month revenue chart
  // We want the first day of the month 11 months ago.
  const chartWindowStart = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  // ── Parallel queries ────────────────────────────────────────────────────────
  const [
    revenueThisMonthAgg,
    activeProjectsCount,
    pendingInvoicesCount,
    overdueInvoicesCount,
    billableHoursAgg,
    paidInvoicesForChart,
    taskDeadlines,
    projectDeadlines,
    activities,
    recentInvoicesRaw,
  ] = await Promise.all([
    // 1. Revenue this month — aggregate PAID invoices where paidAt is in current month
    prisma.invoice.aggregate({
      where: {
        project: { ownerId: userId },
        status: InvoiceStatus.PAID,
        paidAt: { gte: monthStart, lte: monthEnd },
      },
      _sum: { amount: true },
    }),

    // 2. Active projects (not archived, not terminal status)
    prisma.project.count({
      where: {
        ownerId: userId,
        isArchived: false,
        status: { notIn: ["COMPLETED", "CANCELLED"] },
      },
    }),

    // 3. Pending invoices (SENT = awaiting payment)
    prisma.invoice.count({
      where: {
        project: { ownerId: userId },
        status: InvoiceStatus.SENT,
        deletedAt: null,
      },
    }),

    // 4. Overdue invoices
    prisma.invoice.count({
      where: {
        project: { ownerId: userId },
        status: InvoiceStatus.OVERDUE,
        deletedAt: null,
      },
    }),

    // 5. Estimated billable hours — sum of Task.estimatedHours (future time-tracking hook)
    prisma.task.aggregate({
      where: {
        project: { ownerId: userId },
        deletedAt: null,
        estimatedHours: { not: null },
      },
      _sum: { estimatedHours: true },
    }),

    // 6. Paid invoices in the last 12 months for the revenue chart
    prisma.invoice.findMany({
      where: {
        project: { ownerId: userId },
        status: InvoiceStatus.PAID,
        paidAt: { gte: chartWindowStart, not: null },
        deletedAt: null,
      },
      select: { paidAt: true, amount: true },
    }),

    // 7. Task deadlines — future due dates, not soft-deleted, soonest first
    prisma.task.findMany({
      where: {
        project: { ownerId: userId },
        deletedAt: null,
        dueDate: { gte: now },
      },
      select: {
        id: true,
        title: true,
        dueDate: true,
        project: { select: { customerName: true } },
      },
      orderBy: { dueDate: "asc" },
      take: 6,
    }),

    // 8. Project deadlines — future due dates, not archived, soonest first
    prisma.project.findMany({
      where: {
        ownerId: userId,
        isArchived: false,
        dueDate: { gte: now },
      },
      select: {
        id: true,
        title: true,
        dueDate: true,
        customerName: true,
      },
      orderBy: { dueDate: "asc" },
      take: 6,
    }),

    // 9. Recent activity via Notification model (newest first)
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        title: true,
        message: true,
        event: true,
        link: true,
        createdAt: true,
      },
    }),

    // 10. Recent invoices with project client name
    prisma.invoice.findMany({
      where: {
        project: { ownerId: userId },
        deletedAt: null,
      },
      select: {
        id: true,
        invoiceNumber: true,
        amount: true,
        status: true,
        dueDate: true,
        project: { select: { customerName: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  // ── Build revenue chart (last 12 months, pre-filled with 0) ─────────────────
  // Build an ordered map: "year-monthIndex" → revenue
  const revenueByKey = new Map<string, number>();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    revenueByKey.set(`${d.getFullYear()}-${d.getMonth()}`, 0);
  }
  for (const inv of paidInvoicesForChart) {
    if (!inv.paidAt) continue;
    const key = `${inv.paidAt.getFullYear()}-${inv.paidAt.getMonth()}`;
    if (revenueByKey.has(key)) {
      revenueByKey.set(key, (revenueByKey.get(key) ?? 0) + Number(inv.amount));
    }
  }
  const revenueChart: RevenueChartPoint[] = Array.from(revenueByKey.entries()).map(
    ([key, revenue]) => {
      const monthIndex = Number(key.split("-")[1]);
      return { month: MONTH_LABELS[monthIndex], revenue };
    },
  );

  // ── Merge & sort task + project deadlines, take 6 ───────────────────────────
  const deadlines: DeadlineItem[] = [
    ...taskDeadlines
      .filter((t) => t.dueDate !== null)
      .map((t) => ({
        id: t.id,
        title: t.title,
        company: t.project.customerName,
        dueDate: t.dueDate as Date,
        type: "task" as const,
      })),
    ...projectDeadlines
      .filter((p) => p.dueDate !== null)
      .map((p) => ({
        id: p.id,
        title: p.title,
        company: p.customerName,
        dueDate: p.dueDate as Date,
        type: "project" as const,
      })),
  ]
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .slice(0, 6);

  // ── Assemble output ──────────────────────────────────────────────────────────
  const stats: DashboardStats = {
    revenueThisMonth: Number(revenueThisMonthAgg._sum.amount ?? 0),
    activeProjectsCount,
    pendingInvoicesCount,
    overdueInvoicesCount,
    billableHoursEstimated: billableHoursAgg._sum.estimatedHours ?? 0,
  };

  const recentInvoices: RecentInvoiceItem[] = recentInvoicesRaw.map((inv) => ({
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    customerName: inv.project.customerName,
    amount: Number(inv.amount),
    status: inv.status,
    dueDate: inv.dueDate,
  }));

  return success<DashboardData>({
    stats,
    revenueChart,
    deadlines,
    activities,
    recentInvoices,
  });
}
