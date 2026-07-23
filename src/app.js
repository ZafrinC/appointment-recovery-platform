const express = require("express");
const { publicRoutes, apiRoutes } = require("./routes");
const requestId = require("./middlewares/requestId.middleware");
const requestLogger = require("./middlewares/requestLogger.middleware");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(requestId);
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", publicRoutes);
app.use("/api/v1", apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
