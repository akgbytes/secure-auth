export class ApiError<T = unknown> extends Error {
  public readonly success = false;
  public readonly data: T | null;

  constructor(message: string, data: T | null = null) {
    super(message);
    this.data = data;

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
