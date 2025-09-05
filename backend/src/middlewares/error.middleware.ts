import { ApiError, HttpStatus } from "@/core";
import { logger } from "@/core/logger";
import { ErrorRequestHandler, Request, Response, NextFunction } from "express";

export const errorHandler: ErrorRequestHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let apiError: ApiError;

  if (error instanceof ApiError) {
    apiError = error;
  } else {
    let message = error.message ? error.message : "Internal Server Error";
    apiError = new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, message);
  }

  logger.error(
    { path: req.path, method: req.method, ip: req.ip },
    apiError.message
  );

  console.log("Error from middleware: ", error);

  res.status(apiError.statusCode).json({
    statusCode: apiError.statusCode,
    message: apiError.message,
    data: apiError.data,
    success: apiError.success,
  });
};
