import { logger } from "@/config/logger";
import { db } from "@/db";
import { sessionTable } from "@/db/schema/session.schema";
import { userTable } from "@/db/schema/user.schema";
import { ApiError, ApiResponse, asyncHandler, HttpStatus } from "@/utils/core";
import { transformSessions } from "@/utils/sessions";
import { desc, eq, ne } from "drizzle-orm";

export const getAllUsers = asyncHandler(async (req, res) => {
  const adminId = req.user?.id;

  if (!adminId) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Unauthorized");
  }

  const users = await db
    .select({
      createdAt: userTable.createdAt,
      updatedAt: userTable.updatedAt,
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      emailVerified: userTable.emailVerified,
      role: userTable.role,
      provider: userTable.provider,
      avatar: userTable.avatar,
    })
    .from(userTable)
    .where(ne(userTable.id, adminId))
    .orderBy(desc(userTable.createdAt));

  logger.info(`Admin fetched all users`);

  res
    .status(HttpStatus.OK)
    .json(
      new ApiResponse(HttpStatus.OK, "All users fetched successfully", users)
    );
});

export const logoutUserSession = asyncHandler(async (req, res) => {
  const sessionId = req.params.id as string;

  const [session] = await db
    .delete(sessionTable)
    .where(eq(sessionTable.id, sessionId))
    .returning();

  if (!session) {
    throw new ApiError(HttpStatus.NOT_FOUND, "Session not found");
  }

  res
    .status(HttpStatus.OK)
    .json(
      new ApiResponse(HttpStatus.OK, "User session deleted successfully", null)
    );
});
