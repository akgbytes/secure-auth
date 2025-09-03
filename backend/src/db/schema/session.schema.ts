import { pgTable, text, boolean, uuid, timestamp } from "drizzle-orm/pg-core";
import { timestamps } from "@/db/column-helpers";
import { userTable } from "./user.schema";
import { env } from "@/config/env";
import ms from "ms";

const after3days = new Date(
  Date.now() + ms(env.REFRESH_TOKEN_EXPIRY as ms.StringValue)
);

export const sessionTable = pgTable("session", {
  id: uuid("id").defaultRandom().primaryKey(),
  ipAddress: text("ip_address").notNull(),
  userAgent: text("user_agent").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").default(after3days).notNull(),
  ...timestamps,
});
