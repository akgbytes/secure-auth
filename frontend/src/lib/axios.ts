import type { ApiResponse, Session, User } from "@/types";
import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Interceptors
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      (error.response.data as { message?: string })?.message ===
        "TokenExpiredError"
    ) {
      try {
        await api.post("/auth/refresh");
        return api(originalRequest!);
      } catch (err: any) {
        console.error("error while refreshing:", err.message);
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export const fetchUser = async () => {
  const res = await api.get("/auth/me");
  return res.data.data;
};

export const fetchUsers = async () => {
  const res = await api.get<ApiResponse<Array<User>>>("/admin/users");
  return res.data.data;
};

export const fetchUserSessionById = async (userId: string) => {
  const res = await api.get<ApiResponse<Session>>(`/users/${userId}/sessions`);
  return res.data.data;
};

export const fetchSessions = async () => {
  const res = await api.get<ApiResponse<Array<Session>>>("/sessions");
  return res.data.data;
};

export default api;
