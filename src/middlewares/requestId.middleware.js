const { randomUUID } = require("node:crypto");

const requestId = (req, res, next) => {
  const suppliedRequestId = req.get("x-request-id")?.trim();

  req.id = suppliedRequestId || randomUUID();
  res.setHeader("x-request-id", req.id);

  next();
};

module.exports = requestId;
