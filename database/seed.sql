/* =====================================================
   Scheduling API - Seed Data (aligned with schema.sql)
===================================================== */

INSERT INTO clinics (name) VALUES
('Downtown Clinic'),
('North Clinic');

INSERT INTO users (clinic_id, role_id, name, email) VALUES
(1, 3, 'John Client', 'john@example.com'),
(1, 3, 'Maria Client', 'maria@example.com');

INSERT INTO staff (clinic_id, role_id, name) VALUES
(1, 2, 'Dr. Laura Smith'),
(1, 2, 'Dr. Carlos Gomez');

INSERT INTO services (clinic_id, name, duration_minutes, price) VALUES
(1, 'Physiotherapy Session', 60, 40.00),
(1, 'Consultation', 30, 25.00),
(1, 'Massage Therapy', 60, 35.00);

INSERT INTO appointments (clinic_id, user_id, staff_id, service_id, status_id, appointment_date) VALUES
(1, 1, 1, 1, 1, '2026-03-20T10:00:00'),
(1, 2, 2, 2, 2, '2026-03-21T09:30:00');
