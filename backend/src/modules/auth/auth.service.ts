import { db } from "@/db";
import {
  hashToken,
  expiresAfter,
  generateAccessToken,
  generateRefreshToken,
  generateToken,
  hashPassword,
  isPasswordValid,
  verifyRefreshJWT,
} from "./auth.utils";

import { sessionTable, userTable, verificationTable } from "@/db/schema";
import { and, eq, gt } from "drizzle-orm";
import { ApiError, HttpStatus } from "@/core";
import { emailQueue } from "@/queues/email";
import { sendVerificationMail } from "@/utils/mail";
import { logger } from "@/utils/logger";
import { LoginDto, RegisterDto } from "./auth.dto";

export async function registerUser({ name, email, password }: RegisterDto) {
  logger.info({ email }, "Registration attempt");
  const [existingUser] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  if (existingUser)
    throw new ApiError(HttpStatus.CONFLICT, "Email is already registered");

  const hashedPassword = await hashPassword(password);
  const { rawToken, hashedToken, tokenExpiry } = generateToken();

  const [user] = await db
    .insert(userTable)
    .values({ name, email, password: hashedPassword })
    .returning({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      emailVerified: userTable.emailVerified,
      avatar: userTable.avatar,
      role: userTable.role,
      provider: userTable.provider,
    });

  if (!user)
    throw new ApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Failed to register, Please try again."
    );

  emailQueue.add("sendVerifyEmail", {
    type: "verify",
    name: user.name,
    email: user.email,
    token: rawToken,
  });

  await sendVerificationMail(user.name, user.email, rawToken);

  logger.info({ email }, "User registered successfully");

  return user;
}

export async function loginUser({
  email,
  password,
  userAgent,
  ipAddress,
}: LoginDto) {
  logger.info({ email }, "Login attempt");

  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  if (!user) {
    logger.warn(`Login failed: User with email ${email} not found`);
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  if (!user.emailVerified) {
    throw new ApiError(401, "Please verify your email first");
  }

  const isPasswordCorrect = await isPasswordValid(password, user.password!);

  if (!isPasswordCorrect) {
    logger.warn(`Login failed: Invalid password for email ${email}`);
    throw new ApiError(401, "Invalid credentials");
  }

  const [session] = await db
    .insert(sessionTable)
    .values({
      userId: user.id,
      ipAddress,
      userAgent,
      expiresAt: expiresAfter(),
    })
    .returning();

  if (!session)
    throw new ApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create session, Please try again."
    );

  const accessToken = generateAccessToken({
    userId: user.id,
    sessionId: session.id,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
    sessionId: session.id,
  });

  logger.info({ email }, "User logged in successfully");

  return { accessToken, refreshToken, MFA_Required: false };
}

export async function refreshTokens(refreshToken: string) {
  const payload = verifyRefreshJWT(refreshToken);

  const [validSession] = await db
    .select()
    .from(sessionTable)
    .where(eq(sessionTable.id, payload.sessionId));

  if (!validSession) {
    throw new ApiError(401, "Refresh token has been used or is invalid");
  }

  if (new Date(validSession.expiresAt) < new Date()) {
    throw new ApiError(401, "Session expired, Please login again.");
  }

  await db
    .update(sessionTable)
    .set({
      expiresAt: expiresAfter(),
    })
    .where(eq(sessionTable.id, validSession.id));

  const accessToken = generateAccessToken({
    userId: validSession.userId,
    sessionId: validSession.id,
  });

  const newRefreshToken = generateRefreshToken({
    userId: validSession.userId,
    sessionId: validSession.id,
  });

  return {
    accessToken,
    newRefreshToken,
  };
}

export async function verifyUserEmail(token: string) {
  const hashedToken = hashToken(token);

  const [record] = await db
    .select()
    .from(verificationTable)
    .where(
      and(
        eq(verificationTable.value, hashedToken),
        eq(verificationTable.type, "email_verify"),
        gt(verificationTable.expiresAt, new Date())
      )
    );

  if (!record) {
    throw new ApiError(400, "Invalid or expired verification token");
  }

  await db
    .update(userTable)
    .set({ emailVerified: true })
    .where(eq(userTable.id, record.userId));

  await db.delete(verificationTable).where(eq(verificationTable.id, record.id));
}
