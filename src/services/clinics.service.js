const pool = require('../config/db');
const { NotFoundError, ConflictError } = require('../middleware/errorHandler');

const getAll = async () => {
    const result = await pool.query(
        'SELECT id, name, active, created_at FROM clinics WHERE active = true ORDER BY name'
    );
    return result.rows;
};

const getById = async (id) => {
    const result = await pool.query(
        'SELECT id, name, active, created_at FROM clinics WHERE id = $1',
        [id]
    );
    if (!result.rows[0]) throw new NotFoundError('Clinic');
        return result.rows[0];
};

const create = async ({ name }) => {
    const existing = await pool.query('SELECT id FROM clinics WHERE name = $1', [name]);
    if (existing.rows[0]) throw new ConflictError('A clinic with this name already exists');

    const result = await pool.query(
        'INSERT INTO clinics (name) VALUES ($1) RETURNING id, name, active, created_at',
        [name]
    );
    return result.rows[0];
};

const update = async (id, { name }) => {
    await getById(id);
    const result = await pool.query(
        'UPDATE clinics SET name = $1 WHERE id = $2 RETURNING id, name, active, created_at',
        [name, id]
    );
    return result.rows[0];
};

const deactivate = async (id) => {
    await getById(id);
    await pool.query('UPDATE clinics SET active = false WHERE id = $1', [id]);
};

module.exports = { getAll, getById, create, update, deactivate };