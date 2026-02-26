# Scheduling API

A RESTful backend API designed to manage appointments, staff, services and users within a multi-tenant scheduling system.

Built with Node.js, Express and PostgreSQL.

---

## Project Overview

This project was developed as part of my transition into backend engineering, with a strong focus on system design and data integrity rather than just endpoint implementation.

The main objective is to design a scheduling system that prioritizes:

- Relational data modeling
- Business rule enforcement
- Multi-tenant isolation
- Database-level integrity
- Scalable architectural decisions

---

## System Architecture

The system follows a multi-tenant architecture using a shared database model with `clinic_id` as tenant discriminator.

Each core entity includes `clinic_id` to ensure strict data isolation between tenants.

Security and integrity are enforced through:

- Backend validation
- Database constraints
- Composite uniqueness rules
- Controlled state transitions

This approach applies a **defense-in-depth strategy**, ensuring that business logic is protected at multiple layers.

---

## Core Domain Model

Main entities:

- Clinics (tenants)
- Users
- Staff
- Services
- Appointments
- Appointment Status (catalog table)
- Roles (catalog table)

Appointments act as the central transactional entity connecting users, staff and services.

---

## Database Design (ERD)

```mermaid
erDiagram
    CLINICS {
        int id PK
        string name
        boolean active
        timestamp created_at
    }

    USERS {
        int id PK
        int clinic_id FK
        int role_id FK
        string name
        string email
        boolean active
        timestamp created_at
    }

    STAFF {
        int id PK
        int clinic_id FK
        int role_id FK
        string name
        boolean active
        timestamp created_at
    }

    SERVICES {
        int id PK
        int clinic_id FK
        string name
        int duration_minutes
        decimal price
        boolean active
        timestamp created_at
    }

    APPOINTMENTS {
        int id PK
        int clinic_id FK
        int user_id FK
        int staff_id FK
        int service_id FK
        int status_id FK
        timestamp appointment_date
        timestamp created_at
    }

    APPOINTMENT_STATUS {
        int id PK
        string name
        boolean is_final
        boolean active
        timestamp created_at
    }

    ROLES {
        int id PK
        string name
        boolean active
        timestamp created_at
    }

    CLINICS ||--o{ USERS : has
    CLINICS ||--o{ STAFF : has
    CLINICS ||--o{ SERVICES : has
    CLINICS ||--o{ APPOINTMENTS : has

    USERS ||--o{ APPOINTMENTS : books
    STAFF ||--o{ APPOINTMENTS : attends
    SERVICES ||--o{ APPOINTMENTS : includes
    APPOINTMENT_STATUS ||--o{ APPOINTMENTS : defines
    ROLES ||--o{ USERS : assigned_to
    ROLES ||--o{ STAFF : assigned_to