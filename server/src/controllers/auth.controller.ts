import { logger } from "@/config/logger";
import { db } from "@/db";
import { tokenTable } from "@/db/schema/token.schema";
import { userTable } from "@/db/schema/user.schema";
import {
  ApiError,
  ApiResponse,
  asyncHandler,
  handleZodError,
  HttpStatus,
} from "@/utils/core";
import { sendVerificationMail } from "@/utils/mail";
import { hashPassword } from "@/utils/password";
import { generateToken } from "@/utils/token";

import { validateRegister } from "@/validations/auth.validations";
import { eq } from "drizzle-orm";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = handleZodError(validateRegister(req.body));

  logger.info("Registration attempt", { email });

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
    logger.warn("Failed to create user", { email });
    throw new ApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Unable to register, Please try again."
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
      "Unable to register, Please try again."
    );
  }

  await sendVerificationMail(user.email, rawToken);

  logger.info("Registration successful, verification email sent.", {
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
