# Import Kinovo APIs into Postman

## Files

| File | Purpose |
|------|---------|
| `Kinovo_API.postman_collection.json` | All API requests |
| `Kinovo_Local.postman_environment.json` | Local dev variables |

---

## Step 1 — Start the backend

```bash
cd backend
npm run dev
```

Server must be running at `http://localhost:4000`

---

## Step 2 — Import the collection

1. Open **Postman** (desktop app or [postman.com](https://www.postman.com))
2. Click **Import** (top-left)
3. Drag and drop `postman/Kinovo_API.postman_collection.json`
   - Or click **Upload Files** and select it
4. Click **Import**

You will see a collection named **Kinovo API** in the left sidebar.

---

## Step 3 — Import the environment (optional but recommended)

1. Click **Import** again
2. Select `postman/Kinovo_Local.postman_environment.json`
3. In the top-right corner, select **Kinovo Local** from the environment dropdown

---

## Step 4 — Test the APIs

Recommended order:

1. **System → Health Check** — should return `{ "success": true }`
2. **Auth → Sign Up** — creates account (invite code: `KINOVO2025`)
3. **Auth → Login** — token saved automatically to `{{token}}`
4. **Auth → Login** — token saved automatically
5. **User Profiles → Get Profile**
6. **User Profiles → Update Profile / Interests / Preferences**
7. **User Profiles → Upload Profile Image** — select file in form-data

> **Tip:** Login and Sign Up auto-save the JWT to the `token` variable via test scripts.

---

## Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `baseUrl` | `http://localhost:4000` | Backend URL |
| `token` | (auto-set) | JWT from login/signup |
| `email` | `test@kinovo.com` | Test email |
| `password` | `secret123` | Test password |
| `inviteCode` | `KINOVO2025` | Beta invite code |
| `resetToken` | (auto-set in dev) | From forgot-password |

---

## Production environment

Duplicate **Kinovo Local** in Postman and change:

```
baseUrl = https://your-production-api.com
```

---

## Share with team

Export from Postman: Collection → **...** → **Export**  
Or share the JSON files from the `postman/` folder in this repo.
