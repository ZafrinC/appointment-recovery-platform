const express = require("express");
const businessController = require("../controllers/business.controller");
const {
  validateCreateBusiness,
  validateUpdateBusiness,
  validateBusinessId,
  validateListBusinesses,
} = require("../validations/business.validation");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router
  .route("/")
  .post(
    validateCreateBusiness,
    asyncHandler(businessController.createBusiness),
  )
  .get(
    validateListBusinesses,
    asyncHandler(businessController.listBusinesses),
  );

router
  .route("/:id")
  .get(
    validateBusinessId,
    asyncHandler(businessController.getBusiness),
  )
  .patch(
    validateBusinessId,
    validateUpdateBusiness,
    asyncHandler(businessController.updateBusiness),
  )
  .delete(
    validateBusinessId,
    asyncHandler(businessController.deleteBusiness),
  );

module.exports = router;
