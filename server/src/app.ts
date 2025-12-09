import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "@/config/env";
import { errorHandler } from "@/middlewares/error.middleware";

export const app = express();

app.set("trust proxy", true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: env.APP_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  })
);

import healthRoutes from "@/modules/health/routes";
import authRoutes from "@/modules/auth/routes";
import sessionRoutes from "@/modules/sessions/routes";
import adminRoutes from "@/modules/admin/routes";
import userRoutes from "@/modules/users/routes";

app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/sessions", sessionRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/users", userRoutes);

app.use(errorHandler);
