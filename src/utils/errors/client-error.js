const AppError = require("./app-error");

class ClientError extends AppError {
  constructor(name = "ClientError", message, explanation, statusCode) {
    super(name, message, explanation, statusCode);
  }
}

module.exports = ClientError;
