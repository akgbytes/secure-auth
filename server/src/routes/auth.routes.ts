import {
  forgotPassword,
  getMe,
  googleCallback,
  googleLogin,
  login,
  logout,
  refreshTokens,
  register,
  resendVerificationEmail,
  resetPassword,
  verifyEmail,
} from "@/controllers/auth.controller";
import { isLoggedIn } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.post("/email/verify", verifyEmail);
router.post("/email/resend", resendVerificationEmail);

router.get("/password/forgot", forgotPassword);
router.get("/password/reset", resetPassword);

router.post("/refresh", refreshTokens);
router.get("/me", isLoggedIn, getMe);

// google login
router.get("/login/google", googleLogin);
router.get("/google/callback", googleCallback);

// github login
// router.get("/login/github");
// router.get("/github/callback");

export default router;
