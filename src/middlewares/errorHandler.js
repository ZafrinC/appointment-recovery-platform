const env = require("../config/env");
const logger = require("../config/logger");

const errorHandler = (err, req, res, next) => {
  const isOperational = err.isOperational === true;
  const statusCode = isOperational ? err.statusCode : 500;
  const message = isOperational
    ? err.message
    : "Internal server error";

  logger.error(
    {
      err,
      requestId: req.id,
      method: req.method,
      url: req.originalUrl,
      statusCode,
    },
    "Request failed",
  );

  res.status(statusCode).json({
    success: false,
    message,
    errors: isOperational ? err.errors : null,
    requestId: req.id,
    ...(env.nodeEnv !== "production" && !isOperational
      ? { stack: err.stack }
      : {}),
  });
};

module.exports = errorHandler;
