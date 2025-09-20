import { changePassword, updateAvatar } from "@/controllers/user.controller";
import { isLoggedIn } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.post("/change-password", isLoggedIn, changePassword);
router.post("/update-avatar", isLoggedIn, updateAvatar);

export default router;
