import { ZodError } from "zod";
import { ApiError } from "@/utils/ApiError";
import { HttpStatus } from "./httpStatus";

export const handleZodError = <T>(
  result: { success: true; data: T } | { success: false; error: ZodError }
): T => {
  if (result.success) return result.data;

  const issues = result.error.issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path : ["root"];
    return {
      path,
      message: issue.message,
    };
  });

  throw new ApiError(
    HttpStatus.UNPROCESSABLE_ENTITY,
    "Validation failed",
    null,
    issues
  );
};
