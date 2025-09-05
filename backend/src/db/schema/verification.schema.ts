import { pgTable, text, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { timestamps } from "@/db/column-helpers";
import { userTable } from "./user.schema";
import { VerificationType } from "@/constants";

export const verificationType = pgEnum("type", VerificationType);

export const verificationTable = pgTable("verification", {
  id: uuid("id").defaultRandom().primaryKey(),
  token: text("token").notNull().unique(),
  code: text("code").unique(),
  type: verificationType().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  ...timestamps,
});
