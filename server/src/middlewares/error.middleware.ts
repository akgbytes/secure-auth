import type {
	ErrorRequestHandler,
	NextFunction,
	Request,
	Response,
} from "express";
import { ApiError, HttpStatus } from "@/utils/core";
import { logger } from "@/utils/core/logger";

export const errorHandler: ErrorRequestHandler = (
	error: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
): void => {
	let apiError: ApiError;

	if (error instanceof ApiError) {
		apiError = error;
	} else {
		const message =
			error instanceof Error ? error.message : "Internal Server Error";
		apiError = new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, message);
	}

	logger.error(apiError.message);

	res.status(apiError.statusCode).json({
		statusCode: apiError.statusCode,
		message: apiError.message,
		errors: apiError.errors,
		success: apiError.success,
	});
};
