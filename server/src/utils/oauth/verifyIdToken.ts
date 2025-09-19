import { env } from "@/config/env";
import * as jose from "jose";

const JWKS = jose.createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs")
);

export const verifyIdToken = async (idToken: string) => {
  const { payload } = await jose.jwtVerify(idToken, JWKS, {
    issuer: ["https://accounts.google.com", "accounts.google.com"],
    audience: env.GOOGLE_CLIENT_ID,
  });

  return {
    email: payload.email as string,
    name: payload.name as string,
    picture: payload.picture as string,
    emailVerified: payload.email_verified as boolean,
    sub: payload.sub as string,
  };
};
