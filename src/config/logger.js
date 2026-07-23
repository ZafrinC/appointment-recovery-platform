const { Writable } = require("node:stream");
const pino = require("pino");
const env = require("./env");

const createDevelopmentDestination = () =>
  new Writable({
    write(chunk, encoding, callback) {
      try {
        const log = JSON.parse(chunk.toString());
        const {
          level,
          time,
          msg,
          pid,
          hostname,
          ...details
        } = log;
        const levelLabel = pino.levels.labels[level].toUpperCase();
        const context =
          Object.keys(details).length > 0
            ? ` ${JSON.stringify(details)}`
            : "";

        process.stdout.write(
          `[${time}] ${levelLabel}: ${msg || ""}${context}\n`,
        );
        callback();
      } catch (error) {
        callback(error);
      }
    },
  });

const options = {
  level: env.nodeEnv === "production" ? "info" : "debug",
  base: {
    app: env.appName,
    environment: env.nodeEnv,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
};

const logger =
  env.nodeEnv === "production"
    ? pino(options)
    : pino(options, createDevelopmentDestination());

module.exports = logger;
