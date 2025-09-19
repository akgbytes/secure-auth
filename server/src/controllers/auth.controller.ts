import { env } from "@/config/env";
import { logger } from "@/config/logger";
import { db } from "@/db";
import { sessionTable } from "@/db/schema/session.schema";
import { tokenTable } from "@/db/schema/token.schema";
import { userTable } from "@/db/schema/user.schema";
import { clearAuthCookies, setAuthCookies } from "@/utils/cookies";
import {
  ApiError,
  ApiResponse,
  asyncHandler,
  handleZodError,
  HttpStatus,
} from "@/utils/core";
import { sessionExpiresAfter } from "@/utils/helpers";
import { sendResetPasswordMail, sendVerificationMail } from "@/utils/mail";
import {
  cookieOptionsForOauth,
  generateCodeVerifier,
  pkceChallenge,
  randomString,
} from "@/utils/oauth";
import { hashPassword, verifyPasswordHash } from "@/utils/password";
import {
  generateAccessToken,
  generateRefreshToken,
  generateToken,
  hashToken,
  verifyRefreshJWT,
} from "@/utils/token";

import {
  validateEmail,
  validateLogin,
  validateRegister,
  validateResetPassword,
  validateVerifyEmail,
} from "@/validations/auth.validations";
import { and, eq, gt } from "drizzle-orm";
import querystring from "querystring";
import axios from "axios";
import { UserGoogleProfile } from "@/types";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = handleZodError(validateRegister(req.body));

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
      avatar: userTable.avatar,
      role: userTable.role,
      provider: userTable.provider,
    });

  if (!user) {
    logger.warn("Failed to create user", { email });
    throw new ApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Unable to register. Please try again."
    );
  }
  // generate token for email verification
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

  res
    .status(HttpStatus.CREATED)
    .json(
      new ApiResponse(
        HttpStatus.CREATED,
        "Registered successfully, Please verify your email.",
        user
      )
    );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = handleZodError(validateLogin(req.body));

  logger.info("Login attempt", { email });

  const userAgent = req.headers["user-agent"] || "";
  const ipAddress = (req.headers["x-forwarded-for"] as string) || req.ip || "";

  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  if (!user) {
    logger.warn("Login failed: User not found", { email });
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  // if user had logged in via oauth, password will be null, so provide fallback
  await verifyPasswordHash(user.password || "", password, "login");

  if (!user.emailVerified) {
    logger.warn("Login blocked: Email not verified", { email });
    throw new ApiError(
      HttpStatus.UNAUTHORIZED,
      "Your email is not verified. Please verify before login."
    );
  }

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

  res
    .status(HttpStatus.CREATED)
    .json(new ApiResponse(HttpStatus.CREATED, "Logged in successfully", null));
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

      logger.info("Logged out successfully", { userId: payload.userId });
    } catch (err: any) {
      const errorMsg =
        err instanceof ApiError ? err.message : "Invalid session";
      logger.warn("Error verifying or deleting session", { error: errorMsg });
    }
  }

  clearAuthCookies(res);

  res
    .status(HttpStatus.OK)
    .json(new ApiResponse(HttpStatus.OK, "Logged out successfully", null));
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = handleZodError(validateVerifyEmail(req.body));

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

  res
    .status(HttpStatus.OK)
    .json(new ApiResponse(HttpStatus.OK, "Email verified successfully", null));
});

export const resendVerificationEmail = asyncHandler(async (req, res) => {
  const email = handleZodError(validateEmail(req.body.email));

  logger.info("Request for resend verification email", { email });

  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  if (!user) {
    logger.warn("Resend verification requested for non-existing user", {
      email,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "If an account exists, a verification email has been sent.",
          null
        )
      );
  }

  if (user.emailVerified) {
    logger.warn("Resend verification requested for already verified email", {
      email,
    });

    throw new ApiError(HttpStatus.BAD_REQUEST, "Email is already verified");
  }

  // delete if there is already token for email verification in db
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

  res
    .status(HttpStatus.OK)
    .json(
      new ApiResponse(
        HttpStatus.OK,
        "If an account exists, a verification email has been sent.",
        null
      )
    );
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const email = handleZodError(validateEmail(req.body.email));

  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  if (!user) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "If an account exists, a reset link has been sent to the email.",
          null
        )
      );
  }

  //  delete if there is already token for reset password in db
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
  res
    .status(HttpStatus.OK)
    .json(
      new ApiResponse(
        HttpStatus.OK,
        "If an account exists, a reset link has been sent to the email",
        null
      )
    );
});

