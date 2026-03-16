const pool = require('../config/db');
const { NotFoundError, BadRequestError, ConflictError } = require('../middleware/errorHandler');

const BASE_QUERY = `
    SELECT
        a.id,
        a.clinic_id,
        a.appointment_date,
        a.created_at,
        json_build_object('id', u.id, 'name', u.name, 'email', u.email) AS user,
        json_build_object('id', st.id, 'name', st.name) AS staff,
        json_build_object('id', sv.id, 'name', sv.name, 'duration_minutes', sv.duration_minutes, 'price', sv.price) AS service,
        json_build_object('id', aps.id, 'name', aps.name, 'is_final', aps.is_final) AS status
    FROM appointments a
    JOIN users u ON a.user_id = u.id
    JOIN staff st ON a.staff_id = st.id
    JOIN services sv ON a.service_id = sv.id
    JOIN appointment_status aps ON a.status_id = aps.id
`;

const getAllByClinic = async (clinicId, filters = {}) => {
    const conditions = ['a.clinic_id = $1'];
        const values = [clinicId];
    let i = 2;

    if (filters.status_id) {
        conditions.push(`a.status_id = $${i++}`);
        values.push(filters.status_id);
    }
    if (filters.staff_id) {
        conditions.push(`a.staff_id = $${i++}`);
        values.push(filters.staff_id);
    }
    if (filters.date) {
        conditions.push(`a.appointment_date::date = $${i++}`);
        values.push(filters.date);
    }

    const query = `${BASE_QUERY} WHERE ${conditions.join(' AND ')} ORDER BY a.appointment_date`;
    const result = await pool.query(query, values);
    return result.rows;
};

const getById = async (id, clinicId) => {
    const result = await pool.query(
        `${BASE_QUERY} WHERE a.id = $1 AND a.clinic_id = $2`,
        [id, clinicId]
    );
    if (!result.rows[0]) throw new NotFoundError('Appointment');
    return result.rows[0];
};

const _checkStaffConflict = async (staffId, appointmentDate, durationMinutes, excludeId = null) => {
    const endTime = new Date(new Date(appointmentDate).getTime() + durationMinutes * 60000);

    const query = `
        SELECT a.id FROM appointments a
        JOIN services sv ON a.service_id = sv.id
        JOIN appointment_status aps ON a.status_id = aps.id
        WHERE a.staff_id = $1
        AND aps.is_final = false
        AND a.appointment_date < $2
        AND (a.appointment_date + (sv.duration_minutes || ' minutes')::interval) > $3
        ${excludeId ? 'AND a.id != $4' : ''}
    `;
    const values = excludeId
        ? [staffId, endTime, appointmentDate, excludeId]
        : [staffId, endTime, appointmentDate];

    const result = await pool.query(query, values);
    return result.rows.length > 0;
};

const create = async (clinicId, { user_id, staff_id, service_id, appointment_date }) => {
  // Verificar que todos los recursos pertenecen a la clínica
    const [userRes, staffRes, serviceRes, statusRes] = await Promise.all([
        pool.query('SELECT id FROM users WHERE id = $1 AND clinic_id = $2 AND active = true', [user_id, clinicId]),
        pool.query('SELECT id FROM staff WHERE id = $1 AND clinic_id = $2 AND active = true', [staff_id, clinicId]),
        pool.query('SELECT id, duration_minutes FROM services WHERE id = $1 AND clinic_id = $2 AND active = true', [service_id, clinicId]),
        pool.query("SELECT id FROM appointment_status WHERE name = 'pending' AND active = true"),
    ]);

    if (!userRes.rows[0]) throw new BadRequestError('User not found or inactive in this clinic');
    if (!staffRes.rows[0]) throw new BadRequestError('Staff not found or inactive in this clinic');
    if (!serviceRes.rows[0]) throw new BadRequestError('Service not found or inactive in this clinic');

    const durationMinutes = serviceRes.rows[0].duration_minutes;
    const hasConflict = await _checkStaffConflict(staff_id, appointment_date, durationMinutes);
    if (hasConflict) throw new ConflictError('Staff already has an appointment at this time');

    const initialStatusId = statusRes.rows[0].id;

    const result = await pool.query(
        `INSERT INTO appointments (clinic_id, user_id, staff_id, service_id, status_id, appointment_date)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id`,
        [clinicId, user_id, staff_id, service_id, initialStatusId, appointment_date]
    );

    return getById(result.rows[0].id, clinicId);
};

// Transiciones de estado permitidas
const ALLOWED_TRANSITIONS = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['completed', 'cancelled'],
    cancelled: [],
    completed: [],
};

const updateStatus = async (id, clinicId, { status_id }) => {
    const appointment = await getById(id, clinicId);

    if (appointment.status.is_final) {
        throw new BadRequestError(`Cannot change status of a ${appointment.status.name} appointment`);
    }

    const newStatusRes = await pool.query(
        'SELECT id, name, is_final FROM appointment_status WHERE id = $1 AND active = true',
        [status_id]
    );
    if (!newStatusRes.rows[0]) throw new BadRequestError('Invalid status');

    const newStatusName = newStatusRes.rows[0].name;
    const allowed = ALLOWED_TRANSITIONS[appointment.status.name] || [];

    if (!allowed.includes(newStatusName)) {
        throw new BadRequestError(
        `Cannot transition from '${appointment.status.name}' to '${newStatusName}'`
        );
    }

    await pool.query('UPDATE appointments SET status_id = $1 WHERE id = $2', [status_id, id]);
    return getById(id, clinicId);
};

module.exports = { getAllByClinic, getById, create, updateStatus };