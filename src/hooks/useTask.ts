import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { apiTask } from "@/api";
import { KEY_QUERY, PAGE, PAGE_SIZE } from "@/constants";
import { useState } from "react";
import type {
  CreateTaskRequest,
  UpdateTaskRequest,
  DeleteTaskRequest,
} from "@/types";
import { message } from "antd";

export const useTasks = (workspaceId: string) => {
  const [params, setParams] = useState({
    page: PAGE,
    pageSize: PAGE_SIZE,
  });
  const listTask = useQuery({
    queryKey: [KEY_QUERY.LIST_TASK, workspaceId, params],
    queryFn: async () => {
      const res = await apiTask.getTasks(workspaceId, params);
      return res.tasks;
    },
    enabled: !!workspaceId,
  });

  return {
    ...listTask,
    params,
    setParams,
  };
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateTaskRequest) => apiTask.createTask(data),
    onSuccess: () => {
      message.success("Thêm task thành công");
      queryClient.invalidateQueries({ queryKey: [KEY_QUERY.LIST_TASK] });
    },
    onError: () => {
      message.error("Thêm task thất bại, vui lòng thử lại sau!");
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      taskId,
      ...data
    }: UpdateTaskRequest & { taskId: string }) =>
      apiTask.updateTask(taskId, data),
    onSuccess: () => {
      message.success("Cập nhật task thành công");
      queryClient.invalidateQueries({ queryKey: [KEY_QUERY.LIST_TASK] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        "Cập nhật task thất bại, vui lòng thử lại sau!";

      if (error?.response?.status === 409) {
        message.error(
          "Task đã được chỉnh sửa bởi người khác. Vui lòng tải lại để cập nhật.",
          5,
        );
      } else if (error?.response?.status === 403) {
        message.error("Bạn không có quyền chỉnh sửa task này");
      } else {
        message.error(errorMessage);
      }
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      taskId,
      ...data
    }: DeleteTaskRequest & { taskId: string }) =>
      apiTask.deleteTask(taskId, data),
    onSuccess: () => {
      message.success("Xóa task thành công");
      queryClient.invalidateQueries({ queryKey: [KEY_QUERY.LIST_TASK] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        "Xóa task thất bại, vui lòng thử lại sau!";
      message.error(errorMessage);
    },
  });
};
