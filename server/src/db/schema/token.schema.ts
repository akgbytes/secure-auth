import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { TOKEN_TYPE } from "@/constants";
import { timestamps } from "@/db/column-helpers";
import { userTable } from "./user.schema";

const tokenType = pgEnum("type", TOKEN_TYPE);

export const tokenTable = pgTable("token", {
	id: uuid("id").defaultRandom().primaryKey(),
	token: text("token").notNull().unique(),
	type: tokenType().notNull(),
	userId: uuid("user_id")
		.notNull()
		.references(() => userTable.id, { onDelete: "cascade" }),
	expiresAt: timestamp("expires_at").notNull(),
	...timestamps,
});
