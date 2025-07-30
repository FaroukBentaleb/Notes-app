# Notes App with Auth

A simple note-taking app with user authentication using Drizzle ORM and Neon PostgreSQL.

## Features

- User signup/login
- Create, view, edit, delete notes
- Secure password storage

## Tech Stack

- Frontend: React + TypeScript
- Backend: Node.js/Express
- Database: Neon (PostgreSQL) + Drizzle ORM
- Auth: JWT

## Setup

1. **Install dependencies**:

```bash
npm install
```

2. **Create .env file**:

```bash
DATABASE_URL="your_neon_connection_string"
JWT_SECRET="your_random_secret_key"
```

3. **Database schema (schema.ts)**:

```bash
import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
id: serial('id').primaryKey(),
username: varchar('username', { length: 50 }).notNull().unique(),
email: varchar('email', { length: 100 }).notNull().unique(),
password: varchar('password', { length: 100 }).notNull(),
createdAt: timestamp('created_at').defaultNow()
});

export const notes = pgTable('notes', {
id: serial('id').primaryKey(),
title: varchar('title', { length: 100 }).notNull(),
content: text('content').notNull(),
userId: integer('user_id').references(() => users.id),
createdAt: timestamp('created_at').defaultNow()
});
```

4. **Database schema (schema.ts)**:

```bash
npm drizzle-kit push:pg
```

5. **Start dev server**:

```bash
npm run dev
```
