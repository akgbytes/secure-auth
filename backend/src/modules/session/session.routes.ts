import { Router } from "express";

import { isLoggedIn } from "@/middlewares/auth.middleware";
import {
  getAllSessions,
  logoutAllOtherSessions,
  logoutFromSpecificSession,
} from "./session.controller";

const router = Router();

router.get("/", isLoggedIn, getAllSessions);
router.delete("/", isLoggedIn, logoutAllOtherSessions);
router.delete("/:id", isLoggedIn, logoutFromSpecificSession);

export default router;
