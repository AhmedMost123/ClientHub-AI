"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { io as ClientIO, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  // Track whether we've already logged a connection error so we don't spam
  const hasLoggedError = useRef(false);

  useEffect(() => {
    // Only connect once the user is authenticated. On login/register pages
    // (or during initial session load) status will be "loading" or
    // "unauthenticated" — bail out to avoid hitting the auth middleware with
    // no JWT, which produces the "server error" on the client.
    if (status !== "authenticated") {
      return;
    }

    let socketInstance: Socket | null = null;
    let cancelled = false;

    const connect = async () => {
      try {
        // Initialize the Socket.io server first. The server-side io instance
        // is created lazily inside the Pages API handler and only exists after
        // this endpoint has been fetched at least once. Without this fetch,
        // the client handshake hits an uninitialized HTTP server → "server error".
        await fetch("/api/socket/io");
      } catch {
        // If the fetch itself fails (e.g. dev server starting up) the socket
        // connection will fail gracefully — no need to surface this.
      }

      if (cancelled) return;

      socketInstance = ClientIO({
        path: "/api/socket/io",
        addTrailingSlash: false,
        // Limit reconnection attempts so we don't spam the console forever.
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
        reconnectionDelayMax: 10000,
      });

      socketInstance.on("connect", () => {
        hasLoggedError.current = false;
        setIsConnected(true);
      });

      socketInstance.on("disconnect", () => {
        setIsConnected(false);
      });

      socketInstance.on("connect_error", (err) => {
        // Log once per connection lifecycle so we don't flood the console.
        if (!hasLoggedError.current) {
          console.warn("[Socket] Connection error:", err.message);
          hasLoggedError.current = true;
        }
        setIsConnected(false);
      });

      if (!cancelled) {
        setSocket(socketInstance);
      }
    };

    connect();

    return () => {
      cancelled = true;
      if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
      }
      setSocket(null);
      setIsConnected(false);
    };
  }, [status]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
