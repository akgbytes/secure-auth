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
    customLogLevel: function (res, err) {
      const statusCode = res.statusCode as number;
      if (statusCode >= 500 || err) return "error";
      if (statusCode >= 400) return "warn";
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
      return `Request completed in ${(res as any).responseTime}ms`;
    },
    customErrorMessage: function (req, res, err) {
      return `Request errored with status ${res.statusCode}: ${err.message}`;
    },
    autoLogging: true,
  })
);

import healthRoutes from "@/modules/health/health.routes";

app.use("/api/v1/health", healthRoutes);
