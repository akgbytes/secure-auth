import { hash, verify } from "@node-rs/argon2";
import type { Request } from "express";
import ms, { type StringValue } from "ms";
import { env } from "@/config/env";
import { ApiError, HttpStatus } from "./core";

export const sessionExpiresAfter = () =>
	new Date(Date.now() + ms(env.REFRESH_TOKEN_EXPIRY as StringValue));

export const hashPassword = async (password: string): Promise<string> => {
	return await hash(password);
};

export const verifyPasswordHash = async (
	hash: string,
	password: string,
	type: "login" | "reset",
): Promise<void> => {
	const isValid = await verify(hash, password);
	if (!isValid) {
		if (type === "login") {
			throw new ApiError(HttpStatus.UNAUTHORIZED, "Invalid credentials");
		}
		throw new ApiError(
			HttpStatus.BAD_REQUEST,
			"New password cannot be the same as the old password",
		);
	}
};

export const getClientInfo = (req: Request) => {
	const userAgent = req.headers["user-agent"] || "";
	const xForwardedFor = req.headers["x-forwarded-for"] as string | undefined;

	const ipAddress = xForwardedFor?.split(",")[0]?.trim() || req.ip || "";

	return { userAgent, ipAddress };
};
