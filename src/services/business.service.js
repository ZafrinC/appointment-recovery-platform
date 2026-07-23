const businessRepository = require("../repositories/business.repository");
const ApiError = require("../utils/ApiError");

const isUniqueViolation = (error) => error?.code === "23505";

const ensureSlugIsAvailable = async (slug, currentBusinessId) => {
  if (!slug) {
    return;
  }

  const existingBusiness =
    await businessRepository.findBySlug(slug);

  if (
    existingBusiness &&
    existingBusiness.id !== currentBusinessId
  ) {
    throw new ApiError(409, "Business slug already exists");
  }
};

const createBusiness = async (data) => {
  await ensureSlugIsAvailable(data.slug);

  try {
    return await businessRepository.create(data);
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new ApiError(409, "Business slug already exists");
    }

    throw error;
  }
};

const listBusinesses = async (query) => {
  const { records, total } =
    await businessRepository.findAll(query);
  const totalPages = Math.ceil(total / query.limit);

  return {
    businesses: records,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
    },
  };
};

const getBusiness = async (id) => {
  const business = await businessRepository.findById(id);

  if (!business) {
    throw new ApiError(404, "Business not found");
  }

  return business;
};

const updateBusiness = async (id, data) => {
  await getBusiness(id);
  await ensureSlugIsAvailable(data.slug, id);

  try {
    const business = await businessRepository.updateById(id, data);

    if (!business) {
      throw new ApiError(404, "Business not found");
    }

    return business;
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new ApiError(409, "Business slug already exists");
    }

    throw error;
  }
};

const deleteBusiness = async (id) => {
  const business = await businessRepository.softDeleteById(id);

  if (!business) {
    throw new ApiError(404, "Business not found");
  }

  return business;
};

module.exports = {
  createBusiness,
  listBusinesses,
  getBusiness,
  updateBusiness,
  deleteBusiness,
};
