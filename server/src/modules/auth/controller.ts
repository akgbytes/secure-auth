import axios from "axios";
import {
  ApiError,
  ApiResponse,
  asyncHandler,
  HttpStatus,
  logger,
} from "@/utils/core";
import {
  getClientInfo,
  hashPassword,
  sessionExpiresAfter,
  verifyPasswordHash,
} from "@/utils/helpers";
import {
  generateAccessToken,
  generateRefreshToken,
  generateToken,
  hashToken,
  verifyRefreshJWT,
} from "@/utils/token";
import { sendResetPasswordMail, sendVerificationMail } from "@/utils/mail";
import {
  validateEmail,
  validateLogin,
  validateRegister,
  validateResetPassword,
  validateVerifyEmail,
} from "./validator";
import { db } from "@/db";
import { userTable } from "@/db/schema/user.schema";
import { tokenTable } from "@/db/schema/token.schema";
import { and, eq, gt } from "drizzle-orm";
import { sessionTable } from "@/db/schema/session.schema";
import { clearAuthCookies, setAuthCookies } from "@/utils/cookies";
import {
  cookieOptionsForOauth,
  handleOAuthUser,
  randomString,
} from "@/utils/oauth";
import { env } from "@/config/env";
import querystring from "querystring";
import { GoogleTokenResponse } from "@/types";
import { verifyIdToken } from "@/utils/oauth/verifyIdToken";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = validateRegister(req.body);

  logger.info("Registration attempt", { email });

  const [existingUser] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email))
    .limit(1);

  if (existingUser)
    throw new ApiError(HttpStatus.CONFLICT, "Email is already registered");

  const hashedPassword = await hashPassword(password);

  const [user] = await db
    .insert(userTable)
    .values({ name, email, password: hashedPassword })
    .returning({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      emailVerified: userTable.emailVerified,
      role: userTable.role,
      avatar: userTable.avatar,
      provider: userTable.provider,
    });

  if (!user) {
    logger.warn("Failed to create user", { email });
    throw new ApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Unable to register. Please try again."
    );
  }

  // Generate token for email verification
  const { rawToken, tokenHash, tokenExpiry } = generateToken();

  const [token] = await db
    .insert(tokenTable)
    .values({
      token: tokenHash,
      type: "verify_email",
      userId: user.id,
      expiresAt: tokenExpiry,
    })
    .returning();

  if (!token) {
    logger.warn("Failed to create verification token", { email });
    throw new ApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Unable to register. Please try again."
    );
  }

  await sendVerificationMail(user.email, rawToken);

  logger.info("Registration successful. Verification email sent.", {
    email,
    userId: user.id,
  });

  const response = new ApiResponse(
    HttpStatus.CREATED,
    "Registered successfully, Please verify your email.",
    user
  );

  res.status(response.statusCode).json(response);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = validateLogin(req.body);

  logger.info("Login attempt", { email });

  const { userAgent, ipAddress } = getClientInfo(req);

  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  if (!user) {
    logger.warn("Login failed: User not found", { email });
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  if (!user.emailVerified) {
    logger.warn("Login blocked: Email not verified", { email });
    throw new ApiError(
      HttpStatus.UNAUTHORIZED,
      "Your email is not verified. Please verify before login."
    );
  }

  // If user had logged in via oauth, password will be null, so provide fallback
  await verifyPasswordHash(user.password || "", password, "login");

  // if session exists then update expiry time otherwise create new
  const [session] = await db
    .insert(sessionTable)
    .values({
      userId: user.id,
      ipAddress,
      userAgent,
      expiresAt: sessionExpiresAfter(),
    })
    .onConflictDoUpdate({
      target: [
        sessionTable.userId,
        sessionTable.userAgent,
        sessionTable.ipAddress,
      ],
      set: {
        expiresAt: sessionExpiresAfter(),
      },
    })
    .returning();

  if (!session) {
    logger.error("Login failed: Could not create or update session", { email });
    throw new ApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Unable to login. Please try again later."
    );
  }
  const accessToken = generateAccessToken({
    id: user.id,
    sessionId: session.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
    sessionId: session.id,
    email: user.email,
    role: user.role,
  });

  setAuthCookies(res, accessToken, refreshToken);

  const response = new ApiResponse(
    HttpStatus.OK,
    "Logged in successfully",
    null
  );

  res.status(response.statusCode).json(response);
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken as string;

  if (!refreshToken) {
    logger.warn("Logout attempt without refresh token");
  } else {
    try {
      const payload = verifyRefreshJWT(refreshToken);
      await db
        .delete(sessionTable)
        .where(eq(sessionTable.id, payload.sessionId));
    } catch (err: any) {
      const errorMsg =
        err instanceof ApiError ? err.message : "Invalid session";
      logger.warn("Error verifying or deleting session", { error: errorMsg });
    }
  }

  clearAuthCookies(res);
  logger.info("Logged out successfully");

  const response = new ApiResponse(
    HttpStatus.OK,
    "Logged out successfully",
    null
  );

  res.status(response.statusCode).json(response);
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = validateVerifyEmail(req.body);

  const tokenHash = hashToken(token);

  const [tokenInDb] = await db
    .select()
    .from(tokenTable)
    .where(
      and(
        eq(tokenTable.token, tokenHash),
        eq(tokenTable.type, "verify_email"),
        gt(tokenTable.expiresAt, new Date())
      )
    );

  if (!tokenInDb) {
    throw new ApiError(400, "Invalid or expired link");
  }

  await db.transaction(async (tx) => {
    await db
      .update(userTable)
      .set({ emailVerified: true })
      .where(eq(userTable.id, tokenInDb.userId));

    await db.delete(tokenTable).where(eq(tokenTable.id, tokenInDb.id));
  });

  const response = new ApiResponse(
    HttpStatus.OK,
    "Email verified successfully",
    null
  );

  res.status(response.statusCode).json(response);
});

