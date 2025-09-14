import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { env } from "@/config/env";

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

import healthRoutes from "@/modules/health/health.routes";
import authRoutes from "@/modules/auth/auth.routes";
import sessionRoutes from "@/modules/session/session.routes";
import adminRoutes from "@/modules/admin/admin.routes";

app.use("/api/v1/health", healthRoutes);
app.use(
  "/api/v1/auth",
  (req, res, next) => {
    // disabling cache for auth route so i get fresh data always
    res.setHeader("Cache-Control", "no-store");
    next();
  },
  authRoutes
);
app.use(
  "/api/v1/sessions",
  (req, res, next) => {
    // disabling cache for sessions for same reason
    res.setHeader("Cache-Control", "no-store");
    next();
  },
  sessionRoutes
);
app.use("/api/v1/admin", adminRoutes);

import { errorHandler } from "@/middlewares/error.middleware";
app.use(errorHandler);
