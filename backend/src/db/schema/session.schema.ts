import { pgTable, text, boolean, uuid, timestamp } from "drizzle-orm/pg-core";
import { timestamps } from "@/db/column-helpers";
import { userTable } from "./user.schema";

export const sessionTable = pgTable("session", {
  id: uuid("id").defaultRandom().primaryKey(),
  ipAddress: text("ip_address").notNull(),
  userAgent: text("user_agent").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  ...timestamps,
});
