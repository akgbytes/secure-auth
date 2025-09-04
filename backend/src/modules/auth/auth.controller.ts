import { ApiError, ApiResponse, asyncHandler, HttpStatus } from "@/core";
import { handleZodError } from "@/utils/handleZodError";
import {
  validateEmail,
  validateSignIn,
  validateSignUp,
  validateVerifyEmail,
} from "./auth.validators";

import { setAuthCookies } from "@/utils/cookies";
import { logger } from "@/utils/logger";
import { sessionTable, userTable, verificationTable } from "@/db/schema";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import {
  expiresAfter,
  generateAccessToken,
  generateOtp,
  generateRefreshToken,
  generateToken,
  hashPassword,
  hashToken,
  isPasswordValid,
  verifyRefreshJWT,
} from "./auth.utils";
import { emailQueue } from "@/queues/email";
import { sendVerificationMail } from "@/utils/mail";

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = handleZodError(validateSignUp(req.body));

  logger.info({ email }, "Sign up attempt");

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

  if (!user) {
    logger.warn({ email }, "Failed to create user");
    throw new ApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Unable to complete signup, Please try again later."
    );
  }

  const { rawToken, tokenHash, tokenExpiry } = generateToken();
  const { otp, otpHash } = generateOtp();

  const [verification] = await db
    .insert(verificationTable)
    .values({
      code: otpHash,
      token: tokenHash,
      type: "email_verify",
      userId: user.id,
      expiresAt: tokenExpiry,
    })
    .returning();

  if (!verification) {
    logger.warn({ email }, "Failed to create verification record");
    throw new ApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Unable to complete signup, Please try again later."
    );
  }

  emailQueue.add("sendVerifyEmail", {
    type: "verify",
    name: user.name,
    email: user.email,
    token: rawToken,
    otp: otp,
  });

  logger.info({ email }, "Signup successful, verification email queued");

  res
    .status(HttpStatus.CREATED)
    .json(
      new ApiResponse(
        HttpStatus.CREATED,
        "Signup successful, Please verify your email.",
        { user, token: rawToken }
      )
    );
});

