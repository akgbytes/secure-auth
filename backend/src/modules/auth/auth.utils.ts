import { env } from "@/config/env";
import { ApiError, HttpStatus } from "@/core";
import { TokenPayload } from "@/types";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import jwt, { SignOptions, TokenExpiredError } from "jsonwebtoken";
import ms from "ms";

export const sessionExpiresAfter = () =>
  new Date(Date.now() + ms(env.REFRESH_TOKEN_EXPIRY as ms.StringValue));

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

const googleClient = new OAuth2Client(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000"
);

export const getGoogleTokens = async (code: string) => {
  const { tokens } = await googleClient.getToken(code);
  return tokens;
};

export const verifyGoogleToken = async (token: string) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new ApiError(
      HttpStatus.UNAUTHORIZED,
      "Google token verification failed, No payload received."
    );
  }

  return payload;
};
