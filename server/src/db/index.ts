import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";
import { env } from "@/config/env";
import { logger } from "@/utils/core/logger";

export const db = drizzle(env.DATABASE_URL);

export const connectDrizzle = async () => {
	try {
		await db.execute(sql`SELECT 1`);
		logger.info("Drizzle connected to the database");
	} catch (_error: unknown) {
		logger.error("Drizzle failed to connect to the database");
		process.exit(1);
	}
};
