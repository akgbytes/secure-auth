import { userTable } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type User = InferSelectModel<typeof userTable>;

export interface JWTPayload {
  userId: string;
  sessionId: string;
}
