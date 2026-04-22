import type {
  CreateTaskRequest,
  QueryGetTasks,
  UpdateTaskRequest,
  DeleteTaskRequest,
} from "@/types";
import { api } from "./axios";
import { API_URL } from "./url";

export const apiTask = {
  createTask: async (data: CreateTaskRequest) => {
    const response = await api.post(API_URL.TASKS, data);
    return response.data;
  },
  getTasks: async (workspaceId: string, params: QueryGetTasks) => {
    const response = await api.get(
      API_URL.LIST_TASKS.replace("{workspaceId}", workspaceId),
      {
        params,
      },
    );
    return response.data;
  },
  updateTask: async (taskId: string, data: UpdateTaskRequest) => {
    const response = await api.patch(`${API_URL.TASKS}/${taskId}`, data);
    return response.data;
  },
  deleteTask: async (taskId: string, data: DeleteTaskRequest) => {
    const response = await api.delete(`${API_URL.TASKS}/${taskId}`, {
      data,
    });
    return response.data;
  },
};
