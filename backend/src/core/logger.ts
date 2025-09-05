import pino from "pino";
import path from "path";

const logDir = path.join(process.cwd(), "logs");
const isProduction = process.env.NODE_ENV === "production";

const baseOptions = {
  level: process.env.LOG_LEVEL || "info",
  timestamp: pino.stdTimeFunctions.isoTime,
};

const transport = isProduction
  ? {
      targets: [
        {
          target: "pino/file",
          level: "info",
          options: { destination: `${logDir}/combined.log`, mkdir: true },
        },

        {
          target: "pino/file",
          level: "error",
          options: { destination: `${logDir}/error.log`, mkdir: true },
        },
      ],
    }
  : {
      targets: [
        {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
            ignore: "pid,hostname",
          },
        },
        {
          target: "pino/file",
          level: "info",
          options: { destination: `${logDir}/combined.log`, mkdir: true },
        },

        {
          target: "pino/file",
          level: "error",
          options: { destination: `${logDir}/error.log`, mkdir: true },
        },
      ],
    };

export const logger = pino({ ...baseOptions, transport: transport });
