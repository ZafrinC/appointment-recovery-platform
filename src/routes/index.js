const express = require("express");
const { getRoot } = require("../controllers/rootController");
const { getHealth } = require("../controllers/healthController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/", getRoot);
router.get("/health", asyncHandler(getHealth));

module.exports = router;
