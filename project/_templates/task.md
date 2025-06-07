---
id: T001
title: DB Migration for User Table
status: To Do
epic: E01
effort: S
risk: Low
dependencies: []
assignee: CursorAgent
created_at: {{YYYY-MM-DD}}
updated_at: {{YYYY-MM-DD}}
---

### Description

Create the initial database migration script to define the `users` table schema as specified in the Data Map.

### Acceptance Criteria

- [ ] A migration file is created in the `/backend/migrations` directory.
- [ ] The migration script successfully runs and creates the `users` table.
- [ ] The table includes all fields (`id`, `email`, `password_hash`, `created_at`) with correct types and constraints.

### Context Binding

- **Docs:** `@/docs/DATA_MAP.md#User-Table`
- **Code:** `@/backend/migrations/`

### Agent Notes

*Use the project's selected ORM (e.g., Prisma, Sequelize) to generate the migration file.*