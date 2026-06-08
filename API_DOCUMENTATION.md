# Kinovo — Backend API Documentation

**Version:** 1.0  
**Base URL:** `https://kinovo.life/api` (production) | `http://localhost:3000/api` (development)  
**Format:** JSON  
**Authentication:** Bearer token in `Authorization` header  

---

## Summary

| Category | Count |
|----------|-------|
| Implemented (stub or working) | 11 |
| Required for production | 56 |
| **Total REST endpoints** | **67** |
| Realtime channels (Supabase) | 3 |
| Webhooks (Stripe) | 1 |

---

## Authentication

Protected endpoints require:

```
Authorization: Bearer <token>
```

### Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad request — invalid body or parameters |
| 401 | Unauthorized — missing or invalid token |
| 403 | Forbidden — insufficient permissions |
| 404 | Resource not found |
| 409 | Conflict — duplicate resource |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

### Standard Error Response

```json
{
  "success": false,
  "error": "Error type",
  "message": "Human-readable description"
}
```

---

## Rate Limits

| Feature | Free | Lite | Premium |
|---------|------|------|---------|
| AI Concierge | 0/day | 10/day | Unlimited |
| Profile enhance | 3/day | 10/day | Unlimited |
| Translation | 0/day | 50/day | Unlimited |
| General API | 100 req/min | 200 req/min | 500 req/min |

---

## 1. System

### GET `/api/`

Health check and endpoint catalog.

**Auth:** No

**Response 200:**
```json
{
  "message": "Kinovo API v1.0",
  "status": "running",
  "openai_enabled": true,
  "endpoints": ["/api/auth", "/api/users", "..."]
}
```

---

## 2. Waitlist

### GET `/api/waitlist`

**Auth:** No | **Status:** Stub

**Response 200:**
```json
{ "success": true, "message": "Added to waitlist successfully!" }
```

### POST `/api/waitlist`

Join the beta waitlist.

**Auth:** No | **Status:** Stub (logs email; DB pending)

**Request:**
```json
{ "email": "user@example.com" }
```

**Response 200:**
```json
{ "success": true, "message": "Successfully joined waitlist!" }
```

### GET `/api/waitlist/admin`

**Auth:** Admin | **Status:** Not built

**Query:** `?page=1&limit=50`

**Response 200:**
```json
{
  "success": true,
  "emails": ["user@example.com"],
  "total": 2847,
  "page": 1,
  "limit": 50
}
```

---

## 3. Authentication

### POST `/api/auth/login`

**Auth:** No | **Status:** Stub

**Request:**
```json
{ "email": "user@example.com", "password": "secret123" }
```

**Response 200:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Alex Rivera",
    "avatar": "https://...",
    "verified": true,
    "isPremium": false
  },
  "token": "jwt-token",
  "refreshToken": "refresh-token"
}
```

### POST `/api/auth/signup`

**Auth:** No | **Status:** Stub

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secret123",
  "name": "Alex Rivera",
  "inviteCode": "KINOVO2025"
}
```

**Response 200:** Same shape as login.

**Errors:** `403` if invite code invalid or expired.

### POST `/api/auth/logout`

**Auth:** Yes | **Status:** Not built

**Response 200:**
```json
{ "success": true }
```

### GET `/api/auth/me`

**Auth:** Yes | **Status:** Not built

**Response 200:**
```json
{ "success": true, "user": { /* UserProfile */ } }
```

### POST `/api/auth/refresh`

**Auth:** Yes | **Status:** Not built

**Request:**
```json
{ "refreshToken": "refresh-token" }
```

**Response 200:**
```json
{ "success": true, "token": "new-jwt", "refreshToken": "new-refresh" }
```

### POST `/api/auth/oauth`

**Auth:** No | **Status:** Not built

**Request:**
```json
{ "provider": "google", "token": "oauth-id-token" }
```

### POST `/api/auth/magic-link`

**Auth:** No | **Status:** Not built

**Request:**
```json
{ "email": "user@example.com" }
```

---

## 4. Invites

### GET `/api/invites/validate`

**Auth:** No | **Status:** Not built

**Query:** `?code=KINOVO2025`

**Response 200:**
```json
{ "success": true, "valid": true, "remainingUses": 5 }
```

### GET `/api/invites/me`

