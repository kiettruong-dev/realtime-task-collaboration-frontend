/* eslint-disable no-unsafe-optional-chaining */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

import {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
} from "@/utils/token";
import {
  connectSocket,
  disconnectSocket,
  reconnectSocket,
  getSocket,
} from "@/socket/socket";
import type { LoginRequest, LoginResponse } from "@/types";
import { apiAuth } from "@/api";
import { DEFAULT_ERROR, KEY_QUERY } from "@/constants";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const accessToken = getAccessToken();

  const queryMe = useQuery({
    queryKey: [KEY_QUERY.ACCOUNT],
    enabled: !!accessToken,
    queryFn: async () => {
      const res = await apiAuth.getProfile();
      return res;
    },
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => apiAuth.login(data),

    onSuccess: (res: LoginResponse) => {
      const token = res.accessToken;
      setAccessToken(token);
      connectSocket(token);

      message.success("Đăng nhập thành công");
      navigate("/");
    },

    onError: (err: any) => {
      const { message: messageAxios } = err?.response?.data;
      if (messageAxios === "Unauthorized") {
        message.error("Tài khoản hoặc mật khẩu không hợp lệ!");
      } else {
        message.error(err?.response.data.message || DEFAULT_ERROR);
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => true,

    onSuccess: () => {
      removeAccessToken();
      disconnectSocket();
      queryClient.clear();

      message.success("Logout success");
      navigate("/login");
    },
  });

  const handleTokenExpiration = async () => {
    try {
      removeAccessToken();
      disconnectSocket();

      message.error("Token hết hạn, vui lòng đăng nhập lại");
      navigate("/login");
    } catch (error) {
      console.error("Error handling token expiration:", error);
      navigate("/login");
    }
  };

  const setupSocketAuthErrorHandler = () => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("auth_error", () => {
      console.log("Socket auth error, logging out");
      handleTokenExpiration();
    });
  };

  return {
    accessToken,
    user: queryMe.data,
    isLoadingUser: queryMe.isLoading,
    isAuthError: queryMe.isError,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    handleTokenExpiration,
    setupSocketAuthErrorHandler,
    reconnectSocket: () => {
      if (accessToken) {
        reconnectSocket(accessToken);
      }
    },
  };
};
