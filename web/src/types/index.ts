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
  avatar: string;
  role: "user" | "admin";
  provider: "local" | "google" | "github";
  createdAt: Date;
  updatedAt: Date;
};

export type Session = {
  id: string;
  device: string; // Desktop - Chrome
  location: string; // Localhost
  ip: string;
  lastLogin: string; // 20/9/2025, 5:56:55 AM
  status: "expired" | "active";
  current: boolean;
};
