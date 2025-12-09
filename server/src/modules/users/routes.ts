import {
  changePassword,
  deleteAccount,
  getMe,
  updateAvatar,
} from "@/modules/users/controller";
import { isLoggedIn } from "@/middlewares/auth.middleware";
import { upload } from "@/middlewares/multer.middleware";
import { Router } from "express";

const router = Router();

router.get("/me", isLoggedIn, getMe);
router.delete("/account/delete", isLoggedIn, deleteAccount);
router.patch("/me/password", isLoggedIn, changePassword);
router.patch("/me/avatar", isLoggedIn, upload.single("avatar"), updateAvatar);

export default router;
