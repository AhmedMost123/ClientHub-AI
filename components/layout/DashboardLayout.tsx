"use client";

import Sidebar from "./sidebar";
import { SidebarProvider, useSidebar } from "./sidebar-provider";
import { cn } from "@/lib/utils";

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { sidebarWidth } = useSidebar();

  return (
    <div className="relative min-h-screen">
      <Sidebar />
      <div
        className={cn(
          "flex min-h-screen flex-col transition-[margin,background-color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          "lg:ml-[var(--sidebar-width)]"
        )}
        style={{ "--sidebar-width": `${sidebarWidth}px` } as React.CSSProperties}
      >
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardShell>{children}</DashboardShell>
    </SidebarProvider>
  );
}