**Auth:** Yes | **Status:** Not built

**Response 200:**
```json
{
  "success": true,
  "code": "ALEX2025",
  "qrUrl": "https://kinovo.life/auth?invite=ALEX2025",
  "usesCount": 3,
  "maxUses": 10
}
```

### POST `/api/invites`

**Auth:** Yes | **Status:** Not built

**Request:**
```json
{ "maxUses": 10 }
```

**Response 201:**
```json
{ "success": true, "code": "ALEX2025", "qrUrl": "https://..." }
```

---

## 5. Users & Profiles

### UserProfile Object

```json
{
  "id": "uuid",
  "name": "Alex Rivera",
  "email": "alex@example.com",
  "avatar": "https://...",
  "bio": "Open-minded traveler...",
  "location": "London, UK",
  "verified": true,
  "trustScore": 4.8,
  "isPremium": false,
  "languages": ["English", "Spanish"],
  "interests": ["Travel", "Nightlife"],
  "memberSince": "2024-01-15"
}
```

### GET `/api/users/me`

**Auth:** Yes | **Status:** Not built

### PATCH `/api/users/me`

**Auth:** Yes | **Status:** Not built

**Request:**
```json
{
  "name": "Alex Rivera",
  "bio": "Updated bio",
  "location": "Ibiza, Spain",
  "languages": ["English", "Spanish"],
  "interests": ["Travel", "Music"]
}
```

### GET `/api/users/:id`

**Auth:** Yes | **Status:** Not built — public profile view.

### GET `/api/users/me/stats`

**Auth:** Yes | **Status:** Not built

**Response 200:**
```json
{
  "success": true,
  "connections": 156,
  "destinations": 12,
  "events": 24
}
```

### POST `/api/users/me/avatar`

**Auth:** Yes | **Status:** Not built | **Content-Type:** `multipart/form-data`

**Response 200:**
```json
{ "success": true, "avatarUrl": "https://..." }
```

### POST `/api/users/me/photos`

**Auth:** Yes | **Status:** Not built

### DELETE `/api/users/me/photos/:photoId`

**Auth:** Yes | **Status:** Not built

### POST `/api/users/me/verify`

**Auth:** Yes | **Status:** Not built — submit ID verification.

### GET `/api/users/discover`

**Auth:** Yes | **Status:** Not built

**Query:** `?destination=ibiza&interests=Travel&limit=20&offset=0`

**Response 200:**
```json
{
  "success": true,
  "users": [ /* UserProfile[] with matchScore */ ],
  "total": 45
}
```

### GET `/api/users/:id/match-score`

**Auth:** Yes | **Status:** Not built

**Response 200:**
```json
{
  "success": true,
  "score": 78,
  "reasons": ["3 shared interests: Travel, Music, Beach", "Both verified members"],
  "sharedInterests": ["Travel", "Music", "Beach"]
}
```

### GET `/api/users/me/blocks`

**Auth:** Yes | **Status:** Not built

### POST `/api/users/:id/block`

**Auth:** Yes | **Status:** Not built

### DELETE `/api/users/:id/block`

**Auth:** Yes | **Status:** Not built

---

## 6. Destinations

### GET `/api/destinations`

**Auth:** Optional | **Status:** Not built

**Query:** `?search=ibiza&tags=Beach&sort=trending`

**Response 200:**
```json
{
  "success": true,
  "destinations": [
    {
      "id": "ibiza",
      "name": "Ibiza",
      "country": "Spain",
      "image": "https://...",
      "travelers": 401,
      "description": "World-famous nightlife...",
      "tags": ["Party", "Beach", "Music"]
    }
  ]
}
```

### GET `/api/destinations/:id`

**Auth:** Optional | **Status:** Not built

### GET `/api/destinations/:id/travelers`

**Auth:** Yes | **Status:** Not built

---

## 7. Travel Groups

### GET `/api/groups`

**Auth:** Yes | **Status:** Not built

**Query:** `?destination=Ibiza&dateFrom=2025-06-01&limit=20`

### GET `/api/groups/:id`

**Auth:** Yes | **Status:** Not built

### POST `/api/groups/:id/join`

**Auth:** Yes | **Status:** Not built

### DELETE `/api/groups/:id/members/me`

**Auth:** Yes | **Status:** Not built

