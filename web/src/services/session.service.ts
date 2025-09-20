import { api } from "@/lib/axios";
import type { ApiResponse, Session } from "@/types";

export const fetchSessions = async () => {
  const res = await api.get<ApiResponse<Array<Session>>>("/sessions");
  return res.data.data;
};
