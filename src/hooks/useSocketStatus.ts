import { useEffect, useState } from "react";
import { onSocketStatusChange, isSocketConnected } from "@/socket/socket";

export const useSocketStatus = () => {
  const [isConnected, setIsConnected] = useState(() => isSocketConnected());

  useEffect(() => {
    setIsConnected(isSocketConnected());
    const unsubscribe = onSocketStatusChange(setIsConnected);
    return unsubscribe;
  }, []);

  return isConnected;
};
