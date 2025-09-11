import { Router } from "express";

import { isLoggedIn } from "@/middlewares/auth.middleware";
import {
  getAllSessions,
  getSession,
  logoutAllOtherSessions,
  logoutFromSpecificSession,
} from "./session.controller";

const router = Router();

router.get("/", isLoggedIn, getAllSessions);
router.get("/:id", isLoggedIn, getSession);
router.delete("/", isLoggedIn, logoutAllOtherSessions);
router.delete("/:id", isLoggedIn, logoutFromSpecificSession);

export default router;
