"use client";

import { useState } from "react";
import { Bell, Check, Loader2, BellRing } from "lucide-react";
import { formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useNotifications, ClientNotification } from "@/components/providers/notification-provider";
import { cn } from "@/lib/utils";

function groupNotifications(notifications: ClientNotification[]) {
  const today: ClientNotification[] = [];
  const yesterday: ClientNotification[] = [];
  const earlier: ClientNotification[] = [];

  // Limit to latest 15 for the dropdown
  const limited = notifications.slice(0, 15);

  limited.forEach((n) => {
    const date = new Date(n.createdAt);
    if (isToday(date)) {
      today.push(n);
    } else if (isYesterday(date)) {
      yesterday.push(n);
    } else {
      earlier.push(n);
    }
  });

  return { today, yesterday, earlier };
}

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleNotificationClick = async (e: React.MouseEvent, n: ClientNotification) => {
    e.preventDefault();
    if (!n.isRead) {
      await markAsRead(n.id);
    }
    setIsOpen(false);
    if (n.link) {
      router.push(n.link);
    }
  };

  const { today, yesterday, earlier } = groupNotifications(notifications);
  const hasNotifications = notifications.length > 0;

  const NotificationList = ({ items, label }: { items: ClientNotification[]; label: string }) => {
    if (items.length === 0) return null;
    return (
      <div className="py-2">
        <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-4 mb-2">
          {label}
        </DropdownMenuLabel>
        <div className="flex flex-col">
          {items.map((n) => (
            <DropdownMenuItem
              key={n.id}
              onClick={(e) => handleNotificationClick(e as any, n)}
              className={cn(
                "flex items-start gap-3 px-4 py-3 cursor-pointer focus:bg-sidebar-accent transition-all relative overflow-hidden",
                !n.isRead && "bg-white/5"
              )}
            >
              {!n.isRead && (
                <motion.div
                  layoutId={`unread-indicator-${n.id}`}
                  className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 rounded-r-full"
                />
              )}
              <div className="flex-1 space-y-1">
                <p className={cn("text-sm leading-tight", !n.isRead ? "font-medium text-white" : "text-white/80")}>
                  {n.title}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {n.message}
                </p>
                <p className="text-[10px] text-muted-foreground/70 mt-1 font-medium">
                  {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                </p>
              </div>
              {!n.isRead && (
                <div className="mt-1 size-2 rounded-full bg-purple-500 shrink-0" />
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </div>
    );
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative text-muted-foreground hover:bg-sidebar-accent transition-all duration-200"
        >
          <Bell className="size-5 transition-transform duration-200 hover:scale-110" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute right-[6px] top-[6px] flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white ring-2 ring-background pointer-events-none"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[360px] p-0 rounded-2xl border border-white/10 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">Notifications</span>
            {unreadCount > 0 && (
              <span className="bg-purple-500/20 text-purple-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={async (e) => {
                e.preventDefault();
                await markAllAsRead();
              }}
              className="h-8 text-xs text-muted-foreground hover:text-white"
            >
              <Check className="mr-1 size-3" />
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
            </div>
          ) : !hasNotifications ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                <BellRing className="size-6 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium text-white/80">No notifications yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                You'll see updates here when something happens.
              </p>
            </div>
          ) : (
            <>
              <NotificationList items={today} label="Today" />
              {today.length > 0 && yesterday.length > 0 && <DropdownMenuSeparator className="bg-white/5" />}
              <NotificationList items={yesterday} label="Yesterday" />
              {(today.length > 0 || yesterday.length > 0) && earlier.length > 0 && <DropdownMenuSeparator className="bg-white/5" />}
              <NotificationList items={earlier} label="Earlier" />
            </>
          )}
        </div>

        <div className="p-2 border-t border-white/5 bg-white/5">
          <Link href="/notifications" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-white justify-center h-8">
              View all notifications
            </Button>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
