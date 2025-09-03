import { env } from "@/config/env";
import { JWTPayload } from "@/types";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt, { SignOptions } from "jsonwebtoken";

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

export const generateAccessToken = ({ userId, sessionId }: JWTPayload) =>
  jwt.sign(
    {
      userId,
      sessionId,
    },
    env.ACCESS_TOKEN_SECRET,
    { expiresIn: env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"] }
  );

export const generateRefreshToken = ({ userId, sessionId }: JWTPayload) =>
  jwt.sign(
    {
      userId,
      sessionId,
    },
    env.REFRESH_TOKEN_SECRET,
    { expiresIn: env.REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"] }
  );
