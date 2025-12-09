import { z } from "zod";

export const emailSchema = z.email("Invalid email address").toLowerCase();

export const passwordSchema = z
  .string()
  .min(8, "Password must contain 8 or more characters")
  .max(72, "Password must contain less than 72 characters");

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must contain 2 or more characters")
    .max(50, "Name must contain less than 50 characters"),

  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const verifyEmailSchema = z.object({
  token: z.string().trim().min(1, "Invalid token"),
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(1, "Invalid token"),
  password: passwordSchema,
});
