/* =====================================================
    Scheduling API - Database Schema
    Author: Savina Gabba
    Description: Database schema for appointment
    scheduling system.
===================================================== */


/* =====================================================
    TABLE: roles
    Description: Defines system roles for users
    Examples: admin, staff, user
===================================================== */

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


/* =====================================================
    TABLE: users
    Description: Application users who can book
    appointments. Each user belongs to a role.
===================================================== */

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_role
        FOREIGN KEY (role_id)
        REFERENCES roles(role_id)
);


/* =====================================================
    TABLE: services
    Description: Services that can be booked
    Example: physiotherapy, consultation, massage
===================================================== */

CREATE TABLE services (
    service_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL,
    price NUMERIC(10,2),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


/* =====================================================
    TABLE: staff
    Description: Professionals providing services
===================================================== */

CREATE TABLE staff (
    staff_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(50),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


/* =====================================================
    TABLE: staff_availability
    Description: Defines weekly availability of staff
    day_of_week:
    0 = Sunday
    1 = Monday
    2 = Tuesday
    3 = Wednesday
    4 = Thursday
    5 = Friday
    6 = Saturday
===================================================== */

CREATE TABLE staff_availability (
    availability_id SERIAL PRIMARY KEY,
    staff_id INTEGER NOT NULL,
    day_of_week INTEGER NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_availability_staff
        FOREIGN KEY (staff_id)
        REFERENCES staff(staff_id)
        ON DELETE CASCADE
);


/* =====================================================
    TABLE: appointments
    Description: Booked appointments between users
    and staff for a specific service
===================================================== */

CREATE TABLE appointments (
    appointment_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    staff_id INTEGER NOT NULL,
    service_id INTEGER NOT NULL,

    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,

    status VARCHAR(20) DEFAULT 'scheduled',
    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_appointment_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_appointment_staff
        FOREIGN KEY (staff_id)
        REFERENCES staff(staff_id),

    CONSTRAINT fk_appointment_service
        FOREIGN KEY (service_id)
        REFERENCES services(service_id)
);


/* =====================================================
    INITIAL DATA
    Insert default roles for the system
===================================================== */

INSERT INTO roles (name) VALUES
('admin'),
('staff'),
('user');


/* =====================================================
    INDEXES
    Improve performance for frequent queries
===================================================== */

CREATE INDEX idx_appointments_user
ON appointments(user_id);

CREATE INDEX idx_appointments_staff
ON appointments(staff_id);

CREATE INDEX idx_appointments_date
ON appointments(appointment_date);

CREATE INDEX idx_staff_availability_staff
ON staff_availability(staff_id);