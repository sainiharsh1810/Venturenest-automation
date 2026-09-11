# VentureNest Database Module

This directory contains the database migration scripts, DDL schemas, and seed data for the VentureNest platform.

## Structure

- `migrations/001_initial_schema.sql` — PostgreSQL DDL schema definition for Users, Organisations, Projects, Artifacts, Revisions, Tasks, Audit Logs, Documents, and Mentorship tables.
- `seeds/seed_data.sql` — Initial seed records for testing Admin Web Dashboard, Student/Incubator App, and Mentors App out-of-the-box.

## Quick Start (PostgreSQL)

```bash
psql -U postgres -d venturenest -f migrations/001_initial_schema.sql
psql -U postgres -d venturenest -f seeds/seed_data.sql
```
