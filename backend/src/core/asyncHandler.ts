import { Request, Response, NextFunction, RequestHandler } from "express";

export const asyncHandler =
  <T>(
    handler: (req: Request, res: Response, next: NextFunction) => Promise<T>
  ): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
