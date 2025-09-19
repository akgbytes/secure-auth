import * as z from "zod";

const emailSchema = z.email({ error: "Invalid email address" }).toLowerCase();

const passwordSchema = z
  .string()
  .min(6, { error: "Password must contain 8 or more characters" })
  .max(72, { error: "Password must contain less than 72 characters" });

const registerSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Name must contain 2 or more characters" })
    .max(50, { error: "Password must contain less than 50 characters" }),

  email: emailSchema,
  password: passwordSchema,
});

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const verifyEmailSchema = z.object({
  token: z.string("Invalid token").trim().min(1, "Invalid token"),
});

const resetPasswordSchema = z.object({
  token: z.string("Invalid token").trim().min(1, "Invalid token"),
  password: passwordSchema,
});

export const validateRegister = (data: unknown) =>
  registerSchema.safeParse(data);

export const validateLogin = (data: unknown) => loginSchema.safeParse(data);

export const validateVerifyEmail = (data: unknown) =>
  verifyEmailSchema.safeParse(data);

export const validateResetPassword = (data: unknown) =>
  resetPasswordSchema.safeParse(data);

export const validateEmail = (data: unknown) => emailSchema.safeParse(data);
