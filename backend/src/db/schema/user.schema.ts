import { pgTable, text, boolean, uuid, pgEnum } from "drizzle-orm/pg-core";
import { timestamps } from "@/db/column-helpers";
import { Provider, UserRole } from "@/constants";

export const roleEnum = pgEnum("role", UserRole);
export const providerEnum = pgEnum("provider", Provider);

export const userTable = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password"),
  emailVerified: boolean("email_verified").default(false).notNull(),
  role: roleEnum().default("user").notNull(),
  provider: providerEnum().default("local").notNull(),
  avatar: text("avatar").default(
    "https://res.cloudinary.com/dmnh10etf/image/upload/v1750270944/default_epnleu.png"
  ),
  ...timestamps,
});
