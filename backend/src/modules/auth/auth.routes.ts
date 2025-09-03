import { Router } from "express";
import {
  login,
  register,
  refreshAccessToken,
  verifyEmail,
} from "./auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);
router.get("/email/verify/:token", verifyEmail);

export default router;
