import { env } from "@/config/env";
import { CookieOptions, Response } from "express";
import ms from "ms";

const cookieOptions = {
  accessTokenExpiryMs: ms(env.ACCESS_TOKEN_EXPIRY as ms.StringValue),
  refreshTokenExpiryMs: ms(env.REFRESH_TOKEN_EXPIRY as ms.StringValue),
  secure: env.NODE_ENV === "production",
  httpOnly: true,
  sameSite: "none",
};

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite as CookieOptions["sameSite"],
    maxAge: cookieOptions.accessTokenExpiryMs,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite as CookieOptions["sameSite"],
    maxAge: cookieOptions.refreshTokenExpiryMs,
  });
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite as CookieOptions["sameSite"],
  });

  res.clearCookie("refreshToken", {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite as CookieOptions["sameSite"],
  });
};
