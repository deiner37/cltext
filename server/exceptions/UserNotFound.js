module.exports = function UserNotFound() {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'User not found';
  this.status = '404';
};
require('util').inherits(module.exports, Error);