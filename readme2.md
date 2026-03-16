# Scheduling API

A RESTful backend API for managing appointments, staff, services and users within a multi-tenant scheduling system.

Built with **Node.js**, **Express** and **PostgreSQL**.

---

## Project Overview

Developed as a portfolio project focused on backend engineering fundamentals, with emphasis on system design and data integrity over raw feature count.

Key architectural decisions:
- **Multi-tenant isolation** via `clinic_id` scoping on every entity
- **Layered architecture**: routes → controllers → services → database
- **Defense-in-depth validation**: input validation at the HTTP layer + business rules in services + constraints at the DB level
- **Controlled state transitions** for appointment status (no arbitrary status changes allowed)
- **Staff conflict detection**: prevents double-booking by checking appointment time overlap

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Database | PostgreSQL |
| Validation | express-validator |

---

## Project Structure

```
scheduling-api/
├── index.js                    # Entry point
├── src/
│   ├── config/
│   │   └── db.js               # PostgreSQL connection pool
│   ├── routes/
│   │   └── index.js            # All routes
│   ├── controllers/
│   │   ├── clinics.controller.js
│   │   ├── appointments.controller.js
│   │   └── entities.controller.js  # Users, Staff, Services
│   ├── services/
│   │   ├── clinics.service.js
│   │   ├── appointments.service.js  # Business logic + conflict detection
│   │   └── entities.service.js
│   └── middleware/
│       ├── errorHandler.js     # Centralized error handling
│       ├── validate.js         # Validation middleware
│       └── validators.js       # Validation rules per entity
├── database/
│   └── schema.sql              # DB schema and seed data
└── .env.example
```

---

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/gabbaSavina/scheduling-api.git
cd scheduling-api

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# 4. Set up the database
psql -U your_user -d your_db -f database/schema.sql

# 5. Start the server
npm run dev
```

---

## API Endpoints

All routes are prefixed with `/api/v1`.

### Clinics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/clinics` | List all active clinics |
| GET | `/clinics/:id` | Get clinic by ID |
| POST | `/clinics` | Create clinic |
| PUT | `/clinics/:id` | Update clinic |
| DELETE | `/clinics/:id` | Deactivate clinic |

### Users / Staff / Services *(scoped by clinic)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/clinics/:clinicId/users` | List users in clinic |
| POST | `/clinics/:clinicId/users` | Create user |
| PUT | `/clinics/:clinicId/users/:id` | Update user |
| DELETE | `/clinics/:clinicId/users/:id` | Deactivate user |

*(Same pattern applies for `/staff` and `/services`)*

### Appointments *(scoped by clinic)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/clinics/:clinicId/appointments` | List appointments (supports `?status_id=`, `?staff_id=`, `?date=`) |
| GET | `/clinics/:clinicId/appointments/:id` | Get appointment by ID |
| POST | `/clinics/:clinicId/appointments` | Create appointment |
| PATCH | `/clinics/:clinicId/appointments/:id/status` | Update appointment status |

---

## Usage Examples

**Create an appointment**
```bash
POST /api/v1/clinics/1/appointments
Content-Type: application/json

{
  "user_id": 3,
  "staff_id": 2,
  "service_id": 1,
  "appointment_date": "2025-06-15T10:00:00"
}
```

**Update appointment status**
```bash
PATCH /api/v1/clinics/1/appointments/5/status
Content-Type: application/json

{ "status_id": 2 }
```

**Filter appointments by date and staff**
```bash
GET /api/v1/clinics/1/appointments?staff_id=2&date=2025-06-15
```

---

## Appointment Status Flow

```
pending → confirmed → completed
    ↓           ↓
cancelled   cancelled
```

Transitions outside this flow are rejected with a `400 Bad Request`.

---

## Error Responses

All errors follow a consistent structure:

```json
{
  "status": "error",
  "message": "Staff already has an appointment at this time"
}
```

