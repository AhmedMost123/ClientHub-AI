import { requireClient } from "@/lib/auth/authorization";
import { getClientDashboardData } from "@/lib/actions/get-client-dashboard-data";
import { auth } from "@/auth";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ClientStats } from "@/components/client/ClientStats";
import { ClientProjects } from "@/components/client/ClientProjects";
import { ClientFiles } from "@/components/client/ClientFiles";
import { ClientInvoices } from "@/components/client/ClientInvoices";
import { ClientMessages } from "@/components/client/ClientMessages";

export default async function ClientPortalPage() {
  await requireClient();
  const session = await auth();

  const result = await getClientDashboardData();
  const data = result.success ? result.data : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {session?.user?.name}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Track your projects and stay updated.
          </p>
        </div>
        <Button
          variant="outline"
          className="h-12 gap-2 rounded-xl"
        >
          <Download className="size-4" />
          Download Files
        </Button>
      </div>

      {/* Statistics */}
      <ClientStats stats={data?.stats ?? null} />

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Projects */}
        <div className="lg:col-span-2">
          <ClientProjects projects={data?.projects ?? null} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <ClientFiles files={data?.recentFiles ?? null} />
          <ClientInvoices
            invoice={data?.latestUnpaidInvoice ?? null}
            totalCount={data?.unpaidInvoicesCount ?? 0}
          />
          <ClientMessages messages={data?.recentMessages ?? null} />
        </div>
      </div>
    </div>
  );
}
