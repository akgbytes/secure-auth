import { AxiosError } from "axios";

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface ApiError<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
}

export type ApiAxiosError<T = unknown> = AxiosError<ApiError<T>>;

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  avatar: string | null;
  role: "user" | "admin";
  provider: "local" | "github" | "google";
}

export type RegisterResponse = ApiResponse<{
  user: User;
  token: string;
}>;

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type VerifyEmailInput = {
  token: string;
  otp: string;
};
