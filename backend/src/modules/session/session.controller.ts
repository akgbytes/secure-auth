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

import { transformSessions } from "./session.utils";

export const logoutAllOtherSessions = asyncHandler(async (req, res) => {
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
  const sessionId = req.params.id as string;

  if (!user || !sessionId) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Unauthorized");
  }

  await db
    .delete(sessionTable)
    .where(
      and(eq(sessionTable.userId, user.id), eq(sessionTable.id, sessionId))
    );

  logger.info({ email: user.email }, "Signed out successfully");

  res
    .status(HttpStatus.OK)
    .json(new ApiResponse(HttpStatus.OK, "Signed out successfully", null));
});

export const getAllSessions = asyncHandler(async (req, res) => {
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
