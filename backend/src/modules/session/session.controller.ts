import {
  ApiError,
  ApiResponse,
  asyncHandler,
  HttpStatus,
  logger,
} from "@/core";

import { db } from "@/db";
import { sessionTable } from "@/db/schema";
import { and, desc, eq, ne } from "drizzle-orm";
import { clearAuthCookies } from "@/utils/cookies";
import { transformSessions } from "./session.utils";

export const logoutOtherSessions = asyncHandler(async (req, res) => {
  const user = req.user;
  const sessionId = req.userSessionId;

  if (!user || !sessionId) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Unauthorized");
  }

  await db
    .delete(sessionTable)
    .where(
      and(eq(sessionTable.userId, user.id), ne(sessionTable.id, sessionId))
    );

  logger.info({ email: user.email }, "Signed out from all other sessions");

  clearAuthCookies(res);

  res
    .status(HttpStatus.OK)
    .json(
      new ApiResponse(HttpStatus.OK, "Signed out from all other sessions", null)
    );
});

export const logoutFromSpecificSession = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Unauthorized");
  }
  const { sessionId } = req.params;
});

export const getActiveSessions = asyncHandler(async (req, res) => {
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
        "Fetched all active sessions successfully",
        formattedSessions
      )
    );
});
