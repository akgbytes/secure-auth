import { env } from "@/config/env";
import { logger } from "@/config/logger";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";

export const db = drizzle(env.DATABASE_URL);

export const connectDrizzle = async () => {
  try {
    await db.execute(sql`SELECT 1`);
    logger.info("Drizzle connected to the database");
  } catch (error: any) {
    logger.error("Drizzle failed to connect to the database");
    process.exit(1);
  }
};
