import { boolean, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { PROVIDER, USER_ROLE } from "@/constants";
import { timestamps } from "@/db/column-helpers";

const role = pgEnum("role", USER_ROLE);
const provider = pgEnum("provider", PROVIDER);

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
			"https://res.cloudinary.com/dmnh10etf/image/upload/v1750270944/default_epnleu.png",
		),
	...timestamps,
});
