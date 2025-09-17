import { logger } from "@/config/logger";
import { db } from "@/db";
import { sessionTable } from "@/db/schema/session.schema";
import { tokenTable } from "@/db/schema/token.schema";
import { userTable } from "@/db/schema/user.schema";
import {
  ApiError,
  ApiResponse,
  asyncHandler,
  handleZodError,
  HttpStatus,
} from "@/utils/core";
import { sessionExpiresAfter } from "@/utils/helpers";
import { sendVerificationMail } from "@/utils/mail";
import { hashPassword, verifyPasswordHash } from "@/utils/password";
import { generateToken } from "@/utils/token";

import {
  validateLogin,
  validateRegister,
} from "@/validations/auth.validations";
import { and, eq } from "drizzle-orm";

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

  const [existingSession] = await db
    .select()
    .from(sessionTable)
    .where(
      and(
        eq(sessionTable.userId, user.id),
        eq(sessionTable.userAgent, userAgent),
        eq(sessionTable.ipAddress, ipAddress)
      )
    )
    .limit(1);

  res
    .status(HttpStatus.CREATED)
    .json(new ApiResponse(HttpStatus.CREATED, "Logged in successfully", null));
});
