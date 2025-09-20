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
import { eq } from "drizzle-orm";

export const changePassword = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Unauthorized");
  }

  const password = handleZodError(validatePassword(req.body.email));
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
      await tx.delete(sessionTable).where(eq(sessionTable.userId, user.id));
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

export const updateAvatar = asyncHandler(async (req, res) => {});
