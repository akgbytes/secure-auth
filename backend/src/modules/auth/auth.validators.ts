import * as z from "zod";

export const emailSchema = z
  .email("Invalid email format")
  .max(100, "Email must be less than 100 characters");

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(64, { message: "Password must be at most 64 characters long" })
  .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-\[\]])/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
  });

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be less than 50 characters"),

  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password must be less than 64 characters"),
});

export const validateEmail = (data: unknown) => emailSchema.safeParse(data);

export const validatePassword = (data: unknown) =>
  passwordSchema.safeParse(data);

export const validateRegister = (data: unknown) =>
  registerSchema.safeParse(data);

export const validateLogin = (data: unknown) => loginSchema.safeParse(data);
