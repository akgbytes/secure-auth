import { env } from "@/config/env";
import { TokenPayload } from "@/types";
import crypto from "crypto";
import jwt, { SignOptions } from "jsonwebtoken";

export const hashToken = (rawToken: string) =>
  crypto.createHash("sha256").update(rawToken).digest("hex");

export const generateToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const tokenExpiry = new Date(
    Date.now() + env.TOKEN_EXPIRY_IN_MINUTES * 60 * 1000
  );

  return { rawToken, tokenHash, tokenExpiry };
};

export const generateAccessToken = ({ userId, sessionId }: TokenPayload) =>
  jwt.sign(
    {
      userId,
      sessionId,
    },
    env.ACCESS_TOKEN_SECRET,
    { expiresIn: env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"] }
  );

export const generateRefreshToken = ({ userId, sessionId }: TokenPayload) =>
  jwt.sign(
    {
      userId,
      sessionId,
    },
    env.REFRESH_TOKEN_SECRET,
    { expiresIn: env.REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"] }
  );
