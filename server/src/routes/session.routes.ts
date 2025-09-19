import {
  getAllSessions,
  logoutFromSpecificSession,
} from "@/controllers/session.controller";
import { isLoggedIn } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.get("/", isLoggedIn, getAllSessions);
router.delete("/:id", isLoggedIn, logoutFromSpecificSession);

export default router;
