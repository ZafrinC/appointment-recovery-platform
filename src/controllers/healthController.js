const getHealth = (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
  });
};

module.exports = {
  getHealth,
};
