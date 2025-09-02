import express from "express";
import { pinoHttp } from "pino-http";
import { logger } from "@/utils/logger";
import cookieParser from "cookie-parser";
import { randomUUID } from "crypto";
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

app.use(
  pinoHttp({
    logger: logger,
    genReqId: () => randomUUID(),
    customLogLevel: function (req, res, err) {
      const statusCode = res.statusCode as number;
      if (statusCode >= 400) return "error";
      return "info";
    },
    serializers: {
      req(req) {
        return {
          method: req.method,
          url: req.url,
          id: req.id,
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
    customSuccessMessage: function (req, res) {
      return `Request completed`;
    },

    autoLogging: true,
  })
);

import healthRoutes from "@/modules/health";
import authRoutes from "@/modules/auth";

app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);

import { errorHandler } from "@/middlewares/error.middleware";
app.use(errorHandler);
