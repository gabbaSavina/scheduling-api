# Scheduling API Demo Script

## Goal

Show in about 3 minutes that the project is clonable, executable, tested and built around real business rules.

## Before the call

1. Run `npm install`
2. Prepare `.env`
3. Load `database/schema.sql` and `database/seed.sql`
4. Start the API with `npm run dev`
5. Keep `docs/http-examples.http` ready in your editor

## Suggested 3-minute flow

### 1. Show the repo is healthy

- Open `readme.md`
- Mention the stack, the multi-tenant approach and the layered architecture
- Show `.github/workflows/ci.yml` and say the repo validates itself on push and pull request

Suggested line:

> "I wanted the project to be easy to evaluate, so I added a quickstart, smoke tests and CI before adding more features."

### 2. Show the API is running

- Run `npm test`
- Call `GET /health`
- Call `GET /api/v1/clinics`

Suggested line:

> "The API boots cleanly, has a basic health endpoint and the tests cover the first execution path plus validation behavior."

### 3. Show a business rule

- Create an appointment with `POST /api/v1/clinics/1/appointments`
- Try a conflicting appointment for the same staff and overlapping time
- Show the conflict response

Suggested line:

> "One of the core rules here is avoiding double booking for staff, so the service checks time overlap before creating the appointment."

### 4. Show safe status transitions

- Update a pending appointment to confirmed
- Try an invalid transition such as completed back to pending

Suggested line:

> "Appointment state changes are controlled in the service layer so clients cannot jump between arbitrary states."

### 5. Close with ownership

- Open `docs/openapi.yaml`
- Mention that the API contract, smoke tests and SQL files are aligned

Suggested line:

> "My focus with this project was not only writing endpoints, but making the repo understandable, reproducible and safe to evolve."

## Interview talking points

- Why `clinic_id` is the tenant discriminator
- Why validation exists at both HTTP and service layers
- Why the app was separated from `listen()` to enable tests
- How you would extend this with auth, Docker and richer observability
