import { requireFreelancer } from "@/lib/auth/authorization";
import { getDashboardData } from "@/lib/actions/dashboard/get-dashboard-data";
import ActiveProjects from "@/components/dashboard/ActiveProjects";
import { AIWidget } from "@/components/dashboard/AIWidget";
import { CalendarPreview } from "@/components/dashboard/CalendarPreview";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import Deadlines from "@/components/dashboard/Deadlines";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { RecentInvoices } from "@/components/dashboard/RecentInvoices";
import RevenueChart from "@/components/dashboard/RevenueChart";
import StatsOverview from "@/components/dashboard/StatsOverview";
import { TaskProgressWidget } from "@/components/dashboard/TaskProgress";
import { PageContainer } from "@/components/shared/PageContainer";

export default async function DashboardPage() {
  const session = await requireFreelancer();

  // Single parallel fetch for all dashboard data
  const result = await getDashboardData();
  const data = result.success ? result.data : null;

  return (
    <PageContainer className="space-y-8">
      <DashboardHeader userName={session.user.name ?? "Freelancer"} data={data} />
      <StatsOverview stats={data?.stats ?? null} />

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueChart data={data?.revenueChart ?? []} />
        </div>
        <Deadlines deadlines={data?.deadlines ?? []} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity activities={data?.activities ?? []} />
        </div>
        <AIWidget pendingInvoicesCount={data?.stats.pendingInvoicesCount ?? 0} />
      </section>

      <ActiveProjects />

      <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <RecentInvoices invoices={data?.recentInvoices ?? []} />
        <TaskProgressWidget />
        <CalendarPreview />
      </section>

      <QuickActions />
    </PageContainer>
  );
}
