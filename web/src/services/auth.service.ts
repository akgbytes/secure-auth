import { api } from "@/lib/axios";
import type { ApiResponse, User } from "@/types";

type SignUpBody = {
  email: string;
  password: string;
  name: string;
};

export const signup = async (body: SignUpBody) => {
  const response = await api.post<ApiResponse<User>>("/auth/register", body);
  return response.data.data;
};
