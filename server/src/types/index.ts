import { UserRole } from "@/utils/constants";
import { JwtPayload } from "jsonwebtoken";

export interface TokenPayload extends JwtPayload {
  id: string;
  sessionId: string;
  email: string;
  role: UserRole;
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

export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: "Bearer";
  id_token?: string; // JWT token (only if "openid" scope is requested)
}
