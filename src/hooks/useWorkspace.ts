import { useEffect, useState } from "react";
import {
  useQuery,
  keepPreviousData,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import { apiWorkspace } from "@/api";
import { KEY_QUERY, PAGE, PAGE_SIZE } from "@/constants";
import { message } from "antd";
import { getSocket } from "@/socket/socket";

export const useWorkspaces = () => {
  const [params, setParams] = useState({
    page: PAGE,
    pageSize: PAGE_SIZE,
  });

  const listWorkspaces = useQuery({
    queryKey: [KEY_QUERY.LIST_WORKSPACES, params],
    queryFn: async () => {
      const res = await apiWorkspace.getWorkspaces(params);
      return res;
    },
    placeholderData: keepPreviousData,
  });

  return {
    ...listWorkspaces,
    params,
    setParams,
  };
};
export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string }) =>
      apiWorkspace.createWorkspace(data.name),

    onSuccess: () => {
      message.success("Thêm workspace thành công");
      queryClient.invalidateQueries({ queryKey: [KEY_QUERY.LIST_WORKSPACES] });
    },

    onError: () => {
      message.error("Thêm workspace thất bại, vui lòng thử lại sau!");
    },
  });
};
export const useInviteWorkspace = (workspaceId: string) => {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      apiWorkspace.inviteToWorkspace(workspaceId, data.email),

    onSuccess: () => {
      message.success(`Mời thành viên vào workspace thành công`);
    },

    onError: (err: any) => {
      message.error(
        err?.response?.data?.message ||
          "Mời thành viên thất bại, vui lòng thử lại sau!",
      );
    },
  });
};

export const useWorkspaceSocket = (
  params: any,
  onInvited: (workspace: any) => void,
) => {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("workspace_invited", onInvited);

    return () => {
      socket.off("workspace_invited", onInvited);
    };
  }, [params]);
};
