import axios, { AxiosError } from "axios";
import { getAccessToken, removeAccessToken } from "@/utils/token";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      removeAccessToken();
      location.reload();
    }
    return Promise.reject(err);
  },
);
