"use client";

import { Bell, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useSession } from "next-auth/react";

import { SidebarContent } from "@/components/layout/sidebar";
import { useSidebar } from "@/components/layout/sidebar-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn, getInitials } from "@/lib/utils";
import { NotificationBell } from "./NotificationBell";

export default function Header() {
  const { collapsed, mobileOpen, setMobileOpen, toggleCollapsed } =
    useSidebar();
  const { data: session } = useSession();
  const userInitials = getInitials(session?.user?.name ?? "User");

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 flex h-16 items-center justify-between gap-4",
          "border-b border-border/60 px-4 glass-panel-strong sm:px-6 lg:px-8"
        )}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:bg-sidebar-accent"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="size-5 transition-transform duration-200" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:inline-flex hover:bg-sidebar-accent"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-5 transition-transform duration-200" />
            ) : (
              <PanelLeftClose className="size-5 transition-transform duration-200" />
            )}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <NotificationBell />

          <Avatar className="size-8 cursor-pointer ring-2 ring-border/50 transition-all duration-200 hover:ring-sidebar-accent hover:scale-105">
            <AvatarFallback
              className="text-xs font-semibold text-white"
              style={{ background: "var(--gradient-brand)" }}
            >
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          showCloseButton
          className="w-[min(100vw-2rem,280px)] border-sidebar-border bg-sidebar p-0"
        >
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
          <SidebarContent session={session} onNavigate={() => setMobileOpen(false)} />

        </SheetContent>
      </Sheet>
    </>
  );
}