Validation errors include field-level detail:

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "valid email is required" }
  ]
}
```# Scheduling API

A RESTful backend API for managing appointments, staff, services and users within a multi-tenant scheduling system.

Built with **Node.js**, **Express** and **PostgreSQL**.

---

## Project Overview

Developed as a portfolio project focused on backend engineering fundamentals, with emphasis on system design and data integrity over raw feature count.

Key architectural decisions:
- **Multi-tenant isolation** via `clinic_id` scoping on every entity
- **Layered architecture**: routes → controllers → services → database
- **Defense-in-depth validation**: input validation at the HTTP layer + business rules in services + constraints at the DB level
- **Controlled state transitions** for appointment status (no arbitrary status changes allowed)
- **Staff conflict detection**: prevents double-booking by checking appointment time overlap

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Database | PostgreSQL |
| Validation | express-validator |

---

## Project Structure

```
scheduling-api/
├── index.js                    # Entry point
├── src/
│   ├── config/
│   │   └── db.js               # PostgreSQL connection pool
│   ├── routes/
│   │   └── index.js            # All routes
│   ├── controllers/
│   │   ├── clinics.controller.js
│   │   ├── appointments.controller.js
│   │   └── entities.controller.js  # Users, Staff, Services
│   ├── services/
│   │   ├── clinics.service.js
│   │   ├── appointments.service.js  # Business logic + conflict detection
│   │   └── entities.service.js
│   └── middleware/
│       ├── errorHandler.js     # Centralized error handling
│       ├── validate.js         # Validation middleware
│       └── validators.js       # Validation rules per entity
├── database/
│   └── schema.sql              # DB schema and seed data
└── .env.example
```

---

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/gabbaSavina/scheduling-api.git
cd scheduling-api

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# 4. Set up the database
psql -U your_user -d your_db -f database/schema.sql

# 5. Start the server
npm run dev
```

---

## API Endpoints

All routes are prefixed with `/api/v1`.

### Clinics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/clinics` | List all active clinics |
| GET | `/clinics/:id` | Get clinic by ID |
| POST | `/clinics` | Create clinic |
| PUT | `/clinics/:id` | Update clinic |
| DELETE | `/clinics/:id` | Deactivate clinic |

### Users / Staff / Services *(scoped by clinic)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/clinics/:clinicId/users` | List users in clinic |
| POST | `/clinics/:clinicId/users` | Create user |
| PUT | `/clinics/:clinicId/users/:id` | Update user |
| DELETE | `/clinics/:clinicId/users/:id` | Deactivate user |

*(Same pattern applies for `/staff` and `/services`)*

### Appointments *(scoped by clinic)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/clinics/:clinicId/appointments` | List appointments (supports `?status_id=`, `?staff_id=`, `?date=`) |
| GET | `/clinics/:clinicId/appointments/:id` | Get appointment by ID |
| POST | `/clinics/:clinicId/appointments` | Create appointment |
| PATCH | `/clinics/:clinicId/appointments/:id/status` | Update appointment status |

---

## Usage Examples

**Create an appointment**
```bash
POST /api/v1/clinics/1/appointments
Content-Type: application/json

{
  "user_id": 3,
  "staff_id": 2,
  "service_id": 1,
  "appointment_date": "2025-06-15T10:00:00"
}
```

**Update appointment status**
```bash
PATCH /api/v1/clinics/1/appointments/5/status
Content-Type: application/json

{ "status_id": 2 }
```

**Filter appointments by date and staff**
```bash
GET /api/v1/clinics/1/appointments?staff_id=2&date=2025-06-15
```

---

## Appointment Status Flow

```
pending → confirmed → completed
    ↓           ↓
cancelled   cancelled
```

Transitions outside this flow are rejected with a `400 Bad Request`.

---

## Error Responses

All errors follow a consistent structure:

```json
{
  "status": "error",
  "message": "Staff already has an appointment at this time"
}
```

Validation errors include field-level detail:

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "valid email is required" }
  ]
}
```