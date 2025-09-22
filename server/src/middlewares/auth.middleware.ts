import { logger } from "@/config/logger";
import { db } from "@/db";
import { sessionTable } from "@/db/schema/session.schema";
import { clearAuthCookies, setAuthCookies } from "@/utils/cookies";
import { ApiError, asyncHandler, HttpStatus } from "@/utils/core";
import { sessionExpiresAfter } from "@/utils/helpers";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessJWT,
  verifyRefreshJWT,
} from "@/utils/token";
import { eq } from "drizzle-orm";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  const {
    accessToken: incomingAccessToken,
    refreshToken: incomingRefreshToken,
  } = req.cookies;

  try {
    if (!incomingAccessToken) {
      if (!incomingRefreshToken) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "Refresh token is missing");
      }

      let payload = verifyRefreshJWT(incomingRefreshToken);

      const [validSession] = await db
        .select()
        .from(sessionTable)
        .where(eq(sessionTable.id, payload.sessionId));

      if (!validSession) {
        throw new ApiError(401, "Refresh token has been used or is invalid");
      }

      if (new Date(validSession.expiresAt) < new Date()) {
        throw new ApiError(401, "Session expired. Please login again.");
      }

      const incomingUserAgent = req.headers["user-agent"] || "";
      const incomingIp =
        (req.headers["x-forwarded-for"] as string) || req.ip || "";

      if (
        validSession.userAgent !== incomingUserAgent ||
        validSession.ipAddress !== incomingIp
      ) {
        await db
          .delete(sessionTable)
          .where(eq(sessionTable.id, validSession.id));
        logger.warn("Session mismatch detected. Possible stolen token.", {
          sessionId: validSession.id,
          userId: validSession.userId,
        });
        throw new ApiError(
          HttpStatus.UNAUTHORIZED,
          "Session mismatch. Please log in again."
        );
      }

      await db
        .update(sessionTable)
        .set({
          expiresAt: sessionExpiresAfter(),
        })
        .where(eq(sessionTable.id, validSession.id));

      const accessToken = generateAccessToken({
        id: validSession.userId,
        sessionId: validSession.id,
        email: payload.email,
        role: payload.role,
      });

      const newRefreshToken = generateRefreshToken({
        id: validSession.userId,
        sessionId: validSession.id,
        email: payload.email,
        role: payload.role,
      });

      setAuthCookies(res, accessToken, newRefreshToken);
      req.user = payload;
    } else {
      let payload = verifyAccessJWT(incomingAccessToken);
      req.user = payload;
    }
  } catch (err) {
    clearAuthCookies(res);
    throw err;
  }

  next();
});
