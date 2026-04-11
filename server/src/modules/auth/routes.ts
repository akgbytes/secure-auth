import { Router } from "express";
import {
	authRateLimiter,
	forgotPasswordRateLimiter,
} from "@/middlewares/rateLimit.middleware";
import {
	forgotPassword,
	githubCallback,
	githubLogin,
	googleCallback,
	googleLogin,
	login,
	logout,
	register,
	resendVerificationEmail,
	resetPassword,
	verifyEmail,
} from "@/modules/auth/controller";

const router = Router();

router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);
router.post("/logout", logout);

router.post("/email/verify", verifyEmail);
router.post("/email/resend", resendVerificationEmail);

router.post("/password/forgot", forgotPasswordRateLimiter, forgotPassword);
router.post("/password/reset", resetPassword);

// google login
router.get("/google/login", googleLogin);
router.get("/google/callback", googleCallback);

// github login
router.get("/github/login", githubLogin);
router.get("/github/callback", githubCallback);

export default router;
