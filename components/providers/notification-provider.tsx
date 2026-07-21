"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useSocket } from "./socket-provider";
import { getNotifications } from "@/lib/actions/notification/get-notifications";
import { markNotificationRead, markAllNotificationsRead } from "@/lib/actions/notification/mark-notification-read";
import { toast } from "sonner";
import { NotificationEvent, NotificationType } from "@prisma/client";

export type ClientNotification = {
  id: string;
  title: string;
  message: string;
  link: string | null;
  type: NotificationType;
  event: NotificationEvent;
  projectId: string | null;
  isRead: boolean;
  isHandled: boolean;
  handledAt: Date | string | null;
  createdAt: Date | string;
};

type NotificationContextType = {
  notifications: ClientNotification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  markAsHandled: (id: string, status?: string) => void;
  isLoading: boolean;
};

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  markAsHandled: () => {},
  isLoading: true,
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { socket, isConnected } = useSocket();
  const [notifications, setNotifications] = useState<ClientNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await getNotifications();
      if (res.success && res.data) {
        setNotifications(res.data as any[]);
      }
      setIsLoading(false);
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewNotification = (notification: ClientNotification) => {
      setNotifications((prev) => {
        // Deduplicate
        if (prev.some((n) => n.id === notification.id)) {
          return prev;
        }

        // Play sound or just show toast
        toast(notification.title, {
          description: notification.message,
          action: notification.link ? {
            label: "View",
            onClick: () => window.location.href = notification.link!,
          } : undefined,
        });

        return [notification, ...prev];
      });
    };

    socket.on("new_notification", handleNewNotification);

    return () => {
      socket.off("new_notification", handleNewNotification);
    };
  }, [socket, isConnected]);

  const markAsRead = async (id: string) => {
    // Only process if it's currently unread
    const notif = notifications.find(n => n.id === id);
    if (notif && !notif.isRead) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      await markNotificationRead(id);
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await markAllNotificationsRead();
  };

  const markAsHandled = (id: string, status?: string) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        
        let type = n.type;
        let title = n.title;
        let message = n.message;
        
        if (status === "ACCEPT") {
          type = "SUCCESS";
          title = "🎉 Invitation Accepted";
        } else if (status === "DECLINE") {
          type = "WARNING";
          title = "😔 Invitation Declined";
        }
        
        return { 
          ...n, 
          isHandled: true, 
          handledAt: new Date(),
          type,
          title,
          message
        };
      })
    );
  };

  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, markAsHandled, isLoading }}>
      {children}
    </NotificationContext.Provider>
  );
};