export const signin = asyncHandler(async (req, res) => {
  const { email, password } = handleZodError(validateSignIn(req.body));
  logger.info({ email }, "Signin attempt");
  const userAgent = req.headers["user-agent"] || "";
  const ipAddress = req.ip || "";

  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  if (!user) {
    logger.warn({ email }, "Signin failed: User not found");
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  if (!user.emailVerified) {
    logger.warn({ email }, "Signin blocked: Email not verified");
    throw new ApiError(
      HttpStatus.UNAUTHORIZED,
      "Your email is not verified. Please verify before signing in."
    );
  }

  const isPasswordCorrect = await isPasswordValid(password, user.password!);

  if (!isPasswordCorrect) {
    logger.warn({ email }, "Signin failed: Incorrect password");
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Invalid email or password");
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

  if (!session) {
    logger.error({ email }, "Signin failed: Session creation error");
    throw new ApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Unable to create session. Please try again later."
    );
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    sessionId: session.id,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
    sessionId: session.id,
  });

  logger.info({ email, sessionId: session.id }, "Signin successful");

  setAuthCookies(res, accessToken, refreshToken);

  res.status(HttpStatus.OK).json(
    new ApiResponse(HttpStatus.OK, "Signed in successfully", {
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
  const { token, otp } = handleZodError(validateVerifyEmail(req.body));
  const tokenHash = hashToken(token);
  const otpHash = hashToken(otp);

  const [record] = await db
    .select()
    .from(verificationTable)
    .where(
      and(
        eq(verificationTable.token, tokenHash),
        eq(verificationTable.code, otpHash),
        eq(verificationTable.type, "email_verify"),
        gt(verificationTable.expiresAt, new Date())
      )
    );
  if (!record) {
    throw new ApiError(400, "Invalid or expired OTP");
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
  // const email = handleZodError(validateEmail(req.body));
  // const [user] = await db
  //   .select()
  //   .from(userTable)
  //   .where(eq(userTable.email, email));
  // if (!user) {
  //   return res
  //     .status(200)
  //     .json(
  //       new ApiResponse(
  //         200,
  //         "If an account exists, a reset link has been sent to the email.",
  //         null
  //       )
  //     );
  // }
  // // Sirf verified user hi password reset kar paye
  // if (!user.emailVerified) {
  //   return res
  //     .status(HttpStatus.OK)
  //     .json(
  //       new ApiResponse(
  //         HttpStatus.OK,
  //         "If an account exists, a reset link has been sent to the email.",
  //         null
  //       )
  //     );
  // }
  // if (user.provider !== "local") {
  //   return res.status(200).json(
  //     new ApiResponse(
  //       200,
  //       `You signed up using ${user.provider}. Please use sign-in using ${user.provider} to access your account.`,
  //       {
  //         code: "OAUTH_USER",
  //       }
  //     )
  //   );
  // }
  // const { rawToken, hashedToken, tokenExpiry } = generateToken();
  // const [verification] = await db
  //   .insert(verificationTable)
  //   .values({
  //     value: hashedToken,
  //     type: "forgot_password",
  //     userId: user.id,
  //     expiresAt: tokenExpiry,
  //   })
  //   .returning();
  // if (!verification) {
  //   throw new ApiError(
  //     HttpStatus.INTERNAL_SERVER_ERROR,
  //     "Failed to create verification record"
  //   );
  // }
  // emailQueue.add("sendResetEmail", {
  //   type: "reset",
  //   name: user.name,
  //   email: user.email,
  //   token: rawToken,
  // });
  // logger.info({ email }, "Password reset email sent");
  // res
  //   .status(HttpStatus.OK)
  //   .json(
  //     new ApiResponse(
  //       HttpStatus.OK,
  //       "If an account exists, a reset link has been sent to the email",
  //       null
  //     )
  //   );
});

export const resetPassword = asyncHandler(async (req, res) => {
  // const password = handleZodError(validatePassword(req.body));
  // const token = req.params.token as string;
  // const hashedToken = hashToken(token);
  // const [verificationRecord] = await db
  //   .select({
  //     verification: verificationTable,
  //     user: {
  //       id: userTable.id,
  //       email: userTable.email,
  //       password: userTable.password,
  //       isEmailVerified: userTable.emailVerified,
  //     },
  //   })
  //   .from(verificationTable)
  //   .innerJoin(userTable, eq(verificationTable.userId, userTable.id))
  //   .where(
  //     and(
  //       eq(verificationTable.value, hashedToken),
  //       eq(verificationTable.type, "forgot_password"),
  //       gt(verificationTable.expiresAt, new Date())
  //     )
  //   );
  // if (!verificationRecord) {
  //   throw new ApiError(
  //     HttpStatus.UNAUTHORIZED,
  //     "Reset link has expired or is invalid"
  //   );
  // }
  // const isSamePassword = await isPasswordValid(
  //   password,
  //   verificationRecord.user.password!
  // );
  // if (isSamePassword) {
  //   throw new ApiError(
  //     HttpStatus.BAD_REQUEST,
  //     "New password cannot be the same as the old password"
  //   );
  // }
  // const hashedPassword = await hashPassword(password);
  // await db
  //   .update(userTable)
  //   .set({
  //     password: hashedPassword,
  //   })
  //   .where(eq(userTable.id, verificationRecord.user.id));
  // await db
  //   .delete(verificationTable)
  //   .where(eq(verificationTable.id, verificationRecord.verification.id));
  // // Sare existing session ko invalidate krna h bcuz of security
  // await db
  //   .delete(sessionTable)
  //   .where(eq(sessionTable.userId, verificationRecord.user.id));
  // logger.info(
  //   { email: verificationRecord.user.email },
  //   "Password reset successful"
  // );
  // res
  //   .status(HttpStatus.OK)
  //   .json(new ApiResponse(HttpStatus.OK, "Password reset successfully", null));
});
export const resendVerificationEmail = asyncHandler(async (req, res) => {});
export const logout = asyncHandler(async (req, res) => {});
export const example = asyncHandler(async (req, res) => {});
