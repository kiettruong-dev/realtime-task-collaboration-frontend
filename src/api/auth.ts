import type { LoginRequest } from "@/types";
import { api } from "./axios";
import { API_URL } from "./url";

export const apiAuth = {
  login: async (data: LoginRequest) => {
    const response = await api.post(API_URL.LOGIN, data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get(API_URL.PROFILE);
    return response.data;
  },
};
