const dotenv = require("dotenv");

dotenv.config({ quiet: true });

const requireValue = (name, defaultValue) => {
  const value = process.env[name]?.trim() || defaultValue;

  if (!value) {
    throw new Error(
      `Environment configuration error: ${name} is required.`,
    );
  }

  return value;
};

const parsePort = (value) => {
  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(
      "Environment configuration error: PORT must be an integer between 1 and 65535.",
    );
  }

  return port;
};

const parseUrl = (value) => {
  try {
    return new URL(value).toString().replace(/\/$/, "");
  } catch {
    throw new Error(
      "Environment configuration error: APP_URL must be a valid URL.",
    );
  }
};

const parseDatabaseUrl = (value) => {
  try {
    const databaseUrl = new URL(value);

    if (!["postgres:", "postgresql:"].includes(databaseUrl.protocol)) {
      throw new Error();
    }

    return value;
  } catch {
    throw new Error(
      "Environment configuration error: DATABASE_URL must be a valid PostgreSQL URL.",
    );
  }
};

const env = Object.freeze({
  nodeEnv: requireValue("NODE_ENV", "development"),
  port: parsePort(requireValue("PORT", "3000")),
  appName: requireValue(
    "APP_NAME",
    "Appointment Recovery Platform",
  ),
  appUrl: parseUrl(requireValue("APP_URL")),
  databaseUrl: parseDatabaseUrl(requireValue("DATABASE_URL")),
});

module.exports = env;
