"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Menu, Plus } from "lucide-react";

import { SidebarItem } from "@/components/layout/SidebarItem";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { TooltipProvider } from "@/components/ui/tooltip";
import { APP_USER } from "@/lib/constants";
import {
  bottomNavigation,
  isActiveRoute,
  mainNavigation,
} from "@/lib/navigation";
import { cn } from "@/lib/utils";

import { useSidebar } from "./sidebar-provider";

type SidebarContentProps = {
  collapsed?: boolean;
  onNavigate?: () => void;
};

export function SidebarContent({
  collapsed = false,
  onNavigate,
}: SidebarContentProps) {
  const pathname = usePathname();
  const { toggleCollapsed } = useSidebar();

  return (
    <TooltipProvider delay={0}>
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div
          className={cn(
            "flex items-center gap-3 border-b border-sidebar-border px-5 py-6 transition-all duration-300",
            collapsed && "justify-center px-3 py-5"
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
                {APP_USER.plan}
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

        {/* New Project */}
        <div className={cn("px-4 pt-5", collapsed && "px-2")}>
          <Button
            className={cn(
              "h-10 w-full gap-2 rounded-xl font-medium shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
              collapsed && "size-10 px-0 hover:scale-110"
            )}
            style={{ background: "var(--gradient-brand)" }}
            aria-label="New Project"
          >
            <Plus className="size-4 shrink-0" />
            {!collapsed && "New Project"}
          </Button>
        </div>

        {/* Navigation */}
        <nav
          className="scrollbar-thin flex-1 space-y-1 overflow-y-auto px-3 py-4"
          aria-label="Main navigation"
        >
          {mainNavigation.map((item) => (
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
            {bottomNavigation.map((item) => (
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

          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <ThemeToggle />
            {!collapsed && (
              <span className="text-sm text-muted-foreground">Theme</span>
            )}
          </div>

          <Link
            href="/profile"
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl p-2.5 transition-all duration-200 hover:bg-sidebar-accent hover:translate-x-0.5",
              collapsed && "justify-center hover:translate-x-0"
            )}
            aria-label={`Profile: ${APP_USER.name}`}
          >
            <Avatar className="size-9 ring-2 ring-border/50 transition-all duration-200 hover:ring-sidebar-accent">
              <AvatarFallback
                className="text-xs font-semibold text-white"
                style={{ background: "var(--gradient-brand)" }}
              >
                {APP_USER.initials}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="min-w-0 flex-1 animate-in-slide-right">
                <p className="truncate text-sm font-medium transition-colors duration-200">{APP_USER.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {APP_USER.email}
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

export default function Sidebar() {
  const { collapsed, sidebarWidth, mobileOpen, setMobileOpen } = useSidebar();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="fixed inset-y-0 left-0 z-50 hidden border-r border-sidebar-border bg-sidebar transition-[width,background-color,border-color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] lg:flex lg:flex-col"
        style={{ width: sidebarWidth }}
        aria-label="Sidebar"
      >
        <SidebarContent collapsed={collapsed} />
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
          <SidebarContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
