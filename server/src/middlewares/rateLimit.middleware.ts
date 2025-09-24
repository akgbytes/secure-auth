import { HttpStatus } from "@/utils/core";
import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    statusCode: HttpStatus.TOO_MANY_REQUESTS,
    message: "Too many attempts. Please try again later.",
    data: null,
    success: false,
  },
});

export const resendVerificationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    statusCode: HttpStatus.TOO_MANY_REQUESTS,
    message: "Too many verification email requests. Try again later.",
    data: null,
    success: false,
  },
});

export const forgotPasswordRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    statusCode: HttpStatus.TOO_MANY_REQUESTS,
    message: "Too many password reset requests. Try again later.",
    data: null,
    success: false,
  },
});