export const resetPassword = asyncHandler(async (req, res) => {
  console.log("hello");
  const { token, password } = handleZodError(validateResetPassword(req.body));

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

  // if user have valid token for password reset means we can also verify his email
  await db
    .update(userTable)
    .set({ emailVerified: true })
    .where(eq(userTable.id, tokenInDb.user.id));

  // check if old and new password are same
  await verifyPasswordHash(tokenInDb.user.password || "", password, "reset");

  const hashedPassword = await hashPassword(password);

  await db
    .transaction(async (tx) => {
      // update password
      await tx
        .update(userTable)
        .set({
          password: hashedPassword,
        })
        .where(eq(userTable.id, tokenInDb.user.id));

      // delete token
      await tx.delete(tokenTable).where(eq(tokenTable.id, tokenInDb.token.id));

      // delete all existing sessions
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
  res
    .status(HttpStatus.OK)
    .json(new ApiResponse(HttpStatus.OK, "Password reset successful", null));
});

export const refreshTokens = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken as string;

  if (!incomingRefreshToken) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Refresh token is missing");
  }

  const payload = verifyRefreshJWT(incomingRefreshToken);

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
  const incomingIp = (req.headers["x-forwarded-for"] as string) || req.ip || "";

  if (
    validSession.userAgent !== incomingUserAgent ||
    validSession.ipAddress !== incomingIp
  ) {
    await db.delete(sessionTable).where(eq(sessionTable.id, validSession.id));
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

  res
    .status(HttpStatus.OK)
    .json(
      new ApiResponse(
        HttpStatus.OK,
        "Access token refreshed successfully",
        null
      )
    );
});

export const getMe = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Unauthorized");
  }

  const [userDetails] = await db
    .select({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      emailVerified: userTable.emailVerified,
      avatar: userTable.avatar,
      role: userTable.role,
      provider: userTable.provider,
      createdAt: userTable.createdAt,
      updatedAt: userTable.updatedAt,
    })
    .from(userTable)
    .where(eq(userTable.id, user.id));

  if (!userDetails)
    throw new ApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );

  res
    .status(HttpStatus.OK)
    .json(
      new ApiResponse(
        HttpStatus.OK,
        "User profile fetched successfully",
        userDetails
      )
    );
});

export const googleLogin = asyncHandler(async (req, res) => {
  const state = randomString(16);
  const codeVerifier = generateCodeVerifier(64);
  const codeChallenge = pkceChallenge(codeVerifier);

  // Set HttpOnly cookies bound to this browser
  res.cookie("google_oauth_state", state, cookieOptionsForOauth);
  res.cookie("google_code_verifier", codeVerifier, cookieOptionsForOauth);

  const params = {
    response_type: "code",
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: env.REDIRECT_URI,
    scope: "openid email profile",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    access_type: "offline",
    prompt: "consent",
  };

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${querystring.stringify(
    params
  )}`;

  console.log("final redirect url to google: ", url);

  return res.redirect(url);
});

export const googleCallback = asyncHandler(async (req, res) => {
  const { code, state: returnedState } = req.query as {
    code?: string;
    state?: string;
  };

  console.log("request query from callback: ", req.query);

  const cookieState = req.cookies["google_oauth_state"];
  const cookieCodeVerifier = req.cookies["google_code_verifier"];

  if (!code || !returnedState) {
    return res.status(400).send("Missing code or state in callback.");
  }

  if (!cookieState || !cookieCodeVerifier) {
    return res
      .status(400)
      .send("Missing oauth cookies. Start the login flow again.");
  }

  if (returnedState !== cookieState) {
    res.clearCookie("google_oauth_state", { path: "/" });
    res.clearCookie("google_code_verifier", { path: "/" });
    return res.status(400).send("Invalid state (possible CSRF).");
  }

  res.clearCookie("google_oauth_state", { path: "/" });
  res.clearCookie("google_code_verifier", { path: "/" });

  try {
    // Exchange the authorization code for tokens (include code_verifier for PKCE)
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      querystring.stringify({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: env.REDIRECT_URI,
        grant_type: "authorization_code",
        code_verifier: cookieCodeVerifier,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    console.log("token resposne from google: ", tokenResponse);

    const tokens = tokenResponse.data;
    const accessToken = tokens.access_token;

    // Get the user's profile
    const profileRes = await axios.get<UserGoogleProfile>(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const profile = profileRes.data;

    console.log("profile: ", profile);

    // check if user already exists

    const [exisitingUser] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, profile.email))
      .limit(1);

    // if user entry exists but not verified then verify it
    if (exisitingUser) {
      if (!exisitingUser.emailVerified) {
        await db
          .update(userTable)
          .set({
            emailVerified: true,
          })
          .where(eq(userTable.id, exisitingUser.id));
      }

      // issue new tokens
    } else {
      const [user] = await db
        .insert(userTable)
        .values({
          email: profile.email,
          name: profile.name,
          avatar: profile.picture,
          provider: "google",
          emailVerified: true,
        })
        .returning();

      if (!user)
        throw new ApiError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          "Something went wrong"
        );

      // issue new token
    }

    const redirectTo = env.APP_ORIGIN || "http://localhost:5173";
    return res.redirect(`${redirectTo}/auth/success`);
  } catch (err: any) {
    console.error(
      "Google callback error:",
      err.response?.data || err.message || err
    );
    // clear cookies on error
    res.clearCookie("google_oauth_state", { path: "/" });
    res.clearCookie("google_code_verifier", { path: "/" });
    return res.status(500).send("Failed to complete OAuth exchange.");
  }
});

export const example = asyncHandler(async (req, res) => {
  res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, "", null));
});
