import * as z from "zod";

const emailSchema = z.email({ error: "Invalid email format" });

const passwordSchema = z
  .string()
  .min(6, { error: "Password must be at least 6 characters long" })
  .max(64, { error: "Password must be at most 64 characters long" });
// .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-\[\]])/, {
//   error:
//     "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
// });

const signUpSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Name must be at least 2 characters long" })
    .max(50, { error: "Name must be less than 50 characters" }),

  email: emailSchema,
  password: passwordSchema,
});

const signInSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters long" })
    .max(64, { error: "Password must be less than 64 characters" }),
});

const verifyEmailSchema = z.object({
  token: z.string().trim().min(1, "Token is required"),
  otp: z.string().regex(/^\d{6}$/, "OTP must be a 6-digit number"),
});

const resetPassword = z.object({
  token: z.string().min(1, "Token is required"),
  password: passwordSchema,
});

export const validateEmail = (data: unknown) => emailSchema.safeParse(data);

export const validateSignUp = (data: unknown) => signUpSchema.safeParse(data);

export const validateSignIn = (data: unknown) => signInSchema.safeParse(data);

export const validateVerifyEmail = (data: unknown) =>
  verifyEmailSchema.safeParse(data);

export const validateResetPassword = (data: unknown) =>
  resetPassword.safeParse(data);
