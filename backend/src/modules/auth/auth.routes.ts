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

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);

router.post("/refresh", refreshTokens);

router.post("/email/verify", verifyEmail);
router.post("/email/resend", resendVerificationEmail);

router.post("/password/forgot", forgotPassword);
router.post("/password/reset", resetPassword);

router.post("/google", googleLogin);

router.get("/me", isLoggedIn, getMe);

export default router;
