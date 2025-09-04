import { ApiError, ApiResponse, asyncHandler, HttpStatus } from "@/core";
import { handleZodError } from "@/utils/handleZodError";
import {
  validateEmail,
  validateLogin,
  validatePassword,
  validateRegister,
} from "./auth.validators";

import { setAuthCookies } from "@/utils/cookies";
import { logger } from "@/utils/logger";
import { sessionTable, userTable, verificationTable } from "@/db/schema";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import {
  expiresAfter,
  generateAccessToken,
  generateRefreshToken,
  generateToken,
  hashPassword,
  hashToken,
  isPasswordValid,
  verifyRefreshJWT,
} from "./auth.utils";
import { emailQueue } from "@/queues/email";
import { sendVerificationMail } from "@/utils/mail";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = handleZodError(validateRegister(req.body));

  logger.info({ email }, "Registration attempt");

  const [existingUser] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  if (existingUser)
    throw new ApiError(HttpStatus.CONFLICT, "Email is already registered");

  const hashedPassword = await hashPassword(password);

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

  const { rawToken, hashedToken, tokenExpiry } = generateToken();

  const [verification] = await db
    .insert(verificationTable)
    .values({
      value: hashedToken,
      type: "email_verify",
      userId: user.id,
      expiresAt: tokenExpiry,
    })
    .returning();

  if (!verification) {
    throw new ApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Failed to register, Please try again."
    );
  }

  emailQueue.add("sendVerifyEmail", {
    type: "verify",
    name: user.name,
    email: user.email,
    token: rawToken,
  });

  await sendVerificationMail(user.name, user.email, rawToken);

  logger.info({ email }, "User registered successfully");

  res
    .status(HttpStatus.CREATED)
    .json(
      new ApiResponse(
        HttpStatus.CREATED,
        "Registered successfully, Please verify your email.",
        user
      )
    );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = handleZodError(validateLogin(req.body));
  logger.info({ email }, "Login attempt");
  const userAgent = req.headers["user-agent"] || "";
  const ipAddress = req.ip || "";

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

  setAuthCookies(res, accessToken, refreshToken);

  res.status(HttpStatus.OK).json(
    new ApiResponse(HttpStatus.OK, "Logged in successfully", {
      MFA_Required: false,
    })
  );
});

export const refreshTokens = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken as string | undefined;

  if (!incomingRefreshToken) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Refresh token is missing");
  }

  const payload = verifyRefreshJWT(incomingRefreshToken);

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

  setAuthCookies(res, accessToken, newRefreshToken);

  res
    .status(HttpStatus.OK)
    .json(
      new ApiResponse(
        HttpStatus.OK,
        "Access token refreshed successfully",
        null
      )
    );
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.params.token as string;
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
  res
    .status(HttpStatus.OK)
    .json(new ApiResponse(HttpStatus.OK, "Email verified successfully", null));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const email = handleZodError(validateEmail(req.body));

  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  if (!user) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "If an account exists, a reset link has been sent to the email.",
          null
        )
      );
  }

  // Sirf verified user hi password reset kar paye
  if (!user.emailVerified) {
    return res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse(
          HttpStatus.OK,
          "If an account exists, a reset link has been sent to the email.",
          null
        )
      );
  }

  if (user.provider !== "local") {
    return res.status(200).json(
      new ApiResponse(
        200,
        `You signed up using ${user.provider}. Please use sign-in using ${user.provider} to access your account.`,
        {
          code: "OAUTH_USER",
        }
      )
    );
  }

  const { rawToken, hashedToken, tokenExpiry } = generateToken();

  const [verification] = await db
    .insert(verificationTable)
    .values({
      value: hashedToken,
      type: "forgot_password",
      userId: user.id,
      expiresAt: tokenExpiry,
    })
    .returning();

  if (!verification) {
    throw new ApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create verification record"
    );
  }

  emailQueue.add("sendResetEmail", {
    type: "reset",
    name: user.name,
    email: user.email,
    token: rawToken,
  });

  logger.info({ email }, "Password reset email sent");

  res
    .status(HttpStatus.OK)
    .json(
      new ApiResponse(
        HttpStatus.OK,
        "If an account exists, a reset link has been sent to the email",
        null
      )
    );
});

export const resetPassword = asyncHandler(async (req, res) => {
  const password = handleZodError(validatePassword(req.body));
  const token = req.params.token as string;

  const hashedToken = hashToken(token);

  const [verificationRecord] = await db
    .select({
      verification: verificationTable,
      user: {
        id: userTable.id,
        email: userTable.email,
        password: userTable.password,
        isEmailVerified: userTable.emailVerified,
      },
    })
    .from(verificationTable)
    .innerJoin(userTable, eq(verificationTable.userId, userTable.id))
    .where(
      and(
        eq(verificationTable.value, hashedToken),
        eq(verificationTable.type, "forgot_password"),
        gt(verificationTable.expiresAt, new Date())
      )
    );

  if (!verificationRecord) {
    throw new ApiError(
      HttpStatus.UNAUTHORIZED,
      "Reset link has expired or is invalid"
    );
  }

  const isSamePassword = await isPasswordValid(
    password,
    verificationRecord.user.password!
  );
  if (isSamePassword) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      "New password cannot be the same as the old password"
    );
  }

  const hashedPassword = await hashPassword(password);

  await db
    .update(userTable)
    .set({
      password: hashedPassword,
    })
    .where(eq(userTable.id, verificationRecord.user.id));

  await db
    .delete(verificationTable)
    .where(eq(verificationTable.id, verificationRecord.verification.id));

  // Sare existing session ko invalidate krna h bcuz of security
  await db
    .delete(sessionTable)
    .where(eq(sessionTable.userId, verificationRecord.user.id));

  logger.info(
    { email: verificationRecord.user.email },
    "Password reset successful"
  );

  res
    .status(HttpStatus.OK)
    .json(new ApiResponse(HttpStatus.OK, "Password reset successfully", null));
});
export const resendVerificationEmail = asyncHandler(async (req, res) => {});
export const logout = asyncHandler(async (req, res) => {});
export const example = asyncHandler(async (req, res) => {});
