import { role } from "./../db/schema/user.schema";
import { env } from "@/config/env";
import { TokenPayload } from "@/types";
import crypto from "crypto";
import jwt, { SignOptions, TokenExpiredError } from "jsonwebtoken";
import { ApiError, HttpStatus } from "./core";

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

export const generateAccessToken = ({
  id,
  sessionId,
  email,
  role,
}: TokenPayload) =>
  jwt.sign(
    {
      id,
      sessionId,
      email,
      role,
    },
    env.ACCESS_TOKEN_SECRET,
    { expiresIn: env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"] }
  );

export const generateRefreshToken = ({
  id,
  sessionId,
  email,
  role,
}: TokenPayload) =>
  jwt.sign(
    {
      id,
      sessionId,
      email,
      role,
    },
    env.REFRESH_TOKEN_SECRET,
    { expiresIn: env.REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"] }
  );

export const verifyAccessJWT = (accessToken: string): TokenPayload => {
  try {
    const payload = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET);
    return payload as TokenPayload;
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, "TokenExpiredError");
    }
    throw new ApiError(
      HttpStatus.UNAUTHORIZED,
      "Invalid or expired access token"
    );
  }
};

export const verifyRefreshJWT = (refreshToken: string): TokenPayload => {
  try {
    const payload = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);
    return payload as TokenPayload;
  } catch (error: any) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
};
