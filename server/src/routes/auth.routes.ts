import {
  deleteAccount,
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
} from "@/controllers/auth.controller";
import { isLoggedIn } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.post("/email/verify", verifyEmail);
router.post("/email/resend", resendVerificationEmail);

router.post("/password/forgot", forgotPassword);
router.post("/password/reset", resetPassword);

router.delete("/account/delete", isLoggedIn, deleteAccount);

// google login
router.get("/google/login", googleLogin);
router.get("/google/callback", googleCallback);

// github login
router.get("/github/login", githubLogin);
router.get("/github/callback", githubCallback);

export default router;
