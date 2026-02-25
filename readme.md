# Scheduling API

A backend REST API for managing appointments, staff, services and users.
Built with Node.js and PostgreSQL.

## Project Purpose

This project was built as part of my transition into backend development.
The goal is to design a scheduling system focusing on:

- Data modeling
- Relational integrity
- Business logic validation
- Multi-tenant architecture concepts

## Architecture Decisions

- Soft delete strategy for critical entities
- Appointment status implemented as a catalog table
- UNIQUE constraint to prevent double booking
- Multi-tenant design using clinic_id
- Validation in backend + database constraints (defense in depth)

## Core Entities

- Users
- Staff
- Services
- Appointments
- Appointment Status

## Tech Stack

- Node.js
- Express
- PostgreSQL
- JWT (planned)

## How to Run

1. Clone the repository
2. Run `npm install`
3. Configure environment variables
4. Run `npm start`
