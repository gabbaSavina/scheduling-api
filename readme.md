# Scheduling API

REST API for appointment scheduling built with Node.js, Express and PostgreSQL.

This project demonstrates backend development, relational database modeling, business rules, request validation, error handling and technical documentation in a real-world scheduling domain.

## Why This Project Matters

This project focuses on backend reasoning, not only endpoint creation.

It models a real-world scheduling domain where data integrity, appointment conflicts, status management and tenant isolation are important business concerns.

The goal of this API is to show how backend development involves more than routing requests: it requires understanding business rules, designing reliable database structures, validating input data and documenting technical decisions clearly.

This project was built as part of my transition into backend and data-oriented software development.

## Stack

- Node.js
- Express
- PostgreSQL
- express-validator
- node:test for smoke coverage

## What This Project Shows

- Multi-tenant data isolation through `clinic_id`
- Layered architecture: routes -> controllers -> services -> database
- Validation at the HTTP layer plus business rules in services
- Consistent API error responses
- SQL schema aligned with the current service layer

## Technical Highlights

- Layered backend architecture: routes, controllers, services and database access.
- Multi-tenant design using `clinic_id` to separate clinic data.
- Relational database modeling with PostgreSQL.
- Use of primary keys, foreign keys, constraints and catalog tables.
- Appointment status management through a dedicated status table.
- Backend validation for request parameters and body data.
- Consistent error response structure.
- Initial automated tests for health checks, validation and error handling.
- Technical documentation through README, OpenAPI specification and supporting docs.

## Project Structure

```text
scheduling-api/
|-- .env.example
|-- .github/
|   `-- workflows/
|       `-- ci.yml
|-- index.js
|-- package.json
|-- readme.md
|-- src/
|   |-- app.js
|   |-- config/
|   |   `-- db/
|   |       `-- db.js
|   |-- controllers/
|   |   |-- appointments.controller.js
|   |   |-- clinics.controller.js
|   |   `-- entities.controller.js
|   |-- middlewares/
|   |   |-- errorHandler.js
|   |   |-- response.js
|   |   |-- validate.js
|   |   `-- validators.js
|   |-- routes/
|   |   `-- index.js
|   `-- services/
|       |-- appointments.service.js
|       |-- clinics.service.js
|       `-- entities.service.js
|-- database/
|   |-- schema.sql
|   `-- seed.sql
|-- docs/
|   |-- app-flows.md
|   |-- demo-script.md
|   |-- http-examples.http
|   |-- NEXT_IMPROVEMENTS.md
|   |-- openapi.yaml
|   `-- PORTFOLIO_AUDIT.md
|-- test/
|   `-- app.test.js
```

## Setup

```bash
git clone https://github.com/gabbaSavina/scheduling-api.git
cd scheduling-api
npm install
cp .env.example .env
psql -U your_user -d your_db -f database/schema.sql
psql -U your_user -d your_db -f database/seed.sql
npm run dev
```

## Scripts

```bash
npm run dev
npm start
npm run check
npm test
```

## Base URL

```text
/api/v1
```

## Main Endpoints

### Clinics

- `GET /clinics`
- `GET /clinics/:id`
- `POST /clinics`
- `PUT /clinics/:id`
- `DELETE /clinics/:id`

### Clinic-scoped entities

- `GET /clinics/:clinicId/users`
- `GET /clinics/:clinicId/staff`
- `GET /clinics/:clinicId/services`
- `POST /clinics/:clinicId/users`
- `POST /clinics/:clinicId/staff`
- `POST /clinics/:clinicId/services`
- `PUT /clinics/:clinicId/users/:id`
- `PUT /clinics/:clinicId/staff/:id`
- `PUT /clinics/:clinicId/services/:id`
- `DELETE /clinics/:clinicId/users/:id`
- `DELETE /clinics/:clinicId/staff/:id`
- `DELETE /clinics/:clinicId/services/:id`

### Appointments

- `GET /clinics/:clinicId/appointments`
- `GET /clinics/:clinicId/appointments/:id`
- `POST /clinics/:clinicId/appointments`
- `PATCH /clinics/:clinicId/appointments/:id/status`

Supported filters for appointment listing:

- `status_id`
- `staff_id`
- `date`

## Example Requests

Create an appointment:

```http
POST /api/v1/clinics/1/appointments
Content-Type: application/json

{
  "user_id": 3,
  "staff_id": 2,
  "service_id": 1,
  "appointment_date": "2026-06-15T10:00:00Z"
}
```

Update appointment status:

```http
PATCH /api/v1/clinics/1/appointments/5/status
Content-Type: application/json

{ "status_id": 2 }
```

## Error Shape

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "clinicId",
      "message": "clinicId must be a positive integer"
    }
  ]
}
```

## Current Smoke Coverage

- `GET /health`
- unknown route returns `404`
- invalid route params return `422`
- invalid appointment payload returns field-level validation errors

## Portfolio Assets

- `docs/openapi.yaml`: baseline OpenAPI contract for the core endpoints
- `docs/http-examples.http`: ready-to-run request examples for local demos
- `docs/demo-script.md`: 3-minute walkthrough for interviews
- `docs/app-flows.md`: visual summary of startup, request lifecycle and test execution
- `docs/NEXT_IMPROVEMENTS.md`: roadmap for the next technical iteration of the project
- `docs/PORTFOLIO_AUDIT.md`: internal audit and delivery plan used to shape the portfolio version
- `.github/workflows/ci.yml`: CI that installs dependencies, runs syntax checks and executes the test suite

## Next Steps

If you want to see the planned evolution of the project, check `docs/NEXT_IMPROVEMENTS.md`.

That document groups the next practical upgrades into four areas:

- Docker Compose for easier local setup
- JWT authentication and role-based access
- service-level unit tests for business rules
- Swagger UI for a browsable API reference

## Known Limitations

This project is still evolving and currently has some limitations:

- Authentication and authorization are planned but not fully implemented yet.
- Appointment conflict prevention is part of the business logic, but can be strengthened further at the database level.
- Integration tests with a dedicated test database are still pending.
- API documentation can be expanded with more request and response examples.
- The current version focuses on backend structure and data modeling rather than frontend functionality.

## Notes

- `database/schema.sql` and `database/seed.sql` are the source of truth for the current local setup.
- `docs/openapi.yaml` documents the core API contract, while `docs/http-examples.http` provides executable request examples.
- `docs/PORTFOLIO_AUDIT.md` captures the audit and delivery path that led to the current portfolio-ready version.
- `docs/NEXT_IMPROVEMENTS.md` outlines the most valuable next upgrades if the project continues evolving.
