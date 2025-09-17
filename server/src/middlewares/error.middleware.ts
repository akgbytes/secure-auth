import { logger } from "@/config/logger";
import { ApiError } from "@/utils/ApiError";
import { HttpStatus } from "@/utils/httpStatus";
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

  logger.error(apiError.message, apiError.errors);

  res.status(apiError.statusCode).json({
    statusCode: apiError.statusCode,
    message: apiError.message,
    data: apiError.data,
    success: apiError.success,
    errors: apiError.errors || [],
  });
};
