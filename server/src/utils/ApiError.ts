export class ApiError<T = unknown> extends Error {
  public readonly success = false;

  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly data: T | null = null,
    public readonly errors?: Array<unknown>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
