import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "@/config/env";
import { errorHandler } from "@/middlewares/error.middleware";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: env.APP_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"],
  })
);

import healthRoutes from "@/routes/health.routes";
import authRoutes from "@/routes/auth.routes";
import sessionRoutes from "@/routes/session.routes";
import adminRoutes from "@/routes/admin.routes";

app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/session", sessionRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use(errorHandler);
