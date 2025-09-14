import { isLoggedIn } from "@/middlewares/auth.middleware";
import { isAdmin } from "@/middlewares/role.middleware";
import { Router } from "express";
import {
  getAllUsers,
  logoutUserSession,
  getUserSessionsById,
} from "./admin.controller";

const router = Router();

router.get("/users", isLoggedIn, isAdmin, getAllUsers);
router.get("/users/:id/sessions", isLoggedIn, isAdmin, getUserSessionsById);
router.delete("/users/session/:id", isLoggedIn, isAdmin, logoutUserSession);

export default router;
