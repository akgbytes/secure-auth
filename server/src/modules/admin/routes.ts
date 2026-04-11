import { Router } from "express";
import { isLoggedIn } from "@/middlewares/auth.middleware";
import { isAdmin } from "@/middlewares/role.middleware";
import {
	getAllUsers,
	getUserSessionsById,
	logoutUserSession,
} from "../admin/controller";

const router = Router();

router.get("/users", isLoggedIn, isAdmin, getAllUsers);

// User sessions
router.get("/users/:userId/sessions", isLoggedIn, isAdmin, getUserSessionsById);
router.delete(
	"/users/sessions/:sessionId",
	isLoggedIn,
	isAdmin,
	logoutUserSession,
);

export default router;
