const pinoHttp = require("pino-http");
const logger = require("../config/logger");

const requestLogger = pinoHttp({
  logger,
  quietReqLogger: true,
  customProps: (req) => ({
    requestId: req.id,
  }),
  customLogLevel: (req, res, error) => {
    if (error || res.statusCode >= 500) {
      return "error";
    }

    if (res.statusCode >= 400) {
      return "warn";
    }

    return "info";
  },
  customSuccessMessage: () => "HTTP request completed",
  customErrorMessage: () => "HTTP request failed",
  customSuccessObject: (req, res, value) => ({
    ...value,
    requestId: req.id,
    method: req.method,
    url: req.originalUrl,
    statusCode: res.statusCode,
  }),
  customErrorObject: (req, res, error, value) => ({
    ...value,
    requestId: req.id,
    method: req.method,
    url: req.originalUrl,
    statusCode: res.statusCode,
  }),
});

module.exports = requestLogger;
