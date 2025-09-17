import "dotenv/config";
import * as z from "zod";

const envSchema = z.object({
  PORT: z.coerce.number<number>(),
  DATABASE_URL: z.url(),
  NODE_ENV: z.enum(["development", "production"], {
    error: (issue) => `NODE ENV must be ${issue.values.join(" | ")}`,
  }),
  APP_ORIGIN: z.url(),
});

const createEnv = (env: NodeJS.ProcessEnv) => {
  const result = envSchema.safeParse(env);

  if (!result.success) {
    console.log("Failed to validate env:\n", result.error);
    process.exit(1);
  }

  return result.data;
};

export const env = createEnv(process.env);
