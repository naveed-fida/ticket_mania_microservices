import { CustomError } from './custom-error';

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);
    // have to do this when extending built-in types
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  toArray() {
    return [{message: this.message}];
  }
}