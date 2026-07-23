const { defineConfig } = require("drizzle-kit");
const env = require("./src/config/env");

module.exports = defineConfig({
  dialect: "postgresql",
  schema: "./src/database/schema/*.js",
  out: "./src/database/migrations",
  dbCredentials: {
    url: env.databaseUrl,
  },
  strict: true,
  verbose: true,
});
