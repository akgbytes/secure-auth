import { logger } from "@/config/logger";
import { db } from "@/db";
import { sessionTable } from "@/db/schema/session.schema";
import { ApiError, ApiResponse, asyncHandler, HttpStatus } from "@/utils/core";
import { transformSessions } from "@/utils/sessions";
import { and, desc, eq } from "drizzle-orm";

export const getAllSessions = asyncHandler(async (req, res) => {
  console.log("im here");
  const user = req.user;
  const currentSessionId = req.userSessionId;

  if (!user || !currentSessionId) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Unauthorized");
  }

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

  if (!user || !sessionId) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Unauthorized");
  }

  await db
    .delete(sessionTable)
    .where(
      and(eq(sessionTable.userId, user.id), eq(sessionTable.id, sessionId))
    );

  logger.info("Signed out successfully", { id: user.id });

  res
    .status(HttpStatus.OK)
    .json(new ApiResponse(HttpStatus.OK, "Signed out successfully", null));
});
