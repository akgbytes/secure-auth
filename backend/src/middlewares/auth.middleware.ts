import { ApiError, asyncHandler, HttpStatus } from "@/core";
import { db } from "@/db";
import { userTable } from "@/db/schema";
import { verifyAccessJWT } from "@/modules/auth/auth.utils";
import { eq } from "drizzle-orm";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  const { accessToken } = req.cookies;
  if (!accessToken)
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Access token missing");

  const payload = verifyAccessJWT(accessToken);
  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, payload.userId));

  if (!user) {
    throw new ApiError(HttpStatus.BAD_REQUEST, "User not found");
  }

  req.user = user;
  next();
});
