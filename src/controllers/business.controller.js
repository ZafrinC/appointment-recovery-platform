const businessService = require("../services/business.service");
const ApiResponse = require("../utils/ApiResponse");

const createBusiness = async (req, res) => {
  const business = await businessService.createBusiness(
    req.validatedBody,
  );

  res
    .status(201)
    .json(
      new ApiResponse(
        { business },
        req.id,
        "Business created successfully",
      ),
    );
};

const listBusinesses = async (req, res) => {
  const result = await businessService.listBusinesses(
    req.validatedQuery,
  );

  res.json(
    new ApiResponse(
      result,
      req.id,
      "Businesses retrieved successfully",
    ),
  );
};

const getBusiness = async (req, res) => {
  const business = await businessService.getBusiness(
    req.validatedParams.id,
  );

  res.json(
    new ApiResponse(
      { business },
      req.id,
      "Business retrieved successfully",
    ),
  );
};

const updateBusiness = async (req, res) => {
  const business = await businessService.updateBusiness(
    req.validatedParams.id,
    req.validatedBody,
  );

  res.json(
    new ApiResponse(
      { business },
      req.id,
      "Business updated successfully",
    ),
  );
};

const deleteBusiness = async (req, res) => {
  const business = await businessService.deleteBusiness(
    req.validatedParams.id,
  );

  res.json(
    new ApiResponse(
      { business },
      req.id,
      "Business deactivated successfully",
    ),
  );
};

module.exports = {
  createBusiness,
  listBusinesses,
  getBusiness,
  updateBusiness,
  deleteBusiness,
};
