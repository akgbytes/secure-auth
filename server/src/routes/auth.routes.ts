import { register } from "@/controllers/auth.controller";
import { Router } from "express";

const router = Router();

router.post("/register", register);
// router.post("/login");
// router.post("/logout");

// router.get("/me");

export default router;
