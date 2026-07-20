import { Clock, DollarSign, FolderKanban, Receipt } from "lucide-react";
import StatCard from "./StatCard";
import type { DashboardStats } from "@/lib/actions/get-dashboard-data";
import type { StatItem } from "@/lib/mock-data";

type StatsOverviewProps = {
  /** Real stats from getDashboardData(). Null while loading or on error. */
  stats: DashboardStats | null;
};

function buildStats(stats: DashboardStats | null): StatItem[] {
  const revenue = stats?.revenueThisMonth ?? 0;
  const projects = stats?.activeProjectsCount ?? 0;
  const pending = stats?.pendingInvoicesCount ?? 0;
  const overdue = stats?.overdueInvoicesCount ?? 0;
  const hours = stats?.billableHoursEstimated ?? 0;

  return [
    {
      title: "Revenue",
      value: `$${revenue.toLocaleString()}`,
      description: "Earned this month",
      change: revenue > 0 ? `$${revenue.toLocaleString()}` : undefined,
      trend: revenue > 0 ? "up" : "neutral",
      icon: DollarSign,
      gradient: "var(--gradient-card-emerald)",
    },
    {
      title: "Projects",
      value: String(projects),
      description: "Active engagements",
      change: projects > 0 ? `${projects} active` : undefined,
      trend: projects > 0 ? "up" : "neutral",
      icon: FolderKanban,
      gradient: "var(--gradient-card-violet)",
    },
    {
      title: "Pending Invoices",
      value: String(pending),
      description: "Awaiting payment",
      change: overdue > 0 ? `${overdue} overdue` : pending > 0 ? "Awaiting" : undefined,
      trend: overdue > 0 ? "down" : "neutral",
      icon: Receipt,
      gradient: "var(--gradient-card-amber)",
    },
    {
      title: "Billable Hours",
      value: hours > 0 ? `${hours}h` : "0h",
      description: "Estimated across tasks",
      change: hours > 0 ? `${hours}h estimated` : undefined,
      trend: hours > 0 ? "up" : "neutral",
      icon: Clock,
      gradient: "var(--gradient-card-blue)",
    },
  ];
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const items = buildStats(stats);

  return (
    <section
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      aria-label="Statistics overview"
    >
      {items.map((item, index) => (
        <StatCard key={item.title} {...item} index={index} />
      ))}
    </section>
  );
}
