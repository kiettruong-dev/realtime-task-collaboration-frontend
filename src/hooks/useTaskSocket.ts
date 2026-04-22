import { useEffect } from "react";
import { getSocket } from "@/socket/socket";
import { message } from "antd";

export const useTaskSocket = (workspaceId: string, handlers: any) => {
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !workspaceId) return;

    socket.emit("join_workspace", { workspaceId });

    const handleTaskCreated = (data: any) => {
      console.log("Socket: task_created event received", data);
      if (handlers.onCreate) handlers.onCreate(data);
    };

    const handleTaskUpdated = (data: any) => {
      console.log("Socket: task_updated event received", data);
      if (handlers.onUpdate) handlers.onUpdate(data);
    };

    const handleTaskDeleted = (data: any) => {
      console.log("Socket: task_deleted event received", data);
      if (handlers.onDelete) handlers.onDelete(data);
    };

    const handleTaskError = (error: any) => {
      console.error("Socket task error:", error);
      if (error.type === "CONFLICT") {
        message.error(
          `Task conflict: ${error.message}. Tải lại để cập nhật.`,
          5,
        );
        if (handlers.onConflict) handlers.onConflict(error);
      } else if (error.type === "FORBIDDEN") {
        message.error("Bạn không có quyền thực hiện hành động này");
      } else {
        message.error(error.message || "Lỗi xử lý task");
      }
    };

    socket.on("task_created", handleTaskCreated);
    socket.on("task_updated", handleTaskUpdated);
    socket.on("task_deleted", handleTaskDeleted);
    socket.on("task_error", handleTaskError);

    return () => {
      socket.emit("leave_workspace", { workspaceId });

      socket.off("task_created", handleTaskCreated);
      socket.off("task_updated", handleTaskUpdated);
      socket.off("task_deleted", handleTaskDeleted);
      socket.off("task_error", handleTaskError);
    };
  }, [workspaceId, handlers]);
};
