import { useEffect } from "react";

interface BroadcastMessage {
  type: "task_created" | "task_updated" | "task_deleted" | "logout";
  data: any;
}

export const useBroadcastChannel = (
  channel: string,
  onMessage: (message: BroadcastMessage) => void,
) => {
  useEffect(() => {
    if (!window.BroadcastChannel) {
      console.warn("BroadcastChannel not supported");
      return;
    }

    const broadcastChannel = new window.BroadcastChannel(channel);

    const handleMessage = (event: MessageEvent<BroadcastMessage>) => {
      console.log("BroadcastChannel message received:", event.data);
      onMessage(event.data);
    };

    broadcastChannel.addEventListener("message", handleMessage);

    return () => {
      broadcastChannel.removeEventListener("message", handleMessage);
      broadcastChannel.close();
    };
  }, [channel, onMessage]);
};

export const sendBroadcastMessage = (
  channel: string,
  message: BroadcastMessage,
) => {
  if (!window.BroadcastChannel) return;

  const bc = new window.BroadcastChannel(channel);
  bc.postMessage(message);
  bc.close();
};
