import { userTable } from "@/db/schema/user.schema";
import { InferSelectModel } from "drizzle-orm";
import { JwtPayload } from "jsonwebtoken";

export type User = InferSelectModel<typeof userTable>;

export interface TokenPayload extends JwtPayload {
  userId: string;
  sessionId: string;
}
