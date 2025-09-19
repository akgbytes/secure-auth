import { ApiError, asyncHandler, HttpStatus } from "@/utils/core";
import { verifyAccessJWT } from "@/utils/token";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  const { accessToken } = req.cookies;
  if (!accessToken)
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Access token missing");

  const payload = verifyAccessJWT(accessToken);

  req.user = payload;
  req.userSessionId = payload.sessionId;

  next();
});
