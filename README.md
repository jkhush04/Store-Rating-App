# Store Rating Platform

A full-stack web app where users can rate stores (1-5), with three roles:
System Administrator, Normal User, and Store Owner.

## Tech Stack
- **Backend:** Node.js, Express
- **Database:** MySQL
- **Frontend:** React (Vite) + React Router
- **Auth:** JWT + bcrypt

## Folder Structure
```
rating-app/
  server/     Express API + MySQL access
  client/     React frontend
  mysql_schema.sql   Database schema (also copied into server/database/)
```

## Prerequisites
- Node.js (v18+ recommended)
- MySQL Server running locally

## Setup

### 1. Database
Create the database and load the schema:
```bash
mysql -u root -p
CREATE DATABASE rating_app;
EXIT;

mysql -u root -p rating_app < server/database/mysql_schema.sql
```

### 2. Backend
```bash
cd server
cp .env.example .env
# Edit .env — set DB_PASSWORD to your MySQL password,
# and JWT_SECRET to any long random string.
npm install
npm run dev
```
Runs on `http://localhost:5000`. Confirm it's working:
`GET http://localhost:5000/api/health` should return `{"success":true, ...}`.

### 3. Frontend
```bash
cd client
cp .env.example .env
# Default VITE_API_BASE_URL already points at the backend above.
npm install
npm run dev
```
Runs on `http://localhost:5173`.

## Bootstrapping the first Admin account

The public Signup page only creates **Normal User** accounts (by design —
matches the assignment spec). To get your first Admin, sign up a regular
account through the UI, then promote it once via SQL:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com';
```

Log out and log back in with that account — every Admin after this one
can be created directly through the Admin Dashboard's "Add User" form
(role dropdown includes Admin, Normal User, Store Owner).

## Roles & What Each Can Do

| Role | Capabilities |
|---|---|
| **Admin** | Dashboard stats, create users (any role) & stores, view/filter/sort user & store listings, view user details |
| **Normal User** | Sign up, search stores, view overall + own rating, submit/modify rating (1-5) |
| **Store Owner** | View average rating of their store, view list of users who rated it |
| **All roles** | Log in/out, update their own password |

## Form Validation Rules
- **Name:** 20-60 characters
- **Address:** max 400 characters
- **Password:** 8-16 characters, at least 1 uppercase letter, 1 special character
- **Email:** standard email format

Enforced both client-side (React forms) and server-side (`express-validator`).

## API Overview

| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/signup` | Public |
| POST | `/api/auth/login` | Public |
| PUT | `/api/auth/update-password` | Any logged-in user |
| GET | `/api/admin/dashboard` | Admin |
| POST | `/api/admin/users` | Admin |
| GET | `/api/admin/users` | Admin |
| GET | `/api/admin/users/:id` | Admin |
| POST | `/api/admin/stores` | Admin |
| GET | `/api/admin/stores` | Admin |
| GET | `/api/stores` | Normal User |
| POST | `/api/stores/:id/rating` | Normal User |
| GET | `/api/owner/dashboard` | Store Owner |

## Notes
- Passwords are hashed with bcrypt before storage — never stored in plain text.
- JWT tokens carry `{ id, role, email }` and are required (as a Bearer token)
  on every protected route.
- Store ratings use a `UNIQUE(user_id, store_id)` constraint with
  `ON DUPLICATE KEY UPDATE`, so submitting and modifying a rating is the
  same API call.