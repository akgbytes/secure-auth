import { pgTable, text, boolean } from "drizzle-orm/pg-core";
import { timestamps } from "@/db/column-helpers";

export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password"),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image").default(
    "https://res.cloudinary.com/dmnh10etf/image/upload/v1750270944/default_epnleu.png"
  ),
  ...timestamps,
});
