import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { getToken } from "next-auth/jwt";
import { realtimeNotificationService } from "@/lib/services/realtime-notification.service";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!res.socket.server.io) {
    console.log("[Socket] Initializing Socket.IO server...");
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    });
    realtimeNotificationService.initialize(io);

    // Authentication middleware
    io.use(async (socket, next) => {
      try {
        const token = await getToken({
          req: socket.request as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          secret: process.env.AUTH_SECRET,
          secureCookie: process.env.NODE_ENV === "production",
        });

        if (!token) {
          return next(new Error("Unauthorized"));
        }

        socket.data.user = token;
        next();
      } catch (error) {
        console.error("[Socket] Auth Error:", error);
        next(new Error("Authentication error"));
      }
    });

    io.on("connection", (socket) => {
      const user = socket.data.user;
      console.log(`[Socket] User connected: ${user?.id} (socket: ${socket.id})`);

      /**
       * Personal notification room
       * Every authenticated user joins his own room.
       */
      if (user?.id) {
        socket.join(`user:${user.id}`);
        console.log(`[Socket] User ${user.id} joined personal room user:${user.id}`);
      }

      /**
       * Chat room
       */
      socket.on("join_conversation", (room: string) => {
        socket.join(room);
        const roomSockets = io.sockets.adapter.rooms.get(room);
        console.log(`[Socket] Socket ${socket.id} (user: ${user?.id}) joined room: "${room}" — total in room: ${roomSockets?.size ?? 0}`);
      });

      /**
       * Live chat messages
       * The sender emits this after DB save. Server relays to all OTHER participants.
       */
      socket.on(
        "send_message",
        (data: { conversationId: string; projectId: string; message: any }) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          console.log(`[Socket] send_message from socket ${socket.id} (user: ${user?.id})`);
          console.log(`[Socket]   → conversationId room: "${data.conversationId}"`);
          console.log(`[Socket]   → projectId room: "${data.projectId}"`);

          if (data.projectId) {
            const room = io.sockets.adapter.rooms.get(data.projectId);
            console.log(`[Socket]   → Sockets in projectId room "${data.projectId}": ${room?.size ?? 0}`);
            // Use io.to (not socket.to) so the sender also receives it —
            // the frontend deduplicates by message ID.
            io.to(data.projectId).emit("new_message", data.message);
          }

          if (data.conversationId) {
            const room = io.sockets.adapter.rooms.get(data.conversationId);
            console.log(`[Socket]   → Sockets in conversationId room "${data.conversationId}": ${room?.size ?? 0}`);
            io.to(data.conversationId).emit("new_message", data.message);
          }
        },
      );

      /**
       * Live notifications
       */
      socket.on(
        "send_notification",
        (data: { userId: string; notification: any }) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          io.to(`user:${data.userId}`).emit(
            "new_notification",
            data.notification,
          );
        },
      );

      socket.on("disconnect", () => {
        console.log(`[Socket] User disconnected: ${user?.id} (socket: ${socket.id})`);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
