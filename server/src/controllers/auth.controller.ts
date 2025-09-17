import { logger } from "@/config/logger";
import { db } from "@/db";
import { sessionTable } from "@/db/schema/session.schema";
import { tokenTable } from "@/db/schema/token.schema";
import { userTable } from "@/db/schema/user.schema";
import { clearAuthCookies, setAuthCookies } from "@/utils/cookies";
import {
  ApiError,
  ApiResponse,
  asyncHandler,
  handleZodError,
  HttpStatus,
} from "@/utils/core";
import { sessionExpiresAfter } from "@/utils/helpers";
import { sendResetPasswordMail, sendVerificationMail } from "@/utils/mail";
import { hashPassword, verifyPasswordHash } from "@/utils/password";
import {
  generateAccessToken,
  generateRefreshToken,
  generateToken,
  hashToken,
  verifyRefreshJWT,
} from "@/utils/token";

import {
  validateEmail,
  validateLogin,
  validateRegister,
  validateVerifyEmail,
} from "@/validations/auth.validations";
import { and, eq, gt } from "drizzle-orm";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = handleZodError(validateRegister(req.body));

  logger.info("Registration attempt", { email });

  const [existingUser] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email))
    .limit(1);

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
    logger.warn("Failed to create user", { email });
    throw new ApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Unable to register. Please try again."
    );
  }
  // generate token for email verification
  const { rawToken, tokenHash, tokenExpiry } = generateToken();

  const [token] = await db
    .insert(tokenTable)
    .values({
      token: tokenHash,
      type: "verify_email",
      userId: user.id,
      expiresAt: tokenExpiry,
    })
    .returning();

  if (!token) {
    logger.warn("Failed to create verification token", { email });
    throw new ApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Unable to register. Please try again."
    );
  }

  await sendVerificationMail(user.email, rawToken);

  logger.info("Registration successful. Verification email sent.", {
    email,
    userId: user.id,
  });

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

  logger.info("Login attempt", { email });

  const userAgent = req.headers["user-agent"] || "";
  const ipAddress = (req.headers["x-forwarded-for"] as string) || req.ip || "";

  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  if (!user) {
    logger.warn("Login failed: User not found", { email });
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  // if user had logged in via oauth, password will be null, so provide fallback
  const isPasswordCorrect = await verifyPasswordHash(
    password,
    user.password || ""
  );

  if (!isPasswordCorrect) {
    logger.warn("Login failed: Incorrect password", { email });
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  if (!user.emailVerified) {
    logger.warn("Login blocked: Email not verified", { email });
    throw new ApiError(
      HttpStatus.UNAUTHORIZED,
      "Your email is not verified. Please verify before login."
    );
  }

  // if session exists then update expiry time otherwise create new
  const [session] = await db
    .insert(sessionTable)
    .values({
      userId: user.id,
      ipAddress,
      userAgent,
      expiresAt: sessionExpiresAfter(),
    })
    .onConflictDoUpdate({
      target: [
        sessionTable.userId,
        sessionTable.userAgent,
        sessionTable.ipAddress,
      ],
      set: {
        expiresAt: sessionExpiresAfter(),
      },
    })
    .returning();

  if (!session) {
    logger.error("Login failed: Could not create or update session", { email });
    throw new ApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Unable to login. Please try again later."
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

  setAuthCookies(res, accessToken, refreshToken);

  res
    .status(HttpStatus.CREATED)
    .json(new ApiResponse(HttpStatus.CREATED, "Logged in successfully", null));
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken as string;

  if (!refreshToken) {
    logger.warn("Logout attempt without refresh token");
  } else {
    try {
      const payload = verifyRefreshJWT(refreshToken);
      await db
        .delete(sessionTable)
        .where(eq(sessionTable.id, payload.sessionId));

      logger.info("Logged out successfully", { userId: payload.userId });
    } catch (err: any) {
      const errorMsg =
        err instanceof ApiError ? err.message : "Invalid session";
      logger.warn("Error verifying or deleting session", { error: errorMsg });
    }
  }

  clearAuthCookies(res);

  res
    .status(HttpStatus.OK)
    .json(new ApiResponse(HttpStatus.OK, "Logged out successfully", null));
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = handleZodError(validateVerifyEmail(req.body));

  const tokenHash = hashToken(token);

  const [tokenInDb] = await db
    .select()
    .from(tokenTable)
    .where(
      and(
        eq(tokenTable.token, tokenHash),
        eq(tokenTable.type, "verify_email"),
        gt(tokenTable.expiresAt, new Date())
      )
    );

  if (!tokenInDb) {
    throw new ApiError(400, "Invalid or expired link");
  }

  await db.transaction(async (tx) => {
    await db
      .update(userTable)
      .set({ emailVerified: true })
      .where(eq(userTable.id, tokenInDb.userId));

    await db.delete(tokenTable).where(eq(tokenTable.id, tokenInDb.id));
  });

  res
    .status(HttpStatus.OK)
    .json(new ApiResponse(HttpStatus.OK, "Email verified successfully", null));
});

export const resendVerificationEmail = asyncHandler(async (req, res) => {
  const email = handleZodError(validateEmail(req.body.email));

  logger.info("Request for resend verification email", { email });

  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  if (!user) {
    logger.warn("Resend verification requested for non-existing user", {
      email,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "If an account exists, a verification email has been sent.",
          null
        )
      );
  }

  if (user.emailVerified) {
    logger.warn("Resend verification requested for already verified email", {
      email,
    });

    throw new ApiError(HttpStatus.BAD_REQUEST, "Email is already verified");
  }

  // delete if there is already token for email verification in db
  await db.delete(tokenTable).where(eq(tokenTable.userId, user.id));

  const { rawToken, tokenHash, tokenExpiry } = generateToken();

  const [token] = await db
    .insert(tokenTable)
    .values({
      token: tokenHash,
      type: "verify_email",
      userId: user.id,
      expiresAt: tokenExpiry,
    })
    .returning();

  if (!token) {
    logger.error(
      "Failed to resend verification mail: Could not create verification token",
      { email }
    );
    throw new ApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong, Please try again later."
    );
  }

  await sendVerificationMail(user.email, rawToken);

  logger.info("Verification email resent", { email });

  res
    .status(HttpStatus.OK)
    .json(
      new ApiResponse(
        HttpStatus.OK,
        "If an account exists, a verification email has been sent.",
        null
      )
    );
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const email = handleZodError(validateEmail(req.body.email));

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

  //  delete if there is already token for reset password in db
  await db.delete(tokenTable).where(eq(tokenTable.userId, user.id));

  const { rawToken, tokenHash, tokenExpiry } = generateToken();
  const [token] = await db
    .insert(tokenTable)
    .values({
      token: tokenHash,
      type: "reset_password",
      userId: user.id,
      expiresAt: tokenExpiry,
    })
    .returning();

  if (!token) {
    logger.warn("Failed to create reset password token", { email });
    throw new ApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong, Please try again later."
    );
  }

  await sendResetPasswordMail(user.email, rawToken);

  logger.info("Password reset email sent", { email });
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

export const example = asyncHandler(async (req, res) => {
  res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, "", null));
});
