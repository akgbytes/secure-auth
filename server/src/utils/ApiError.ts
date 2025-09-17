export class ApiError<T = unknown> extends Error {
  public readonly success = false;
  public readonly statusCode: number;
  public readonly data: T | null;

  constructor(statusCode: number, message: string, data: T | null = null) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
