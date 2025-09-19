import { pgTable, text, boolean, uuid, pgEnum } from "drizzle-orm/pg-core";
import { timestamps } from "@/db/column-helpers";
import { Provider, UserRole } from "@/utils/constants";

export const role = pgEnum("role", UserRole);
export const provider = pgEnum("provider", Provider);

export const userTable = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password"),
  emailVerified: boolean("email_verified").default(false).notNull(),
  role: role().default("user").notNull(),
  provider: provider().default("local").notNull(),
  avatar: text("avatar")
    .notNull()
    .default(
      "https://res.cloudinary.com/dmnh10etf/image/upload/v1750270944/default_epnleu.png"
    ),
  ...timestamps,
});
