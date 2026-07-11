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

export default function DashboardPage() {
  return (
    <PageContainer className="space-y-8">
      <DashboardHeader />
      <StatsOverview />

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>
        <Deadlines />
      </section>

      <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <AIWidget />
      </section>

      <ActiveProjects />

      <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <RecentInvoices />
        <TaskProgressWidget />
        <CalendarPreview />
      </section>

      <QuickActions />
    </PageContainer>
  );
}
