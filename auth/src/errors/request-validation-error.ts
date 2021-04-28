import { CustomError } from "./custom-error";
import { ValidationError } from "express-validator";

export class RequestValidationError extends CustomError {
  statusCode = 400
  constructor(private errors: ValidationError[]) {
    super('Invalid request parameters');

    // have to do this when extending built-in types
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  toArray() {
    return this.errors.map((err) => {
      return { message: err.msg, field: err.param };
    });
  }
}