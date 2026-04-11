import { Router } from "express";
import { isLoggedIn } from "@/middlewares/auth.middleware";
import {
	getAllSessions,
	logoutFromSpecificSession,
} from "@/modules/sessions/controller";

const router = Router();

router.get("/", isLoggedIn, getAllSessions);
router.delete("/:id", isLoggedIn, logoutFromSpecificSession);

export default router;
