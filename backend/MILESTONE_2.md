# Kinovo — Milestone 2: User Profiles

**Status:** Complete  
**Requires:** Milestone 1 (Auth) + valid JWT token

---

## Deliverables

| # | Feature | Method | Endpoint |
|---|---------|--------|----------|
| 1 | Get profile | GET | `/api/users/me` |
| 2 | Update profile | PATCH | `/api/users/me` |
| 3 | Upload profile image | POST | `/api/users/me/avatar` |
| 4 | Travel interests | GET/PUT | `/api/users/me/interests` |
| 5 | Travel preferences | GET/PUT | `/api/users/me/preferences` |

---

## API Details

### Get Profile
```http
GET /api/users/me
Authorization: Bearer <token>
```

### Update Profile
```http
PATCH /api/users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Alex Rivera",
  "bio": "Travel lover",
  "location": "London, UK",
  "languages": ["English", "Spanish"]
}
```

### Upload Profile Image
```http
POST /api/users/me/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data

avatar: <file>
```
- Max size: 5MB
- Formats: JPEG, PNG, WebP, GIF
- Returns `avatarUrl` pointing to `/uploads/avatars/...`

### Travel Interests
```http
PUT /api/users/me/interests
{ "interests": ["Travel", "Beach", "Nightlife"] }
```

Available interests: Travel, Music, Beach, Nightlife, Culture, Adventure, Food, Photography, Wellness, Party, Nature, Shopping

### Travel Preferences
```http
PUT /api/users/me/preferences
{
  "budget": "Moderate",
  "travelStyle": "Solo",
  "accommodation": "Hotel",
  "tripDuration": "1-2 weeks",
  "nightlife": true,
  "adventure": true,
  "culture": true,
  "beach": false
}
```

---

## Frontend Integration

| Page | Feature |
|------|---------|
| `/profile` | Loads live profile from API |
| `/profile/edit` | Edit bio, location, languages |
| `/profile/edit` | Upload avatar (camera button) |
| `/profile/edit` → Interests tab | Select & save travel interests |
| `/profile/edit` → Prefs tab | Set travel preferences |

---

## Postman

Re-import `postman/Kinovo_API.postman_collection.json` — new folder **User Profiles (Milestone 2)**.

Test order:
1. Login (saves token)
2. Get Profile
3. Update Profile
4. Update Travel Interests
5. Update Travel Preferences
6. Upload Profile Image (select file in Body → form-data)

---

## Environment

Add to `backend/.env`:
```
API_BASE_URL=http://localhost:4000
```
