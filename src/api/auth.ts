import type { LoginRequest, RegisterRequest } from "@/types";
import { api } from "./axios";
import { API_URL } from "./url";

export const apiAuth = {
  login: async (data: LoginRequest) => {
    const response = await api.post(API_URL.LOGIN, data);
    return response.data;
  },

  register: async (data: RegisterRequest) => {
    const response = await api.post(API_URL.REGISTER, data);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get(API_URL.PROFILE);
    return response.data;
  },
};
