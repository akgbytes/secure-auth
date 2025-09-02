import { logger } from "@/utils/logger";
import * as z from "zod";
import { configDotenv } from "dotenv";
configDotenv();

const envSchema = z.object({
  PORT: z.coerce.number<number>({ error: "PORT must be a valid number" }),
  DATABASE_URL: z.url({ error: "DATABASE URL must be a valid URL" }),
  NODE_ENV: z.enum(["development", "production"], {
    error: (issue) => `NODE ENV must be ${issue.values.join(" | ")}`,
  }),
  APP_ORIGIN: z.url({ error: "APP ORIGIN must be a valid URL" }),
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
