import type { QueryGetWorkspaces } from "@/types";
import { api } from "./axios";
import { API_URL } from "./url";

export const apiWorkspace = {
  getWorkspaces: async (params: QueryGetWorkspaces) => {
    const response = await api.get(API_URL.WORKSPACES, { params });
    return response.data;
  },

  createWorkspace: async (name: string) => {
    const response = await api.post(API_URL.WORKSPACES, { name });
    return response.data;
  },

  inviteToWorkspace: async (workspaceId: string, email: string) => {
    const response = await api.post(
      `${API_URL.INVITE_TO_WORKSPACE}`.replace("{workspaceId}", workspaceId),
      { email },
    );
    return response.data;
  },
};
