const pool = require("../config/db/db");
const { NotFoundError, ConflictError } = require("../middlewares/errorHandler");

// ─── USERS ────────────────────────────────────────────────────────────────────

const users = {
  getAllByClinic: async (clinicId) => {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.active, u.created_at,
              json_build_object('id', r.id, 'name', r.name) AS role
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.clinic_id = $1
       ORDER BY u.name`,
      [clinicId],
    );
    return result.rows;
  },

  getById: async (id, clinicId) => {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.active, u.created_at,
              json_build_object('id', r.id, 'name', r.name) AS role
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = $1 AND u.clinic_id = $2`,
      [id, clinicId],
    );
    if (!result.rows[0]) throw new NotFoundError("User");
    return result.rows[0];
  },

  create: async (clinicId, { name, email, role_id }) => {
    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND clinic_id = $2",
      [email, clinicId],
    );
    if (existing.rows[0])
      throw new ConflictError(
        "A user with this email already exists in this clinic",
      );

    const result = await pool.query(
      `INSERT INTO users (clinic_id, role_id, name, email)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [clinicId, role_id, name, email],
    );
    return users.getById(result.rows[0].id, clinicId);
  },

  update: async (id, clinicId, { name, email, role_id }) => {
    await users.getById(id, clinicId);
    const result = await pool.query(
      `UPDATE users SET name = $1, email = $2, role_id = $3
       WHERE id = $4 AND clinic_id = $5 RETURNING id`,
      [name, email, role_id, id, clinicId],
    );
    return users.getById(result.rows[0].id, clinicId);
  },

  deactivate: async (id, clinicId) => {
    await users.getById(id, clinicId);
    await pool.query("UPDATE users SET active = false WHERE id = $1", [id]);
  },
};

// ─── STAFF ────────────────────────────────────────────────────────────────────

const staff = {
  getAllByClinic: async (clinicId) => {
    const result = await pool.query(
      `SELECT s.id, s.name, s.active, s.created_at,
              json_build_object('id', r.id, 'name', r.name) AS role
       FROM staff s
       JOIN roles r ON s.role_id = r.id
       WHERE s.clinic_id = $1
       ORDER BY s.name`,
      [clinicId],
    );
    return result.rows;
  },

  getById: async (id, clinicId) => {
    const result = await pool.query(
      `SELECT s.id, s.name, s.active, s.created_at,
              json_build_object('id', r.id, 'name', r.name) AS role
       FROM staff s
       JOIN roles r ON s.role_id = r.id
       WHERE s.id = $1 AND s.clinic_id = $2`,
      [id, clinicId],
    );
    if (!result.rows[0]) throw new NotFoundError("Staff member");
    return result.rows[0];
  },

  create: async (clinicId, { name, role_id }) => {
    const result = await pool.query(
      `INSERT INTO staff (clinic_id, role_id, name)
       VALUES ($1, $2, $3) RETURNING id`,
      [clinicId, role_id, name],
    );
    return staff.getById(result.rows[0].id, clinicId);
  },

  update: async (id, clinicId, { name, role_id }) => {
    await staff.getById(id, clinicId);
    await pool.query(
      "UPDATE staff SET name = $1, role_id = $2 WHERE id = $3 AND clinic_id = $4",
      [name, role_id, id, clinicId],
    );
    return staff.getById(id, clinicId);
  },

  deactivate: async (id, clinicId) => {
    await staff.getById(id, clinicId);
    await pool.query("UPDATE staff SET active = false WHERE id = $1", [id]);
  },
};

// ─── SERVICES ─────────────────────────────────────────────────────────────────

const services = {
  getAllByClinic: async (clinicId) => {
    const result = await pool.query(
      `SELECT id, name, duration_minutes, price, active, created_at
       FROM services
       WHERE clinic_id = $1
       ORDER BY name`,
      [clinicId],
    );
    return result.rows;
  },

  getById: async (id, clinicId) => {
    const result = await pool.query(
      `SELECT id, name, duration_minutes, price, active, created_at
       FROM services
       WHERE id = $1 AND clinic_id = $2`,
      [id, clinicId],
    );
    if (!result.rows[0]) throw new NotFoundError("Service");
    return result.rows[0];
  },

  create: async (clinicId, { name, duration_minutes, price }) => {
    const result = await pool.query(
      `INSERT INTO services (clinic_id, name, duration_minutes, price)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [clinicId, name, duration_minutes, price],
    );
    return services.getById(result.rows[0].id, clinicId);
  },

  update: async (id, clinicId, { name, duration_minutes, price }) => {
    await services.getById(id, clinicId);
    await pool.query(
      `UPDATE services SET name = $1, duration_minutes = $2, price = $3
       WHERE id = $4 AND clinic_id = $5`,
      [name, duration_minutes, price, id, clinicId],
    );
    return services.getById(id, clinicId);
  },

  deactivate: async (id, clinicId) => {
    await services.getById(id, clinicId);
    await pool.query("UPDATE services SET active = false WHERE id = $1", [id]);
  },
};

module.exports = { users, staff, services };
