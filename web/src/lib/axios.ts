import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

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
        window.location.href = "/signin";
      }
    }

    return Promise.reject(error);
  }
);
