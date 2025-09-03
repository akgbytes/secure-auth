import { Router } from "express";
import {
  login,
  register,
  refreshTokens,
  verifyEmail,
  forgotPassword,
} from "./auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshTokens);
router.get("/email/verify/:token", verifyEmail);

router.post("/password/forgot", forgotPassword);

export default router;
