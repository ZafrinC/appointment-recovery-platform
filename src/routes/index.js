const express = require("express");
const { getRoot } = require("../controllers/rootController");
const { getHealth } = require("../controllers/healthController");

const router = express.Router();

router.get("/", getRoot);
router.get("/health", getHealth);

module.exports = router;
