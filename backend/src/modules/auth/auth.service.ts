import { db } from "@/db";
import {
  generateAccessToken,
  generateRefreshToken,
  generateToken,
  hashPassword,
  isPasswordValid,
} from "./auth.utils";

import { sessionTable, userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ApiError, HttpStatus } from "@/core";
import { emailQueue } from "@/queues/email";
import { sendVerificationMail } from "@/utils/mail";
import { logger } from "@/utils/logger";
import { LoginDto, RegisterDto } from "./auth.dto";
import { setAuthCookies } from "@/utils/cookies";

export async function registerUser({ name, email, password }: RegisterDto) {
  logger.info({ email }, "Registration attempt");
  const [existingUser] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  if (existingUser)
    throw new ApiError(HttpStatus.CONFLICT, "Email is already registered");

  const hashedPassword = await hashPassword(password);
  const { unHashedToken, hashedToken, tokenExpiry } = generateToken();

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
    token: unHashedToken,
  });

  await sendVerificationMail(user.name, user.email, unHashedToken);

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
