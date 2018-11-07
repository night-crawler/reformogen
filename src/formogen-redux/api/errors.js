import ExtendableError from 'es6-error';


export class APIError extends ExtendableError {
  constructor(opts, errors, retries) {
    super(`Failed to fetch ${opts} after ${retries} attempts`);
    this.errors = errors;
  }
}
