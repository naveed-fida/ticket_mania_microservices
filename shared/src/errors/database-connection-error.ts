import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;

  constructor(public message: string = 'Error connecting to DB') {
    super(message);
    // have to do this when extending built-in types
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  toArray() {
    return [{message: this.message}];
  }
}