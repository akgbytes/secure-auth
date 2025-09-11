import { isLoggedIn } from "@/middlewares/auth.middleware";
import { isAdmin } from "@/middlewares/role.middleware";
import { Router } from "express";
import {
  getAllUsers,
  deleteUserById,
  getUserById,
  logoutUserSession,
  updateUserRole,
} from "./admin.controller";

const router = Router();

router.get("/users", isLoggedIn, isAdmin, getAllUsers);
router.get("/users/:id", isLoggedIn, isAdmin, getUserById);
router.post("/users/session/:id", isLoggedIn, isAdmin, logoutUserSession);
router.patch("/users/:id", isLoggedIn, isAdmin, updateUserRole);
router.delete("/users/:id", isLoggedIn, isAdmin, deleteUserById);

export default router;