### POST `/api/groups`

**Auth:** Yes | **Status:** Not built

**Request:**
```json
{
  "destinationId": "ibiza",
  "title": "Summer Music Festival",
  "description": "...",
  "date": "2025-07-15",
  "maxMembers": 20
}
```

---

## 8. Connections

### POST `/api/connections`

**Auth:** Yes | **Status:** Not built

**Request:**
```json
{ "targetUserId": "uuid" }
```

### GET `/api/connections`

**Auth:** Yes | **Status:** Not built

**Query:** `?status=pending|accepted`

### PATCH `/api/connections/:id`

**Auth:** Yes | **Status:** Not built

**Request:**
```json
{ "status": "accepted" }
```

---

## 9. Messaging

### GET `/api/conversations`

**Auth:** Yes | **Status:** Not built

**Response 200:**
```json
{
  "success": true,
  "conversations": [
    {
      "id": "uuid",
      "userId": "uuid",
      "userName": "Sophie",
      "userAvatar": "https://...",
      "lastMessage": "Looking forward to Ibiza!",
      "timestamp": "2025-06-04T10:30:00Z",
      "unread": 2,
      "online": true
    }
  ]
}
```

### GET `/api/conversations/:id`

**Auth:** Yes | **Status:** Not built

### GET `/api/conversations/:id/messages`

**Auth:** Yes | **Status:** Not built

**Query:** `?before=message-id&limit=50`

### POST `/api/conversations/:id/messages`

**Auth:** Yes | **Status:** Not built

**Request:**
```json
{ "text": "Hey! Are you still coming to Ibiza?" }
```

**Flow:** Moderate content → save → broadcast via Realtime → return message.

**Response 201:**
```json
{
  "success": true,
  "message": {
    "id": "uuid",
    "senderId": "uuid",
    "text": "Hey! Are you still coming to Ibiza?",
    "timestamp": "2025-06-04T10:30:00Z",
    "translated": null
  }
}
```

**Errors:** `403` if content flagged by moderation.

### PATCH `/api/conversations/:id/read`

**Auth:** Yes | **Status:** Not built

### GET `/api/conversations/search`

**Auth:** Yes | **Status:** Not built

**Query:** `?q=ibiza`

---

## 10. Community

### GET `/api/community/discussions`

**Auth:** Yes | **Status:** Not built

**Query:** `?sort=trending&category=Travel`

### GET `/api/community/discussions/:id`

**Auth:** Yes | **Status:** Not built

### POST `/api/community/discussions`

**Auth:** Yes | **Status:** Not built

**Request:**
```json
{ "title": "Best spots in Ibiza?", "body": "Share your favorites...", "category": "Travel" }
```

### POST `/api/community/discussions/:id/replies`

**Auth:** Yes | **Status:** Not built

**Request:**
```json
{ "body": "Pacha is amazing!" }
```

### POST `/api/community/discussions/:id/vote`

**Auth:** Yes | **Status:** Not built

**Request:**
```json
{ "direction": "up" }
```

### GET `/api/community/city-groups`

**Auth:** Yes | **Status:** Not built

### POST `/api/community/city-groups/:id/join`

**Auth:** Yes | **Status:** Not built

---

## 11. AI Services

### POST `/api/ai/profile-enhance`

**Auth:** Optional | **Status:** Working

**Request:**
```json
{ "bio": "Love travel and music" }
```

**Response 200:**
```json
{ "success": true, "profile": "Enhanced bio text..." }
```

### POST `/api/ai/icebreaker`

**Auth:** Optional | **Status:** Working

**Request:**
```json
{ "profileA": "Bio text...", "profileB": "Bio text..." }
```

**Response 200:**
```json
{
  "success": true,
  "suggestions": ["Starter 1", "Starter 2", "Starter 3"]
}
```

### POST `/api/ai/moderate`

**Auth:** Internal | **Status:** Working

**Request:**
```json
{ "message": "Message text to check" }
```

**Response 200:**
```json
{
  "success": true,
  "flagged": false,
  "categories": { "harassment": false, "hate": false, "sexual": false, "violence": false }
}
```

### GET `/api/ai/discussion-prompts`

**Auth:** No | **Status:** Working

**Response 200:**
```json
{
  "success": true,
  "prompts": [
    { "title": "Best travel destinations for summer?", "preview": "Share your favorites..." }
  ]
}
```

