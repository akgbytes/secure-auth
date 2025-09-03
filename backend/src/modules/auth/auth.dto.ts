import * as z from "zod";
import { loginSchema, registerSchema } from "./auth.validators";

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema> & {
  userAgent: string;
  ipAddress: string;
};
