import { Router } from "express";
import {
  refreshTokens,
  verifyEmail,
  forgotPassword,
  signup,
  signin,
} from "./auth.controller";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/refresh", refreshTokens);
router.post("/email/verify", verifyEmail);

router.post("/password/forgot", forgotPassword);

export default router;
