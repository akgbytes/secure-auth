import { logger } from "@/core/logger";
import * as z from "zod";
import "dotenv/config";

const envSchema = z.object({
  PORT: z.coerce.number<number>({ error: "PORT must be a valid number" }),
  DATABASE_URL: z.url({ error: "DATABASE URL must be a valid URL" }),
  NODE_ENV: z.enum(["development", "production"], {
    error: (issue) => `NODE ENV must be ${issue.values.join(" | ")}`,
  }),
  APP_ORIGIN: z.url({ error: "APP ORIGIN must be a valid URL" }),

  REDIS_HOST: z.string({}),
  REDIS_PORT: z.coerce.number<number>({
    error: "Redis PORT must be a valid number",
  }),

  MAILTRAP_API_TOKEN: z
    .string()
    .nonempty({ error: "Mailtrap Token must not be empty" }),
  MAILTRAP_SENDER_EMAIL: z.email({
    error: "Mailtrap Sender mail must be a valid email",
  }),

  ACCESS_TOKEN_SECRET: z
    .string()
    .nonempty({ error: "Access Token Secret must not be empty" }),
  ACCESS_TOKEN_EXPIRY: z
    .string()
    .nonempty({ error: "Access Token Expiry must not be empty" }),

  REFRESH_TOKEN_SECRET: z
    .string()
    .nonempty({ error: "Refresh Token Secret must not be empty" }),
  REFRESH_TOKEN_EXPIRY: z
    .string()
    .nonempty({ error: "Refresh Token Expiry must not be empty" }),

  VERIFICATION_TOKEN_EXPIRY_MINUTES: z.coerce.number<number>({
    error: "Verification Token Expiry must be a valid number",
  }),

  MAX_SESSIONS: z.coerce.number<number>({
    error: "Max Sessions must be a valid number",
  }),

  GOOGLE_CLIENT_ID: z
    .string()
    .nonempty({ error: "Google Client ID must not be empty" }),
  GOOGLE_CLIENT_SECRET: z
    .string()
    .nonempty({ error: "Google Client Secret must not be empty" }),
});

const createEnv = (env: NodeJS.ProcessEnv) => {
  const validationResult = envSchema.safeParse(env);

  if (!validationResult.success) {
    const messages = validationResult.error.issues
      .map((err) => `- ${err.message}`)
      .join("\n");

    logger.error(
      `Environment variable validation failed for following fields: \n${messages}`
    );
    process.exit(1);
  }

  return validationResult.data;
};

export const env = createEnv(process.env);
