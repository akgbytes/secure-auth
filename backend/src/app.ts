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

app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);

import { errorHandler } from "@/middlewares/error.middleware";
app.use(errorHandler);
