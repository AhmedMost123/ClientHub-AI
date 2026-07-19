"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Menu, Plus } from "lucide-react";
import { Session } from "next-auth"; // Import Session type

import { SidebarItem } from "@/components/layout/SidebarItem";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { TooltipProvider } from "@/components/ui/tooltip";

import {
  clientBottomNavigation,
  clientMainNavigation,
  freelancerBottomNavigation,
  freelancerMainNavigation,
  isActiveRoute,
} from "@/lib/navigation";
import { cn, getInitials } from "@/lib/utils";

import { useSidebar } from "./sidebar-provider";

type SidebarContentProps = {
  session: Session | null; // Accept server session
  collapsed?: boolean;
  onNavigate?: () => void;
};

export function SidebarContent({
  session,
  collapsed = false,
  onNavigate,
}: SidebarContentProps) {
  const pathname = usePathname();
  const { toggleCollapsed } = useSidebar();

  // REMOVED: useSession() is gone. No more "loading" state flickering!
  if (!session) {
    return null;
  }

  const userName = session.user.name ?? "User";
  const userEmail = session.user.email ?? "";
  const userInitials = getInitials(userName);
  const roleLabel =
    session.user.role === "ADMIN"
      ? "Admin"
      : session.user.role === "CLIENT"
        ? "Client"
        : "Freelancer";

  const userRole = session.user.role;
  const navigation =
    userRole === "CLIENT" ? clientMainNavigation : freelancerMainNavigation;

  const bottomNav =
    userRole === "CLIENT" ? clientBottomNavigation : freelancerBottomNavigation;

  return (
    <TooltipProvider delay={0}>
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div
          className={cn(
            "flex items-center gap-3 border-b border-sidebar-border px-5 py-6 transition-all duration-300",
            collapsed && "justify-center px-3 py-5",
          )}
        >
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-lg transition-transform duration-200 hover:scale-105"
            style={{ background: "var(--gradient-brand)" }}
            aria-hidden
          >
            C
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1 animate-in-slide-right">
              <p className="truncate text-sm font-semibold tracking-tight text-foreground">
                ClientHub AI
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {roleLabel}
              </p>
            </div>
          )}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleCollapsed}
              aria-label="Collapse sidebar"
              className="shrink-0 text-muted-foreground hover:bg-sidebar-accent"
            >
              <ChevronLeft className="size-4 transition-transform duration-200" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav
          className="scrollbar-thin flex-1 space-y-1 overflow-y-auto px-3 py-4"
          aria-label="Main navigation"
        >
          {navigation.map((item) => (
            <SidebarItem
              key={item.href}
              {...item}
              isActive={isActiveRoute(pathname, item.href)}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </nav>

        {/* Bottom section */}
        <div className="mt-auto space-y-3 px-3 pb-5">
          <nav className="space-y-1" aria-label="Secondary navigation">
            {bottomNav.map((item) => (
              <SidebarItem
                key={item.href}
                {...item}
                isActive={isActiveRoute(pathname, item.href)}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ))}
          </nav>

          <Separator className="bg-sidebar-border" />

          <div
            className={cn(
              "flex items-center gap-3",
              collapsed && "justify-center",
            )}
          >
            <ThemeToggle />
            {!collapsed && (
              <span className="text-sm text-muted-foreground">Theme</span>
            )}
          </div>

          <Link
            href="/settings"
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl p-2.5 transition-all duration-200 hover:bg-sidebar-accent hover:translate-x-0.5",
              collapsed && "justify-center hover:translate-x-0",
            )}
            aria-label={`Profile: ${userName}`}
          >
            <Avatar className="size-9 ring-2 ring-border/50 transition-all duration-200 hover:ring-sidebar-accent">
              <AvatarFallback
                className="text-xs font-semibold text-white"
                style={{ background: "var(--gradient-brand)" }}
              >
                {userInitials}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="min-w-0 flex-1 animate-in-slide-right">
                <p className="truncate text-sm font-medium transition-colors duration-200">
                  {userName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {userEmail}
                </p>
              </div>
            )}
          </Link>

          {collapsed && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleCollapsed}
              aria-label="Expand sidebar"
              className="mx-auto w-full text-muted-foreground hover:bg-sidebar-accent"
            >
              <ChevronLeft className="size-4 rotate-180 transition-transform duration-200" />
            </Button>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

interface SidebarProps {
  session: Session | null;
}

export default function Sidebar({ session }: SidebarProps) {
  const { collapsed, sidebarWidth, mobileOpen, setMobileOpen } = useSidebar();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="fixed inset-y-0 left-0 z-50 hidden border-r border-sidebar-border bg-sidebar transition-[width,background-color,border-color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] lg:flex lg:flex-col"
        style={{ width: sidebarWidth }}
        aria-label="Sidebar"
      >
        <SidebarContent session={session} collapsed={collapsed} />
      </aside>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden transition-colors duration-200"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu className="size-5 transition-transform duration-200" />
      </Button>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          showCloseButton
          className="w-[min(100vw-2rem,280px)] border-sidebar-border bg-sidebar p-0 transition-colors duration-300"
        >
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
          <SidebarContent
            session={session}
            collapsed={false}
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
