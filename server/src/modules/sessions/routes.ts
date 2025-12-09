import {
  getAllSessions,
  logoutFromSpecificSession,
} from "@/modules/sessions/controller";
import { isLoggedIn } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.get("/", isLoggedIn, getAllSessions);
router.delete("/:id", isLoggedIn, logoutFromSpecificSession);

export default router;
