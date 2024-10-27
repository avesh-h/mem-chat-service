const AppError = require("./app-error");

class ClientError extends AppError {
  constructor(name = "ClientError", message, explanation, statusCode = 400) {
    super(name, message, explanation, statusCode);
  }
}

module.exports = ClientError;
