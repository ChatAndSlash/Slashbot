"use strict";

/**
 * Base class to extend from, in order to get error names correct when calling later.
 */
class ExtendableError extends Error {
  constructor(message) {
    super(message);

    this.name    = this.constructor.name;
    this.message = message;

    if (_.isFunction(Error.captureStackTrace)) {
      Error.captureStackTrace(this, this.constructor);
    }
    else {
      this.stack = (new Error(message)).stack;
    }
  }
}

/**
 * Raised when when attempting to load content that doesn't exist.
 */
class ContentDoesNotExistError extends ExtendableError {
  constructor(m) {
    super(m);
  }
}

module.exports = {
  ContentDoesNotExistError
};