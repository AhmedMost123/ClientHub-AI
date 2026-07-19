"use client";

import { Session } from "next-auth";
import Sidebar from "./sidebar";
import { SidebarProvider, useSidebar } from "./sidebar-provider";
import { cn } from "@/lib/utils";

// 1. Accept session in the internal Shell component
function DashboardShell({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  const { sidebarWidth } = useSidebar();

  return (
    <div className="relative min-h-screen">
      {/* 2. Pass the session prop down to the Sidebar to bypass useSession() */}
      <Sidebar session={session} />
      <div
        className={cn(
          "flex min-h-screen flex-col transition-[margin,background-color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          "lg:ml-(--sidebar-width)",
        )}
        style={
          { "--sidebar-width": `${sidebarWidth}px` } as React.CSSProperties
        }
      >
        <main className="flex-1 px-4 py-4 sm:px-5 sm:py-5 lg:px-7 lg:py-6">{children}</main>
      </div>
    </div>
  );
}

// 3. Update the main exported layout to accept the session from the server
export function DashboardLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <SidebarProvider>
      <DashboardShell session={session}>{children}</DashboardShell>
    </SidebarProvider>
  );
}
