import {
  authRateLimiter,
  forgotPasswordRateLimiter,
  resendVerificationRateLimiter,
} from "@/middlewares/rateLimit.middleware";
import { Router } from "express";
import {
  refreshTokens,
  verifyEmail,
  forgotPassword,
  signup,
  signin,
  googleLogin,
  resendVerificationEmail,
  logout,
  resetPassword,
  getMe,
} from "./auth.controller";
import { isLoggedIn } from "@/middlewares/auth.middleware";

const router = Router();

router.post("/signup", authRateLimiter, signup);
router.post("/signin", authRateLimiter, signin);
router.post("/logout", logout);

router.post("/refresh", refreshTokens);

router.post("/email/verify", verifyEmail);
router.post(
  "/email/resend",
  resendVerificationRateLimiter,
  resendVerificationEmail
);

router.post("/password/forgot", forgotPasswordRateLimiter, forgotPassword);
router.post("/password/reset", resetPassword);

router.post("/google", googleLogin);

router.get("/me", isLoggedIn, getMe);

// router.post("/logout/all", isLoggedIn, logoutAllSessions);
// router.get("/sessions", isLoggedIn, getActiveSessions);
// router.post("/sessions/:sessionId", isLoggedIn, logoutSpecificSession);

export default router;
