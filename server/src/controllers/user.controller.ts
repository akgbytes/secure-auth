import { uploadOnCloudinary } from "@/config/cloudinary";
import { logger } from "@/config/logger";
import { db } from "@/db";
import { sessionTable } from "@/db/schema/session.schema";
import { userTable } from "@/db/schema/user.schema";
import {
  ApiError,
  ApiResponse,
  asyncHandler,
  handleZodError,
  HttpStatus,
} from "@/utils/core";
import { hashPassword, verifyPasswordHash } from "@/utils/password";
import { validatePassword } from "@/validations/auth.validations";
import { and, eq, ne } from "drizzle-orm";

export const getMe = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Unauthorized");
  }

  const [userDetails] = await db
    .select({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      emailVerified: userTable.emailVerified,
      avatar: userTable.avatar,
      role: userTable.role,
      provider: userTable.provider,
      createdAt: userTable.createdAt,
      updatedAt: userTable.updatedAt,
    })
    .from(userTable)
    .where(eq(userTable.id, user.id));

  if (!userDetails)
    throw new ApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );

  res
    .status(HttpStatus.OK)
    .json(
      new ApiResponse(
        HttpStatus.OK,
        "User profile fetched successfully",
        userDetails
      )
    );
});

export const changePassword = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Unauthorized");
  }

  const password = handleZodError(validatePassword(req.body.password));
  const hashedPassword = await hashPassword(password);

  await db
    .transaction(async (tx) => {
      // change password
      await tx
        .update(userTable)
        .set({
          password: hashedPassword,
        })
        .where(eq(userTable.id, user.id));

      // delete all existing sessions
      await tx.delete(sessionTable).where(
        and(
          eq(sessionTable.userId, user.id),
          ne(sessionTable.id, user.sessionId) // keep the current session
        )
      );
    })
    .catch((error) => {
      logger.error("Error during password change transaction", {
        email: user.email,
        error,
      });
      throw new ApiError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Unable to change password. Please try again later."
      );
    });

  logger.info("Password changed successfully", { email: user.email });
  res
    .status(HttpStatus.OK)
    .json(
      new ApiResponse(HttpStatus.OK, "Password changed successfully", null)
    );
});

export const updateAvatar = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Unauthorized");
  }

  let imageUrl = await uploadOnCloudinary(req.file?.path || "");
  logger.info("Avatar uploaded to Cloudinary", { email: user.email });

  // update in db
  await db
    .update(userTable)
    .set({
      avatar: imageUrl.secure_url,
    })
    .where(eq(userTable.id, user.id));

  logger.info("Avatar changed successfully");

  res
    .status(HttpStatus.OK)
    .json(
      new ApiResponse(HttpStatus.OK, "User avatar updated successfully", null)
    );
});
