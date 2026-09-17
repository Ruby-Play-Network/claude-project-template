/** Base class for errors that map to a known HTTP status code. */
export class DomainError extends Error {
  public readonly status: number;

  public constructor(message: string, status: number) {
    super(message);
    this.name = new.target.name;
    this.status = status;
  }
}

export class NotFoundError extends DomainError {
  public constructor(message = 'Not found') {
    super(message, 404);
  }
}

export class ValidationError extends DomainError {
  public constructor(message = 'Invalid request') {
    super(message, 400);
  }
}
