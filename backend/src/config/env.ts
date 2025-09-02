import { logger } from "@/utils/logger";
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
    .nonempty({ error: "Mailtrap token must not be empty" }),
  MAILTRAP_SENDER_EMAIL: z.email({
    error: "Mailtrap sender mail must be a valid email",
  }),
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
