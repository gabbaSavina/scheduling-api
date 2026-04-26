# Scheduling API

REST API for multi-tenant scheduling management with clinics, users, staff, services and appointments.

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

## Project Structure

```text
scheduling-api/
|-- index.js
|-- src/
|   |-- app.js
|   |-- config/
|   |   `-- db/
|   |       `-- db.js
|   |-- controllers/
|   |-- middlewares/
|   |-- routes/
|   `-- services/
|-- database/
|   |-- schema.sql
|   `-- seed.sql
|-- test/
|   `-- app.test.js
`-- PORTFOLIO_AUDIT.md
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
- `.github/workflows/ci.yml`: CI that installs dependencies, runs syntax checks and executes the test suite

## Notes

The portfolio audit is available in `PORTFOLIO_AUDIT.md` and the schema/seed files in `database/` reflect the current API model.
