import { pgTable, text, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { timestamps } from "@/db/column-helpers";
import { userTable } from "./user.schema";
import { TokenType } from "@/utils/constants";

export const tokenType = pgEnum("type", TokenType);

export const tokenTables = pgTable("token", {
  id: uuid("id").defaultRandom().primaryKey(),
  token: text("token").notNull().unique(),
  type: tokenType().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  ...timestamps,
});
