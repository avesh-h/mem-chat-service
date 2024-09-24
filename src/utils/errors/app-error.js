const httpStatusCode = require("../httpStatusCode");

class AppError extends Error {
  constructor(
    name = "AppError",
    message = "Something went wrong!",
    explanation = "Something went wrong!",
    statusCode = httpStatusCode.INTERNAL_SERVER_ERROR
  ) {
    super();
    this.message = message;
    this.name = name;
    this.explanation = explanation;
    this.statusCode = statusCode;
  }
}

module.exports = AppError;
