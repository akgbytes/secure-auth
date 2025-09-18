import { userTable } from "@/db/schema/user.schema";
import { InferSelectModel } from "drizzle-orm";
import { JwtPayload } from "jsonwebtoken";

export type User = InferSelectModel<typeof userTable>;

export interface TokenPayload extends JwtPayload {
  userId: string;
  sessionId: string;
}

export type UserGoogleProfile = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
};
