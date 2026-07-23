const express = require("express");
const { getRoot } = require("../controllers/rootController");
const { getHealth } = require("../controllers/healthController");
const asyncHandler = require("../utils/asyncHandler");
const businessRoutes = require("./business.routes");

const publicRoutes = express.Router();
const apiRoutes = express.Router();

publicRoutes.get("/", getRoot);
publicRoutes.get("/health", asyncHandler(getHealth));

apiRoutes.get("/", getRoot);
apiRoutes.get("/health", asyncHandler(getHealth));
apiRoutes.use("/businesses", businessRoutes);

module.exports = {
  publicRoutes,
  apiRoutes,
};
