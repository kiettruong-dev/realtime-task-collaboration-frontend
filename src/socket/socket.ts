import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

type SocketStatusListener = (connected: boolean) => void;
const statusListeners: SocketStatusListener[] = [];

export const notifyStatusChange = (connected: boolean) => {
  statusListeners.forEach((listener) => listener(connected));
};

export const onSocketStatusChange = (listener: SocketStatusListener) => {
  statusListeners.push(listener);
  return () => {
    const index = statusListeners.indexOf(listener);
    if (index > -1) statusListeners.splice(index, 1);
  };
};

export const connectSocket = (token: string) => {
  if (socket?.connected) {
    console.log("Socket already connected");
    return socket;
  }

  socket = io(import.meta.env.VITE_BASE_URL, {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
  });

  socket.on("connect", () => {
    console.log("Socket connected");
    reconnectAttempts = 0;
    notifyStatusChange(true);
  });

  socket.on("disconnect", (reason: string) => {
    console.log("Socket disconnected:", reason);
    notifyStatusChange(false);
  });

  socket.on("connect_error", (error: any) => {
    console.error("Socket connection error:", error);
    if (error.data?.content?.message === "Authentication error") {
      socket?.disconnect();
      notifyStatusChange(false);
    }
  });

  socket.on("reconnect_attempt", () => {
    reconnectAttempts++;
    console.log(
      `Reconnection attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`,
    );
  });

  socket.on("reconnect_failed", () => {
    console.error("Failed to reconnect after max attempts");
    notifyStatusChange(false);
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const isSocketConnected = (): boolean => socket?.connected ?? false;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const reconnectSocket = (token: string) => {
  disconnectSocket();
  return connectSocket(token);
};
