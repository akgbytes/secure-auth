import * as z from "zod";

const emailSchema = z.email({ error: "Invalid email address" }).toLowerCase();

const passwordSchema = z
  .string()
  .min(6, { error: "Password must be at least 6 characters" })
  .max(64, { error: "Password must be at most 64 characters" });

const registerSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Name must be at least 2 characters" })
    .max(50, { error: "Name must be less than 50 characters" }),

  email: emailSchema,
  password: passwordSchema,
});

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const verifyEmailSchema = z.object({
  token: z.string().trim().min(1, "Token is required"),
});

export const validateRegister = (data: unknown) =>
  registerSchema.safeParse(data);

export const validateLogin = (data: unknown) => loginSchema.safeParse(data);

export const validateVerifyEmail = (data: unknown) =>
  verifyEmailSchema.safeParse(data);
