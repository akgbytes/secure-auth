import { Router } from "express";
import { checkHealth } from "@/modules/health/controller";

const router = Router();

router.get("/", checkHealth);

export default router;
