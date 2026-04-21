/* eslint-disable no-unsafe-optional-chaining */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

import {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
} from "@/utils/token";
import { connectSocket, disconnectSocket } from "@/socket/socket";
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
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => apiAuth.login(data),

    onSuccess: (res: LoginResponse) => {
      const token = res.accessToken;
      setAccessToken(token);
      connectSocket(token);

      // refetch user
      //   queryClient.invalidateQueries([KEY_QUERY.ACCOUNT]);

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

  return {
    accessToken,
    user: queryMe.data,
    isLoadingUser: queryMe.isLoading,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
  };
};
