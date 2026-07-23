const ApiResponse = require("../utils/ApiResponse");
const {
  checkDatabaseHealth,
} = require("../database/client");

const getHealth = async (req, res) => {
  const database = await checkDatabaseHealth(req.id);
  const isDatabaseHealthy = database.status === "healthy";

  res.status(isDatabaseHealthy ? 200 : 503).json(
    new ApiResponse(
      {
        application: isDatabaseHealthy ? "healthy" : "degraded",
        database: database.status,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
      req.id,
    ),
  );
};

module.exports = {
  getHealth,
};
