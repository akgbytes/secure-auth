import { isLoggedIn } from "@/middlewares/auth.middleware";

import { Router } from "express";
import {
  getAllUsers,
  logoutUserSession,
  getUserSessionsById,
} from "../controllers/admin.controller";
import { isAdmin } from "@/middlewares/role.middleware";

const router = Router();

router.get("/users", isLoggedIn, isAdmin, getAllUsers);

// User sessions
router.get("/users/:userId/sessions", isLoggedIn, isAdmin, getUserSessionsById);
router.delete(
  "/users/sessions/:sessionId",
  isLoggedIn,
  isAdmin,
  logoutUserSession
);

export default router;
