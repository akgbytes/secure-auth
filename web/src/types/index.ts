import { AxiosError } from "axios";

export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

export type ApiError<T = unknown> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
};

export type ApiAxiosError<T = unknown> = AxiosError<ApiError<T>>;

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  avatar: string | null;
  role: "user" | "admin";
  provider: "local" | "google" | "github";
  createdAt: Date;
  updatedAt: Date;
};
