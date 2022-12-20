const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UN_AUTHORISED: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
  INVALID_REQUEST: 422,
};

class AppError {
  constructor(statusCode, description, response) {
    this.statusCode = statusCode;
    this.description = description;
    this.response = response;
  }

  async send() {
    this.response.status(this.statusCode).json({ error: this.description });
  }
}

class InternalError extends AppError {
  constructor(description, response) {
    super(STATUS_CODES.INTERNAL_ERROR, description, response);
    this.description = description;
    this.response = response;
  }
}

class ValidationError extends AppError {
  constructor(description, response) {
    super(STATUS_CODES.INVALID_REQUEST, description, response);
    this.description = description;
    this.response = response;
  }
}

module.exports = {
  AppError,
  InternalError,
  ValidationError,
  STATUS_CODES,
};
