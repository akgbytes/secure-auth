import { logger } from "@/config/logger";
import { db } from "@/db";
import { sessionTable } from "@/db/schema/session.schema";
import { ApiError, ApiResponse, asyncHandler, HttpStatus } from "@/utils/core";
import { transformSessions } from "@/utils/sessions";
import { and, desc, eq } from "drizzle-orm";

export const getAllSessions = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Unauthorized");
  }
  const currentSessionId = user.sessionId;

  const allSessions = await db
    .select()
    .from(sessionTable)
    .where(eq(sessionTable.userId, user.id))
    .orderBy(desc(sessionTable.createdAt));

  // Setting true flag to current session
  const allSesssionsWithCurrentFlag = allSessions.map((session) => ({
    ...session,
    current: session.id === currentSessionId,
  }));

  const formattedSessions = await transformSessions(
    allSesssionsWithCurrentFlag
  );

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

export const logoutFromSpecificSession = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Unauthorized");
  }

  const sessionId = req.params.id as string;
  if (!sessionId) {
    throw new ApiError(HttpStatus.BAD_REQUEST, "Session ID is required");
  }

  const result = await db
    .delete(sessionTable)
    .where(
      and(eq(sessionTable.userId, user.id), eq(sessionTable.id, sessionId))
    )
    .returning();

  if (result.length === 0) {
    throw new ApiError(HttpStatus.NOT_FOUND, "Session not found");
  }

  logger.info("Signed out successfully", { userId: user.id, sessionId });

  res
    .status(HttpStatus.OK)
    .json(new ApiResponse(HttpStatus.OK, "Signed out successfully", null));
});
