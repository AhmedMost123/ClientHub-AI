import { Server as ServerIO } from "socket.io";
import { Notification } from "@prisma/client";

let io: ServerIO | null = null;

export type RealtimeNotification = Pick<
  Notification,
  | "id"
  | "title"
  | "message"
  | "link"
  | "type"
  | "event"
  | "projectId"
  | "isRead"
  | "createdAt"
>;

export const realtimeNotificationService = {
  initialize(server: ServerIO) {
    io = server;
  },

  send(userId: string, notification: Notification) {
    if (!io) return;

    io.to(`user:${userId}`).emit("new_notification", notification);
  },

  broadcastMessage(projectId: string, conversationId: string | undefined, message: any) {
    if (!io) return;

    // Broadcast to project room to ensure everyone sees it
    io.to(projectId).emit("new_message", message);
    
    // Also broadcast to conversation room for backward compatibility
    if (conversationId) {
      io.to(conversationId).emit("new_message", message);
    }
  },
};
