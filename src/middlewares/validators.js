const { body, param, query } = require("express-validator");
const { validate } = require("./validate");

const positiveIntParam = (field) =>
  param(field)
    .isInt({ gt: 0 })
    .withMessage(`${field} must be a positive integer`);

const clinicIdParam = positiveIntParam("clinicId");
const idParam = positiveIntParam("id");

const appointmentQueryRules = [
  query("status_id")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("status_id must be a positive integer"),
  query("staff_id")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("staff_id must be a positive integer"),
  query("date")
    .optional()
    .isISO8601({ strict: true })
    .withMessage("date must be a valid ISO 8601 date"),
  validate,
];

const clinicRules = {
  create: [
    body("name").trim().notEmpty().withMessage("name is required"),
    validate,
  ],
  getById: [idParam, validate],
  update: [
    idParam,
    body("name").trim().notEmpty().withMessage("name is required"),
    validate,
  ],
  deactivate: [idParam, validate],
};

const userRules = {
  list: [clinicIdParam, validate],
  getById: [clinicIdParam, idParam, validate],
  create: [
    clinicIdParam,
    body("name").trim().notEmpty().withMessage("name is required"),
    body("email")
      .isEmail()
      .withMessage("valid email is required")
      .normalizeEmail(),
    body("role_id")
      .isInt({ gt: 0 })
      .withMessage("role_id must be a positive integer"),
    validate,
  ],
  update: [
    clinicIdParam,
    idParam,
    body("name").trim().notEmpty().withMessage("name is required"),
    body("email")
      .isEmail()
      .withMessage("valid email is required")
      .normalizeEmail(),
    body("role_id")
      .isInt({ gt: 0 })
      .withMessage("role_id must be a positive integer"),
    validate,
  ],
  deactivate: [clinicIdParam, idParam, validate],
};

const staffRules = {
  list: [clinicIdParam, validate],
  getById: [clinicIdParam, idParam, validate],
  create: [
    clinicIdParam,
    body("name").trim().notEmpty().withMessage("name is required"),
    body("role_id")
      .isInt({ gt: 0 })
      .withMessage("role_id must be a positive integer"),
    validate,
  ],
  update: [
    clinicIdParam,
    idParam,
    body("name").trim().notEmpty().withMessage("name is required"),
    body("role_id")
      .isInt({ gt: 0 })
      .withMessage("role_id must be a positive integer"),
    validate,
  ],
  deactivate: [clinicIdParam, idParam, validate],
};

const serviceRules = {
  list: [clinicIdParam, validate],
  getById: [clinicIdParam, idParam, validate],
  create: [
    clinicIdParam,
    body("name").trim().notEmpty().withMessage("name is required"),
    body("duration_minutes")
      .isInt({ gt: 0 })
      .withMessage("duration_minutes must be a positive integer"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("price must be a positive number"),
    validate,
  ],
  update: [
    clinicIdParam,
    idParam,
    body("name").trim().notEmpty().withMessage("name is required"),
    body("duration_minutes")
      .isInt({ gt: 0 })
      .withMessage("duration_minutes must be a positive integer"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("price must be a positive number"),
    validate,
  ],
  deactivate: [clinicIdParam, idParam, validate],
};

const appointmentRules = {
  list: [clinicIdParam, ...appointmentQueryRules],
  getById: [clinicIdParam, idParam, validate],
  create: [
    clinicIdParam,
    body("user_id")
      .isInt({ gt: 0 })
      .withMessage("user_id must be a positive integer"),
    body("staff_id")
      .isInt({ gt: 0 })
      .withMessage("staff_id must be a positive integer"),
    body("service_id")
      .isInt({ gt: 0 })
      .withMessage("service_id must be a positive integer"),
    body("appointment_date")
      .isISO8601()
      .withMessage("appointment_date must be a valid ISO 8601 date"),
    validate,
  ],
  updateStatus: [
    clinicIdParam,
    idParam,
    body("status_id")
      .isInt({ gt: 0 })
      .withMessage("status_id must be a positive integer"),
    validate,
  ],
};

module.exports = {
  clinicRules,
  userRules,
  staffRules,
  serviceRules,
  appointmentRules,
};
