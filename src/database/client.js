const { Pool } = require("pg");
const { drizzle } = require("drizzle-orm/node-postgres");
const env = require("../config/env");
const logger = require("../config/logger");

const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

const db = drizzle(pool);

pool.on("error", (error) => {
  logger.error({ err: error }, "Unexpected PostgreSQL pool error");
});

const checkDatabaseHealth = async (requestId) => {
  try {
    await pool.query("SELECT 1");

    return {
      status: "healthy",
    };
  } catch (error) {
    logger.error(
      {
        err: error,
        requestId,
      },
      "Database health check failed",
    );

    return {
      status: "unavailable",
    };
  }
};

module.exports = {
  db,
  pool,
  checkDatabaseHealth,
};
