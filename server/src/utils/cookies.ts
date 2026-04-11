import type { CookieOptions, Response } from "express";
import ms, { type StringValue } from "ms";
import { env } from "@/config/env";

const cookieOptions = {
	accessTokenExpiryMs: ms(env.ACCESS_TOKEN_EXPIRY as StringValue),
	refreshTokenExpiryMs: ms(env.REFRESH_TOKEN_EXPIRY as StringValue),
	secure: env.NODE_ENV === "production",
	httpOnly: true,
	sameSite: "none",
};

export const setAuthCookies = (
	res: Response,
	accessToken: string,
	refreshToken: string,
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
