import { handleZodError } from "@/utils/core";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resetPasswordSchema,
  emailSchema,
  passwordSchema,
} from "./schema";

export const validateRegister = (data: unknown) =>
  handleZodError(registerSchema.safeParse(data));

export const validateLogin = (data: unknown) =>
  handleZodError(loginSchema.safeParse(data));

export const validateVerifyEmail = (data: unknown) =>
  handleZodError(verifyEmailSchema.safeParse(data));

export const validateResetPassword = (data: unknown) =>
  handleZodError(resetPasswordSchema.safeParse(data));

export const validateEmail = (data: unknown) =>
  handleZodError(emailSchema.safeParse(data));

export const validatePassword = (data: unknown) =>
  handleZodError(passwordSchema.safeParse(data));
