/* =====================================================
    Scheduling API - Seed Data
    Author: Savina Gabba
    Description: Initial data for testing the system
===================================================== */


/* =====================================================
    USERS
    Passwords are placeholders for development
===================================================== */

INSERT INTO users (role_id, name, email, password_hash)
VALUES
(1, 'Admin User', 'admin@scheduling.com', 'hashedpassword1'),
(3, 'John Client', 'john@example.com', 'hashedpassword2'),
(3, 'Maria Client', 'maria@example.com', 'hashedpassword3');


/* =====================================================
    STAFF
    Professionals providing services
===================================================== */

INSERT INTO staff (name, email, phone)
VALUES
('Dr. Laura Smith', 'laura@scheduling.com', '+54 341 111111'),
('Dr. Carlos Gomez', 'carlos@scheduling.com', '+54 341 222222');


/* =====================================================
    SERVICES
===================================================== */

INSERT INTO services (name, description, duration_minutes, price)
VALUES
('Physiotherapy Session', 'Physical therapy treatment session', 60, 40.00),
('Consultation', 'Initial evaluation consultation', 30, 25.00),
('Massage Therapy', 'Relaxation massage session', 60, 35.00);


/* =====================================================
    STAFF AVAILABILITY
    day_of_week:
    0 Sunday
    1 Monday
    2 Tuesday
    3 Wednesday
    4 Thursday
    5 Friday
    6 Saturday
===================================================== */

INSERT INTO staff_availability (staff_id, day_of_week, start_time, end_time)
VALUES
(1,1,'09:00','13:00'),
(1,1,'15:00','18:00'),
(1,3,'10:00','14:00'),
(2,2,'09:00','12:00'),
(2,4,'14:00','18:00');


/* =====================================================
    SAMPLE APPOINTMENTS
===================================================== */

INSERT INTO appointments
(user_id, staff_id, service_id, appointment_date, start_time, end_time, status)
VALUES
(2,1,1,'2026-03-20','10:00','11:00','scheduled'),
(3,2,2,'2026-03-21','09:30','10:00','scheduled');