"use client";

import { useNotifications } from "@/components/providers/notification-provider";
import { NotificationCard } from "./NotificationCard";
import { Button } from "@/components/ui/button";
import { Check, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function NotificationsList() {
  const { notifications, markAsRead, markAllAsRead, isLoading } = useNotifications();
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-24 bg-muted/50 rounded-2xl" />
      ))}
    </div>;
  }

  const filtered = notifications.filter(n => filter === "ALL" || !n.isRead);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex bg-muted/50 p-1 rounded-lg">
          <button
            onClick={() => setFilter("ALL")}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
              filter === "ALL" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilter("UNREAD")}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
              filter === "UNREAD" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Unread
          </button>
        </div>

        {notifications.some(n => !n.isRead) && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-muted-foreground hover:text-foreground">
            <Check className="size-4 mr-2" />
            Mark all read
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card/50 p-12 flex flex-col items-center justify-center text-center">
          <div className="size-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <CheckCircle2 className="size-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg">You're all caught up!</h3>
          <p className="text-muted-foreground mt-1">No {filter === "UNREAD" ? "unread " : ""}notifications right now.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((notification) => (
            <NotificationCard 
              key={notification.id} 
              notification={notification as any}
              onClick={() => {
                if (!notification.isRead) {
                  markAsRead(notification.id);
                }
              }} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
