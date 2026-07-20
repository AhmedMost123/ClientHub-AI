import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { getToken } from "next-auth/jwt";
import { realtimeNotificationService } from "@/lib/services/realtime-notification.service";
import { prisma } from "@/lib/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Verifies that a user (identified by token) is a member of the project
 * associated with the given room ID.
 *
 * Accepts two forms of room ID:
 *  - A projectId directly (joined from Conversation.tsx line 118)
 *  - A conversationId (joined from Conversation.tsx line 120)
 *
 * Returns the projectId string on success, or null if access is denied.
 */
async function verifyRoomAccess(
  roomId: string,
  userId: string,
  role: string,
): Promise<boolean> {
  try {
    // Try as projectId first
    const projectByProjectId = await prisma.project.findUnique({
      where: { id: roomId },
      select: { ownerId: true, linkedClientId: true },
    });

    if (projectByProjectId) {
      if (role === "FREELANCER") {
        return projectByProjectId.ownerId === userId;
      }
      if (role === "CLIENT") {
        return projectByProjectId.linkedClientId === userId;
      }
      return false;
    }

    // Try as conversationId
    const conversation = await prisma.conversation.findUnique({
      where: { id: roomId },
      select: {
        project: { select: { ownerId: true, linkedClientId: true } },
      },
    });

    if (conversation?.project) {
      if (role === "FREELANCER") {
        return conversation.project.ownerId === userId;
      }
      if (role === "CLIENT") {
        return conversation.project.linkedClientId === userId;
      }
    }

    return false;
  } catch {
    // Fail closed — deny access if the DB check itself errors
    return false;
  }
}

const ioHandler = (req: NextApiRequest, res: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!res.socket.server.io) {
    console.log("[Socket] Initializing Socket.IO server...");
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    const io = new ServerIO(httpServer, {
      path,
      addTrailingSlash: false,

      cors: {
        origin:
          process.env.NODE_ENV === "production"
            ? process.env.NEXTAUTH_URL
            : "http://localhost:3000",

        credentials: true,
      },
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
      console.log(
        `[Socket] User connected: ${user?.id} (socket: ${socket.id})`,
      );

      /**
       * Personal notification room
       * Every authenticated user joins his own room.
       */
      if (user?.id) {
        socket.join(`user:${user.id}`);
        console.log(
          `[Socket] User ${user.id} joined personal room user:${user.id}`,
        );
      }

      /**
       * Chat room — with membership guard.
       * The client sends either a projectId or a conversationId.
       * We verify the user is a member before allowing the join.
       */
      socket.on("join_conversation", async (room: string) => {
        if (!user?.id || !user?.role) {
          socket.emit("error", { message: "Unauthorized" });
          return;
        }

        const allowed = await verifyRoomAccess(
          room,
          user.id as string,
          user.role as string,
        );

        if (!allowed) {
          console.warn(
            `[Socket] Access denied: user ${user.id} tried to join room "${room}"`,
          );
          socket.emit("error", { message: "Access denied to this room" });
          return;
        }

        socket.join(room);
        console.log(
          `[Socket] User ${user.id} joined room: "${room}"`,
        );
      });

      /**
       * Live chat messages
       * The sender emits this after DB save. Server relays to all OTHER participants.
       */
      socket.on(
        "send_message",
        (data: { conversationId: string; projectId: string; message: any }) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          console.log(
            `[Socket] send_message from user ${user?.id}`,
          );

          if (data.projectId) {
            io.to(data.projectId).emit("new_message", data.message);
          }

          if (data.conversationId) {
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
        console.log(
          `[Socket] User disconnected: ${user?.id} (socket: ${socket.id})`,
        );
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
