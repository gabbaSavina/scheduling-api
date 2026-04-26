const { body, param } = require('express-validator');
const { validate } = require('../middlewares/validate');

// ─── REUTILIZABLES ────────────────────────────────────────────────────────────

const clinicIdParam = param('clinicId').isInt({ gt: 0 }).withMessage('clinicId must be a positive integer');
const idParam = param('id').isInt({ gt: 0 }).withMessage('id must be a positive integer');

// ─── CLINICS ──────────────────────────────────────────────────────────────────

const clinicRules = {
  create: [
    body('name').trim().notEmpty().withMessage('name is required'),
    validate,
  ],
  update: [
    idParam,
    body('name').trim().notEmpty().withMessage('name is required'),
    validate,
  ],
};

// ─── USERS ────────────────────────────────────────────────────────────────────

const userRules = {
  create: [
    clinicIdParam,
    body('name').trim().notEmpty().withMessage('name is required'),
    body('email').isEmail().withMessage('valid email is required'),
    body('role_id').isInt({ gt: 0 }).withMessage('role_id must be a positive integer'),
    validate,
  ],
  update: [
    clinicIdParam,
    idParam,
    body('name').trim().notEmpty().withMessage('name is required'),
    body('email').isEmail().withMessage('valid email is required'),
    body('role_id').isInt({ gt: 0 }).withMessage('role_id must be a positive integer'),
    validate,
  ],
};

// ─── STAFF ────────────────────────────────────────────────────────────────────

const staffRules = {
  create: [
    clinicIdParam,
    body('name').trim().notEmpty().withMessage('name is required'),
    body('role_id').isInt({ gt: 0 }).withMessage('role_id must be a positive integer'),
    validate,
  ],
  update: [
    clinicIdParam,
    idParam,
    body('name').trim().notEmpty().withMessage('name is required'),
    body('role_id').isInt({ gt: 0 }).withMessage('role_id must be a positive integer'),
    validate,
  ],
};

// ─── SERVICES ─────────────────────────────────────────────────────────────────

const serviceRules = {
  create: [
    clinicIdParam,
    body('name').trim().notEmpty().withMessage('name is required'),
    body('duration_minutes').isInt({ gt: 0 }).withMessage('duration_minutes must be a positive integer'),
    body('price').isFloat({ gt: 0 }).withMessage('price must be a positive number'),
    validate,
  ],
  update: [
    clinicIdParam,
    idParam,
    body('name').trim().notEmpty().withMessage('name is required'),
    body('duration_minutes').isInt({ gt: 0 }).withMessage('duration_minutes must be a positive integer'),
    body('price').isFloat({ gt: 0 }).withMessage('price must be a positive number'),
    validate,
  ],
};

// ─── APPOINTMENTS ─────────────────────────────────────────────────────────────

const appointmentRules = {
  create: [
    clinicIdParam,
    body('user_id').isInt({ gt: 0 }).withMessage('user_id is required'),
    body('staff_id').isInt({ gt: 0 }).withMessage('staff_id is required'),
    body('service_id').isInt({ gt: 0 }).withMessage('service_id is required'),
    body('appointment_date').isISO8601().withMessage('appointment_date must be a valid ISO 8601 date'),
    validate,
  ],
  updateStatus: [
    clinicIdParam,
    idParam,
    body('status_id').isInt({ gt: 0 }).withMessage('status_id is required'),
    validate,
  ],
};

module.exports = { clinicRules, userRules, staffRules, serviceRules, appointmentRules };