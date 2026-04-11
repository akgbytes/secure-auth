import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import type { CookieOptions, Request, Response } from "express";
import { env } from "@/config/env";
import type { Provider } from "@/constants";
import { db } from "@/db";
import { sessionTable } from "@/db/schema/session.schema";
import { userTable } from "@/db/schema/user.schema";
import { setAuthCookies } from "../cookies";
import { ApiError, HttpStatus } from "../core";
import { sessionExpiresAfter } from "../helpers";
import { generateAccessToken, generateRefreshToken } from "../token";

export function randomString(len = 32) {
	return crypto.randomBytes(len).toString("hex");
}

export function generateCodeVerifier(len = 64): string {
	return crypto.randomBytes(len).toString("base64url");
}

// Generate PKCE challenge from verifier (SHA256 → base64url)
export function pkceChallenge(verifier: string): string {
	return crypto
		.createHash("sha256")
		.update(verifier)
		.digest("base64") // normal base64
		.replace(/\+/g, "-") // convert to base64url
		.replace(/\//g, "_")
		.replace(/=+$/, ""); // strip padding
}

export const cookieOptionsForOauth: CookieOptions = {
	httpOnly: true,
	secure: env.NODE_ENV === "production",
	maxAge: 10 * 60 * 1000, // 10 minutes in ms
	sameSite: "lax", // 'lax' works well for OAuth redirect flows
	path: "/",
};

export async function handleOAuthUser(
	profile: {
		email: string;
		name: string;
		picture: string;
		emailVerified: boolean;
	},
	req: Request,
	res: Response,
	provider: Provider,
) {
	const userAgent = req.headers["user-agent"] || "";
	const ipAddress = req.ip || "";

	const [existingUser] = await db
		.select()
		.from(userTable)
		.where(eq(userTable.email, profile.email))
		.limit(1);

	let userId: string;

	if (existingUser) {
		userId = existingUser.id;
		if (!existingUser.emailVerified) {
			await db
				.update(userTable)
				.set({ emailVerified: true })
				.where(eq(userTable.id, userId));
		}
	} else {
		const [user] = await db
			.insert(userTable)
			.values({
				email: profile.email,
				name: profile.name,
				avatar: profile.picture,
				provider,
				emailVerified: profile.emailVerified,
			})
			.returning();

		if (!user)
			throw new ApiError(
				HttpStatus.INTERNAL_SERVER_ERROR,
				"Failed to create user",
			);
		userId = user.id;
	}

	// Create or update session
	const expiry = sessionExpiresAfter();
	const [session] = await db
		.insert(sessionTable)
		.values({
			userId,
			ipAddress,
			userAgent,
			expiresAt: expiry,
		})
		.onConflictDoUpdate({
			target: [
				sessionTable.userId,
				sessionTable.userAgent,
				sessionTable.ipAddress,
			],
			set: { expiresAt: expiry },
		})
		.returning();

	if (!session)
		throw new ApiError(
			HttpStatus.INTERNAL_SERVER_ERROR,
			"Failed to create session",
		);

	// Issue JWT tokens
	const accessToken = generateAccessToken({
		id: userId,
		sessionId: session.id,
		email: profile.email,
		role: existingUser?.role || "user",
	});
	const refreshToken = generateRefreshToken({
		id: userId,
		sessionId: session.id,
		email: profile.email,
		role: existingUser?.role || "user",
	});
	setAuthCookies(res, accessToken, refreshToken);

	return res.redirect(
		`${env.APP_ORIGIN}/auth/callback?provider=${provider}&success=true`,
	);
}