### POST `/api/concierge`

**Auth:** Yes (M3) | **Status:** Working (not wired to UI)

**Request:**
```json
{ "message": "Best nightlife in Ibiza?" }
```

**Response 200:**
```json
{ "success": true, "response": "I'd recommend Pacha Ibiza tonight..." }
```

### GET `/api/concierge/usage`

**Auth:** Yes | **Status:** Not built

**Response 200:**
```json
{ "success": true, "used": 3, "limit": 10, "tier": "lite" }
```

### GET `/api/concierge/sessions/:id`

**Auth:** Yes | **Status:** Not built

### POST `/api/translate`

**Auth:** Yes (M3) | **Status:** Working (not wired to UI)

**Request:**
```json
{
  "text": "Hola, como estas?",
  "targetLanguage": "en",
  "sourceLanguage": "es"
}
```

**Response 200:**
```json
{
  "success": true,
  "translated": "Hello, how are you?",
  "detectedLanguage": "es",
  "targetLanguage": "en"
}
```

---

## 12. Safety

### POST `/api/reports`

**Auth:** Yes | **Status:** Not built

**Request:**
```json
{
  "type": "user",
  "targetId": "uuid",
  "description": "Inappropriate behavior",
  "evidence": "optional-screenshot-url"
}
```

### POST `/api/support/tickets`

**Auth:** Yes | **Status:** Not built

**Request:**
```json
{ "subject": "Account issue", "message": "I cannot log in..." }
```

### GET `/api/safety/emergency-contacts`

**Auth:** No | **Status:** Not built

**Query:** `?country=UK`

**Response 200:**
```json
{
  "success": true,
  "contacts": [
    { "name": "Emergency Services", "number": "999", "type": "emergency" }
  ]
}
```

---

## 13. Billing

### POST `/api/billing/checkout`

**Auth:** Yes | **Status:** Not built

**Request:**
```json
{ "tier": "lite" }
```

**Response 200:**
```json
{ "success": true, "checkoutUrl": "https://checkout.stripe.com/..." }
```

### GET `/api/billing/subscription`

**Auth:** Yes | **Status:** Not built

**Response 200:**
```json
{
  "success": true,
  "tier": "premium",
  "status": "active",
  "renewsAt": "2025-07-04T00:00:00Z"
}
```

### POST `/api/billing/webhooks/stripe`

**Auth:** Stripe signature | **Status:** Not built

Handles: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.

---

## 14. Search & Platform

### GET `/api/search`

**Auth:** Yes | **Status:** Not built

**Query:** `?q=ibiza`

**Response 200:**
```json
{
  "success": true,
  "destinations": [],
  "users": [],
  "groups": []
}
```

### GET `/api/stats`

**Auth:** No | **Status:** Not built

**Response 200:**
```json
{
  "success": true,
  "members": 2847,
  "destinations": 7,
  "countries": 42
}
```

---

## Realtime Channels (Supabase)

| Channel | Events | Purpose |
|---------|--------|---------|
| `conversation:{id}` | `message:new`, `message:read` | Live messaging |
| `presence:user:{id}` | `online`, `offline` | Online status |
| `notifications:{userId}` | `connection:request`, `group:invite` | Push-style alerts |

---

## Database Tables

| Table | Milestone |
|-------|-----------|
| `users`, `user_languages`, `user_interests` | M2 |
| `destinations` | M2 |
| `travel_groups`, `group_members` | M2 |
| `conversations`, `conversation_participants`, `messages` | M2 |
| `waitlist`, `invite_codes` | M2 |
| `connections` | M2 |
| `discussions`, `discussion_replies` | M2 |
| `city_groups`, `city_group_members` | M2 |
| `reports`, `blocks`, `support_tickets` | M2 |
| `subscriptions`, `concierge_sessions` | M4 |

Full SQL schema: [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

## Implementation Status Legend

| Label | Meaning |
|-------|---------|
| **Working** | Endpoint functional; may use OpenAI when key is set |
| **Stub** | Returns mock data; no persistence |
| **Not built** | Returns 404; planned for Milestone 2+ |

---

*See [CLIENT_MILESTONES.md](./CLIENT_MILESTONES.md) for delivery timeline and milestone plan.*
