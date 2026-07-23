const ApiError = require("../utils/ApiError");

const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const WRITABLE_FIELDS = [
  "name",
  "slug",
  "email",
  "phone",
  "timezone",
];

const validationError = (errors) =>
  new ApiError(400, "Validation failed", errors);

const addRequiredString = (
  body,
  field,
  errors,
  minLength,
  maxLength,
) => {
  if (typeof body[field] !== "string" || !body[field].trim()) {
    errors.push({ field, message: `${field} is required` });
    return;
  }

  const value = body[field].trim();

  if (value.length < minLength || value.length > maxLength) {
    errors.push({
      field,
      message: `${field} must be between ${minLength} and ${maxLength} characters`,
    });
  }
};

const validateFields = (body, isPartial) => {
  const errors = [];
  const unknownFields = Object.keys(body).filter(
    (field) => !WRITABLE_FIELDS.includes(field),
  );

  for (const field of unknownFields) {
    errors.push({ field, message: `${field} is not allowed` });
  }

  if (!isPartial || body.name !== undefined) {
    addRequiredString(body, "name", errors, 2, 120);
  }

  if (!isPartial || body.slug !== undefined) {
    addRequiredString(body, "slug", errors, 1, 255);

    if (
      typeof body.slug === "string" &&
      body.slug.trim() &&
      !SLUG_PATTERN.test(body.slug.trim())
    ) {
      errors.push({
        field: "slug",
        message:
          "slug must contain lowercase letters, numbers, and hyphens only",
      });
    }
  }

  if (!isPartial || body.email !== undefined) {
    addRequiredString(body, "email", errors, 3, 320);

    if (
      typeof body.email === "string" &&
      body.email.trim() &&
      !EMAIL_PATTERN.test(body.email.trim())
    ) {
      errors.push({
        field: "email",
        message: "email must be a valid email address",
      });
    }
  }

  if (!isPartial || body.timezone !== undefined) {
    addRequiredString(body, "timezone", errors, 1, 100);

    if (
      typeof body.timezone === "string" &&
      body.timezone.trim()
    ) {
      try {
        new Intl.DateTimeFormat("en-US", {
          timeZone: body.timezone.trim(),
        }).format();
      } catch {
        errors.push({
          field: "timezone",
          message: "timezone must be a valid IANA timezone",
        });
      }
    }
  }

  if (
    body.phone !== undefined &&
    body.phone !== null &&
    (typeof body.phone !== "string" ||
      body.phone.trim().length > 50)
  ) {
    errors.push({
      field: "phone",
      message: "phone must be a string of at most 50 characters",
    });
  }

  return errors;
};

const sanitizeBody = (body) => {
  const result = {};

  for (const field of WRITABLE_FIELDS) {
    if (body[field] === undefined) {
      continue;
    }

    if (body[field] === null) {
      result[field] = null;
      continue;
    }

    const value = body[field].trim();
    result[field] = field === "email" ? value.toLowerCase() : value;
  }

  return result;
};

const validateCreateBusiness = (req, res, next) => {
  if (
    !req.body ||
    typeof req.body !== "object" ||
    Array.isArray(req.body)
  ) {
    return next(
      validationError([
        { field: "body", message: "request body must be an object" },
      ]),
    );
  }

  const errors = validateFields(req.body, false);

  if (errors.length > 0) {
    return next(validationError(errors));
  }

  req.validatedBody = sanitizeBody(req.body);
  return next();
};

const validateUpdateBusiness = (req, res, next) => {
  if (
    !req.body ||
    typeof req.body !== "object" ||
    Array.isArray(req.body)
  ) {
    return next(
      validationError([
        { field: "body", message: "request body must be an object" },
      ]),
    );
  }

  if (Object.keys(req.body).length === 0) {
    return next(
      validationError([
        {
          field: "body",
          message: "at least one field is required",
        },
      ]),
    );
  }

  const errors = validateFields(req.body, true);

  if (errors.length > 0) {
    return next(validationError(errors));
  }

  req.validatedBody = sanitizeBody(req.body);
  return next();
};

const validateBusinessId = (req, res, next) => {
  if (!UUID_PATTERN.test(req.params.id)) {
    return next(
      validationError([
        { field: "id", message: "id must be a valid UUID" },
      ]),
    );
  }

  req.validatedParams = { id: req.params.id };
  return next();
};

const validateListBusinesses = (req, res, next) => {
  const page = req.query.page === undefined ? 1 : Number(req.query.page);
  const limit =
    req.query.limit === undefined ? 20 : Number(req.query.limit);
  const search =
    typeof req.query.search === "string"
      ? req.query.search.trim()
      : "";
  const errors = [];

  if (!Number.isInteger(page) || page < 1) {
    errors.push({
      field: "page",
      message: "page must be a positive integer",
    });
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    errors.push({
      field: "limit",
      message: "limit must be an integer between 1 and 100",
    });
  }

  if (search.length > 120) {
    errors.push({
      field: "search",
      message: "search must be at most 120 characters",
    });
  }

  if (errors.length > 0) {
    return next(validationError(errors));
  }

  req.validatedQuery = { page, limit, search };
  return next();
};

module.exports = {
  validateCreateBusiness,
  validateUpdateBusiness,
  validateBusinessId,
  validateListBusinesses,
};
