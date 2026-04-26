const { StatusCodes } = require("http-status-codes");

// Clase base para errores operacionales de la API
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, StatusCodes.NOT_FOUND);
  }
}

class BadRequestError extends AppError {
  constructor(message) {
    super(message, StatusCodes.BAD_REQUEST);
  }
}

class ConflictError extends AppError {
  constructor(message) {
    super(message, StatusCodes.CONFLICT);
  }
}

// Handler global de errores (último middleware en Express)
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Errores operacionales conocidos
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // Errores de constraint de PostgreSQL
  if (err.code === "23505") {
    return res.status(StatusCodes.CONFLICT).json({
      status: "error",
      message: "A record with this data already exists",
    });
  }

  if (err.code === "23503") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: "error",
      message: "Referenced resource does not exist",
    });
  }

  // Error genérico (no exponer detalles internos en producción)
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: "error",
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message,
  });
};

module.exports = {
  errorHandler,
  AppError,
  NotFoundError,
  BadRequestError,
  ConflictError,
};
