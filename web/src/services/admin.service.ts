import { api } from "@/lib/axios";
import type { ApiResponse, Session, User } from "@/types";

export const fetchUsers = async () => {
  const res = await api.get<ApiResponse<User[]>>("/admin/users");
  return res.data.data;
};

export const fetchUserSessionsById = async (userId: string) => {
  const res = await api.get<ApiResponse<Array<Session>>>(
    `/admin/users/${userId}/sessions`
  );
  return res.data.data;
};
