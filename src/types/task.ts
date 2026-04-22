/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { Pagination, PaginationParams } from "./common";

export interface CreateTaskRequest {
  title: string;
  description?: string;
  workspaceId: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: string;
  version: number;
}

export interface DeleteTaskRequest {
  version: number;
}

export interface QueryGetTasks extends PaginationParams {}
export interface Task {
  createdAt?: string;
  createdBy?: string;
  description?: string;
  id?: string;
  status?: string;
  title?: string;
  updatedAt?: string;
  updatedBy?: string;
  version?: number;
  workspaceId?: string;
}

export interface TaskListResponse {
  tasks: Task[];
  pagination: Pagination;
}
