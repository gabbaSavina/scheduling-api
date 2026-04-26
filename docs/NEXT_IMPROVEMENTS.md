# Next Improvements

This document lists the clearest next steps to keep improving the project after the current portfolio-ready baseline.

## 1. Docker Compose

Goal: make the project easier to run on any machine with a single command.

Suggested scope:

- Add `docker-compose.yml` for API + PostgreSQL
- Add environment variables for container-based local setup
- Update the README with a Docker quickstart

Why it helps:

- Reduces local setup friction
- Makes demos more reliable
- Improves recruiter and collaborator onboarding

## 2. JWT + Authentication

Goal: move the project closer to a real production-style backend.

Suggested scope:

- Add login endpoint
- Hash passwords with `bcrypt`
- Issue JWT tokens
- Protect routes with auth middleware
- Add role-based access control for admin/staff/user flows

Why it helps:

- Adds a core backend feature expected in many APIs
- Lets the project show authorization decisions, not just CRUD
- Makes the multi-tenant design more realistic

## 3. Service Unit Tests

Goal: deepen test coverage around business rules, not only HTTP smoke checks.

Suggested scope:

- Unit tests for appointment conflict detection
- Unit tests for allowed and rejected status transitions
- Unit tests for duplicate user email handling inside the same clinic
- Isolated tests for service-layer error behavior

Why it helps:

- Protects the most important domain logic
- Makes refactors safer
- Shows stronger testing discipline in interviews

## 4. Swagger UI

Goal: make the OpenAPI contract easier to explore visually.

Suggested scope:

- Serve Swagger UI from the existing `docs/openapi.yaml`
- Add a route such as `/docs`
- Keep the OpenAPI file as the source of truth

Why it helps:

- Makes the API easier to review live
- Improves portfolio presentation
- Helps keep examples, requests, and contract aligned

## Recommended order

If the main goal is employability in the short term, a practical order would be:

1. Docker Compose
2. Service unit tests
3. JWT + authentication
4. Swagger UI

That order improves reproducibility first, then code confidence, then feature depth, and finally presentation.
