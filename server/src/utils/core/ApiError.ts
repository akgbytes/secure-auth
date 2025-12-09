export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly success: boolean;
  public readonly errors: ValidationError[];

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: ValidationError[] = []
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

export interface ValidationError {
  field: string;
  message: string;
}
