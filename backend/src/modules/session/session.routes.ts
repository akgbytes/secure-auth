import { Router } from "express";

import { isLoggedIn } from "@/middlewares/auth.middleware";

const router = Router();

router.get("/", isLoggedIn);
router.get("/:id", isLoggedIn);
router.delete("/", isLoggedIn);
router.delete("/:id", isLoggedIn);

export default router;
