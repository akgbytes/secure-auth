import {
  ApiError,
  ApiResponse,
  asyncHandler,
  HttpStatus,
  logger,
} from "@/core";
import { db } from "@/db";
import { sessionTable, userTable } from "@/db/schema";
import { desc, eq, ne } from "drizzle-orm";
import { transformSessions } from "../session/session.utils";

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

export const getUserSessionsById = asyncHandler(async (req, res) => {
  const userId = req.params.id as string;

  const allSessions = await db
    .select()
    .from(sessionTable)
    .where(eq(sessionTable.userId, userId))
    .orderBy(desc(sessionTable.createdAt));

  const formattedSessions = await transformSessions(allSessions);

  res
    .status(200)
    .json(
      new ApiResponse(
        HttpStatus.OK,
        "Fetched all sessions successfully",
        formattedSessions
      )
    );
});
