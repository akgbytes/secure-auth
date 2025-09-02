import { pgTable, text, boolean, uuid, timestamp } from "drizzle-orm/pg-core";
import { timestamps } from "@/db/column-helpers";
import { userTable } from "./user.schema";

export const verificationTable = pgTable("verification", {
  id: uuid("id").defaultRandom().primaryKey(),
  value: text("value").notNull().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  ...timestamps,
});
