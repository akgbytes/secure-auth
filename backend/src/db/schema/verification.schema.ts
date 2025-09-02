import { pgTable, text, boolean, uuid, timestamp } from "drizzle-orm/pg-core";
import { timestamps } from "@/db/column-helpers";

export const verificationTable = pgTable("verification", {
  id: uuid("id").defaultRandom().primaryKey(),
  value: text("value").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ...timestamps,
});
