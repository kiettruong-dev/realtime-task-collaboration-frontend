import { io } from "socket.io-client";

let socket: any;

export const connectSocket = (token: string) => {
  socket = io("http://localhost:3000", {
    auth: { token },
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};
