const ApiResponse = require("../utils/ApiResponse");

const getRoot = (req, res) => {
  res.json(
    new ApiResponse(
      {
        service: "Appointment Recovery Platform",
        status: "running",
      },
      req.id,
    ),
  );
};

module.exports = {
  getRoot,
};
