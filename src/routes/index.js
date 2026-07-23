const express = require("express");
const { getHealth } = require("../controllers/healthController");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    service: "Appointment Recovery Platform",
    status: "running",
  });
});

router.get("/health", getHealth);

module.exports = router;
