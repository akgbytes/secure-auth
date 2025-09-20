import { changePassword, updateAvatar } from "@/controllers/user.controller";
import { isLoggedIn } from "@/middlewares/auth.middleware";
import { upload } from "@/middlewares/multer.middleware";
import { Router } from "express";

const router = Router();

router.patch("/password", isLoggedIn, changePassword);
router.patch("/avatar", isLoggedIn, upload.single("avatar"), updateAvatar);

export default router;