export const resendVerificationEmail = asyncHandler(async (req, res) => {
  const email = validateEmail(req.body.email);

  logger.info("Request for resend verification email", { email });

  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  if (!user) {
    logger.warn("Resend verification requested for non-existing user", {
      email,
    });

    const response = new ApiResponse(
      200,
      "If an account exists, a verification email has been sent.",
      null
    );

    return res.status(response.statusCode).json(response);
  }

  if (user.emailVerified) {
    logger.warn("Resend verification requested for already verified email", {
      email,
    });

    throw new ApiError(HttpStatus.BAD_REQUEST, "Email is already verified");
  }

  // Delete if there is already token for email verification in db
  await db.delete(tokenTable).where(eq(tokenTable.userId, user.id));

  const { rawToken, tokenHash, tokenExpiry } = generateToken();

  const [token] = await db
    .insert(tokenTable)
    .values({
      token: tokenHash,
      type: "verify_email",
      userId: user.id,
      expiresAt: tokenExpiry,
    })
    .returning();

  if (!token) {
    logger.error(
      "Failed to resend verification mail: Could not create verification token",
      { email }
    );
    throw new ApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong, Please try again later."
    );
  }

  await sendVerificationMail(user.email, rawToken);

  logger.info("Verification email resent", { email });

  const response = new ApiResponse(
    HttpStatus.OK,
    "If an account exists, a verification email has been sent.",
    null
  );

  res.status(response.statusCode).json(response);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const email = validateEmail(req.body.email);

  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  if (!user) {
    const response = new ApiResponse(
      200,
      "If an account exists, a reset link has been sent to the email.",
      null
    );

    return res.status(response.statusCode).json(response);
  }

  // Delete if there is already token for reset password in db
  await db.delete(tokenTable).where(eq(tokenTable.userId, user.id));

  const { rawToken, tokenHash, tokenExpiry } = generateToken();
  const [token] = await db
    .insert(tokenTable)
    .values({
      token: tokenHash,
      type: "reset_password",
      userId: user.id,
      expiresAt: tokenExpiry,
    })
    .returning();

  if (!token) {
    logger.warn("Failed to create reset password token", { email });
    throw new ApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong, Please try again later."
    );
  }

  await sendResetPasswordMail(user.email, rawToken);

  logger.info("Password reset email sent", { email });

  const response = new ApiResponse(
    HttpStatus.OK,
    "If an account exists, a reset link has been sent to the email",
    null
  );

  return res.status(response.statusCode).json(response);
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = validateResetPassword(req.body);

  const tokenHash = hashToken(token);

  const [tokenInDb] = await db
    .select({
      token: tokenTable,
      user: {
        id: userTable.id,
        email: userTable.email,
        password: userTable.password,
        isEmailVerified: userTable.emailVerified,
      },
    })
    .from(tokenTable)
    .innerJoin(userTable, eq(tokenTable.userId, userTable.id))
    .where(
      and(
        eq(tokenTable.token, tokenHash),
        eq(tokenTable.type, "reset_password"),
        gt(tokenTable.expiresAt, new Date())
      )
    );

  if (!tokenInDb) {
    throw new ApiError(
      HttpStatus.UNAUTHORIZED,
      "Reset link has expired or is invalid"
    );
  }

  // If user have valid token for password reset means we can also verify his email
  await db
    .update(userTable)
    .set({ emailVerified: true })
    .where(eq(userTable.id, tokenInDb.user.id));

  // Check if old and new password are same
  await verifyPasswordHash(tokenInDb.user.password || "", password, "reset");

  const hashedPassword = await hashPassword(password);

  await db
    .transaction(async (tx) => {
      // Update password
      await tx
        .update(userTable)
        .set({
          password: hashedPassword,
        })
        .where(eq(userTable.id, tokenInDb.user.id));

      // Delete token
      await tx.delete(tokenTable).where(eq(tokenTable.id, tokenInDb.token.id));

      // Delete all existing sessions
      await tx
        .delete(sessionTable)
        .where(eq(sessionTable.userId, tokenInDb.user.id));
    })
    .catch((error) => {
      logger.error("Error during password reset transaction", {
        email: tokenInDb.user.email,
        error,
      });
      throw new ApiError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Unable to reset password. Please try again later."
      );
    });

  logger.info("Password reset successful", { email: tokenInDb.user.email });

  const response = new ApiResponse(
    HttpStatus.OK,
    "Password reset successful",
    null
  );

  return res.status(response.statusCode).json(response);
});

