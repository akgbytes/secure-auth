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

export const hashToken = (rawToken: string) =>
  crypto.createHash("sha256").update(rawToken).digest("hex");

export const generateToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const tokenExpiry = new Date(
    Date.now() + env.VERIFICATION_TOKEN_EXPIRY_MINUTES * 60 * 1000
  );

  return { rawToken, tokenHash, tokenExpiry };
};

export const generateOtp = () => {
  const otp = Array.from(crypto.randomFillSync(new Uint8Array(env.OTP_LENGTH)))
    .map((n) => (n % 10).toString())
    .join("");

  const otpHash = hashToken(otp);

  return { otp, otpHash };
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
