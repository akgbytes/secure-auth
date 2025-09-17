import { userTable } from "@/db/schema/user.schema";
import { InferSelectModel } from "drizzle-orm";

export type User = InferSelectModel<typeof userTable>;
