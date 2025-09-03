import { env } from "@/config/env";
import { ApiError } from "@/core";
import { TokenPayload } from "@/types";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt, { SignOptions } from "jsonwebtoken";
import ms from "ms";

export const hashPassword = async (password: string) =>
  await bcrypt.hash(password, 10);

export const isPasswordValid = async (
  enteredPassword: string,
  storedPassword: string
) => bcrypt.compare(enteredPassword, storedPassword);

export const createHash = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const generateToken = () => {
  const unHashedToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = createHash(unHashedToken);
  const tokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 min

  return { unHashedToken, hashedToken, tokenExpiry };
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

export const verifyRefreshJWT = (refreshToken: string): TokenPayload => {
  try {
    const payload = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);
    return payload as TokenPayload;
  } catch (error: any) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
};

export const expiresAfter = () =>
  new Date(Date.now() + ms(env.REFRESH_TOKEN_EXPIRY as ms.StringValue));
