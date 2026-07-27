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

## Stripe subscriptions

Kinovo supports **Free**, **Lite (£2.99/mo)**, and **Premium (£4.99/mo)** via Stripe Checkout.

### 1. Create products in Stripe Dashboard

- Create two recurring prices (GBP): Lite and Premium
- Copy each Price ID (`price_...`)

### 2. Backend `.env`

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_LITE=price_...
STRIPE_PRICE_PREMIUM=price_...
FRONTEND_URL=http://localhost:3000
```

### 3. Webhook (local dev)

```bash
stripe listen --forward-to localhost:4000/api/billing/webhook
```

Use the printed `whsec_...` as `STRIPE_WEBHOOK_SECRET`.

### Billing API

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/billing/plans` | No | Plan metadata |
| GET | `/api/billing/status` | Yes | Current user subscription |
| POST | `/api/billing/checkout` | Yes | Start Stripe Checkout (`{ "plan": "lite" \| "premium" }`) |
| POST | `/api/billing/portal` | Yes | Stripe Customer Portal |
| GET | `/api/billing/verify?session_id=` | Yes | Confirm checkout after redirect |
| POST | `/api/billing/webhook` | Stripe | Subscription sync (raw body) |

### User flow

1. User opens `/pricing` in the app
2. Clicks **Upgrade to Lite** or **Upgrade to Premium**
3. Backend creates Stripe Checkout Session → redirect to Stripe
4. On success → `/pricing/success` verifies session and updates `subscriptionPlan`
5. Webhooks keep plan in sync on renewals/cancellations
6. **Manage billing** opens Stripe Customer Portal for plan changes/cancel
