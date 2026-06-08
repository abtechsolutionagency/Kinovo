# Kinovo Backend

Express + MongoDB API server for Kinovo.

## Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

Server runs at **http://localhost:4000**

## Auth Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/signup` | No | Create account (requires invite code) |
| POST | `/api/auth/login` | No | Sign in |
| POST | `/api/auth/logout` | Yes | Sign out |
| GET | `/api/auth/me` | Yes | Current user profile |

### Signup

```json
POST /api/auth/signup
{
  "email": "user@example.com",
  "password": "secret123",
  "name": "Alex Rivera",
  "inviteCode": "KINOVO2025"
}
```

### Login

```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "secret123"
}
```

### Authenticated requests

```
Authorization: Bearer <token>
```

## Default invite code

`KINOVO2025` is seeded on first startup (configurable via `DEFAULT_INVITE_CODE`).

## Frontend

Set in the Next.js app root `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```
