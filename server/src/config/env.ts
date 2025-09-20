import "dotenv/config";
import * as z from "zod";

const envSchema = z.object({
  PORT: z.coerce.number<number>(),
  DATABASE_URL: z.url(),
  NODE_ENV: z.enum(["development", "production"], {
    error: (issue) => `NODE ENV must be ${issue.values.join(" | ")}`,
  }),
  APP_ORIGIN: z.url(),
  TOKEN_EXPIRY_IN_MINUTES: z.coerce.number<number>(),
  MAILTRAP_API_TOKEN: z.string().nonempty(),
  MAILTRAP_SENDER_EMAIL: z.email(),

  ACCESS_TOKEN_SECRET: z.string().nonempty(),
  ACCESS_TOKEN_EXPIRY: z.string().nonempty(),

  REFRESH_TOKEN_SECRET: z.string().nonempty(),
  REFRESH_TOKEN_EXPIRY: z.string().nonempty(),

  GOOGLE_CLIENT_ID: z.string().nonempty(),
  GOOGLE_CLIENT_SECRET: z.string().nonempty(),

  REDIRECT_URI: z.url(),

  GITHUB_CLIENT_ID: z.string().nonempty(),
  GITHUB_CLIENT_SECRET: z.string().nonempty(),

  CLOUDINARY_CLOUD_NAME: z.string().nonempty(),
  CLOUDINARY_API_KEY: z.string().nonempty(),
  CLOUDINARY_API_SECRET: z.string().nonempty(),
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
