import { api } from "@/lib/axios";
import type { ApiResponse, User } from "@/types";

export const fetchUser = async () => {
  const res = await api.get<ApiResponse<User>>("/auth/me");
  return res.data.data;
};