export const googleLogin = asyncHandler(async (req, res) => {
  const state = randomString(16);

  res.cookie("google_oauth_state", state, cookieOptionsForOauth);

  const params = {
    response_type: "code",
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: env.REDIRECT_URI + "/google/callback",
    scope: "openid email profile",
    state,
    access_type: "offline",
    prompt: "consent",
  };

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${querystring.stringify(
    params
  )}`;

  return res.redirect(url);
});

export const googleCallback = asyncHandler(async (req, res) => {
  const { code, state: returnedState } = req.query as {
    code?: string;
    state?: string;
  };

  const cookieState = req.cookies["google_oauth_state"];

  if (
    !code ||
    !returnedState ||
    !cookieState ||
    returnedState !== cookieState
  ) {
    res.clearCookie("google_oauth_state", { path: "/" });
    return res.redirect(
      `${env.APP_ORIGIN}/auth/callback?provider=google&success=false`
    );
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      querystring.stringify({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: env.REDIRECT_URI + "/google/callback",
        grant_type: "authorization_code",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const tokens = tokenResponse.data as GoogleTokenResponse;
    if (!tokens.id_token) throw new Error("Missing id_token from Google");

    const profile = await verifyIdToken(tokens.id_token || "");

    await handleOAuthUser(profile, req, res, "google");
  } catch (err: any) {
    logger.error("Failed to complete OAuth exchange");
    res.clearCookie("google_oauth_state", { path: "/" });
    return res.redirect(
      `${env.APP_ORIGIN}/auth/callback?provider=google&success=false`
    );
  }
});

export const githubLogin = asyncHandler(async (req, res) => {
  const state = randomString(16);
  res.cookie("github_oauth_state", state, cookieOptionsForOauth);

  const params = {
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: env.REDIRECT_URI + "/github/callback",
    scope: "read:user user:email",
    state,
  };

  const url = `https://github.com/login/oauth/authorize?${querystring.stringify(
    params
  )}`;

  return res.redirect(url);
});

export const githubCallback = asyncHandler(async (req, res) => {
  const { code, state: returnedState } = req.query as {
    code?: string;
    state?: string;
  };
  const cookieState = req.cookies["github_oauth_state"];

  if (
    !code ||
    !returnedState ||
    !cookieState ||
    returnedState !== cookieState
  ) {
    res.clearCookie("github_oauth_state", { path: "/" });
    return res.redirect(
      `${env.APP_ORIGIN}/auth/callback?provider=github&success=false`
    );
  }

  try {
    // Exchange code for access token
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: env.REDIRECT_URI + "/github/callback",
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) throw new Error("Missing access token from GitHub");

    // Fetch user profile
    const profileRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const emailsRes = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const primaryEmail = emailsRes.data.find(
      (e: any) => e.primary && e.verified
    )?.email;
    if (!primaryEmail)
      throw new ApiError(
        HttpStatus.BAD_REQUEST,
        "No verified email from GitHub"
      );

    const profile = {
      email: primaryEmail,
      name: profileRes.data.name || profileRes.data.login,
      picture: profileRes.data.avatar_url,
      emailVerified: true,
    };

    await handleOAuthUser(profile, req, res, "github");
  } catch (err) {
    res.clearCookie("github_oauth_state", { path: "/" });
    return res.redirect(
      `${env.APP_ORIGIN}/auth/callback?provider=github&success=false`
    );
  }
});

// Refreshing tokens in middleware now
// export const refreshTokens = asyncHandler(async (req, res) => {
//   const incomingRefreshToken = req.cookies.refreshToken as string;

//   if (!incomingRefreshToken) {
//     throw new ApiError(HttpStatus.UNAUTHORIZED, "Refresh token is missing");
//   }

//   const payload = verifyRefreshJWT(incomingRefreshToken);

//   const [validSession] = await db
//     .select()
//     .from(sessionTable)
//     .where(eq(sessionTable.id, payload.sessionId));

//   if (!validSession) {
//     throw new ApiError(401, "Refresh token has been used or is invalid");
//   }

//   if (new Date(validSession.expiresAt) < new Date()) {
//     throw new ApiError(401, "Session expired. Please login again.");
//   }

//   const incomingUserAgent = req.headers["user-agent"] || "";
//   const incomingIp = req.ip || "";

//   if (
//     validSession.userAgent !== incomingUserAgent ||
//     validSession.ipAddress !== incomingIp
//   ) {
//     await db.delete(sessionTable).where(eq(sessionTable.id, validSession.id));
//     logger.warn("Session mismatch detected. Possible stolen token.", {
//       sessionId: validSession.id,
//       userId: validSession.userId,
//     });
//     throw new ApiError(
//       HttpStatus.UNAUTHORIZED,
//       "Session mismatch. Please log in again."
//     );
//   }

//   await db
//     .update(sessionTable)
//     .set({
//       expiresAt: sessionExpiresAfter(),
//     })
//     .where(eq(sessionTable.id, validSession.id));

//   const accessToken = generateAccessToken({
//     id: validSession.userId,
//     sessionId: validSession.id,
//     email: payload.email,
//     role: payload.role,
//   });

//   const newRefreshToken = generateRefreshToken({
//     id: validSession.userId,
//     sessionId: validSession.id,
//     email: payload.email,
//     role: payload.role,
//   });

//   setAuthCookies(res, accessToken, newRefreshToken);

//   res
//     .status(HttpStatus.OK)
//     .json(
//       new ApiResponse(
//         HttpStatus.OK,
//         "Access token refreshed successfully",
//         null
//       )
//     );
// });
