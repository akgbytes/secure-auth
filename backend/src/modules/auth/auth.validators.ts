import * as z from "zod";

export const emailSchema = z
  .email("Invalid email format")
  .max(100, "Email must be less than 100 characters");

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be less than 50 characters"),

  email: emailSchema,

  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(128, "Password must be less than 128 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

export const loginSchema = z.object({
  email: emailSchema,

  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(128, "Password must be less than 128 characters"),
});

export const validateEmail = (data: unknown) => emailSchema.safeParse(data);

export const validateRegister = (data: unknown) =>
  registerSchema.safeParse(data);

export const validateLogin = (data: unknown) => loginSchema.safeParse(data);
