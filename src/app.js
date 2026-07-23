const express = require("express");

const app = express();

// Middleware
app.use(express.json());

// Health Route
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Appointment Recovery System is running",
  });
});

module.exports = app;
