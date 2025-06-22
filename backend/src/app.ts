import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { env } from "./configs/env";

const app = express();

app.set("trust proxy", "loopback");
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [env.CLIENT_URL, "http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new CustomError(400, "Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
import healthRoutes from "./routes/health.route";
import authRoutes from "./routes/auth.route";
import adminRoutes from "./routes/admin.route";
import { errorHandler } from "./middlewares/error.middleware";
import { CustomError } from "./utils/CustomError";

app.use("/api/v1/healthcheck", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use(errorHandler);

export default app;
