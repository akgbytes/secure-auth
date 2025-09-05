import { env } from "@/config/env";
import { logger } from "@/core/logger";
import { sql } from "drizzle-orm";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

const pool = new Pool({ connectionString: env.DATABASE_URL });
export const db = drizzle(pool);

export const connectDrizzle = async () => {
  try {
    await db.execute(sql`SELECT 1`);
    logger.info("Drizzle connected to the database");
  } catch (error: any) {
    logger.error("Drizzle failed to connect to the database: " + error.message);
    process.exit(1);
  }
};
