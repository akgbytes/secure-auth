export class ApiResponse<T> {
  public readonly success = true;

  constructor(public readonly message: string, public readonly data: T) {}
}
