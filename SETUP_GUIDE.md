# Kinovo - Complete Setup Guide

## 🎉 Phase 1: COMPLETE ✓

Your Kinovo MVP is **fully functional** with a beautiful UI and all core features working with mock data!

### What's Working Now:

✅ **Landing Page** - Luxury design with waitlist  
✅ **Authentication** - Login/signup with mock auth  
✅ **Discover** - Browse destinations, travelers, groups  
✅ **AI Concierge** - Chat interface with mock AI responses  
✅ **Messaging** - Full chat UI with translation toggle  
✅ **User Profiles** - Complete profile with trust scores  
✅ **Safety Center** - Comprehensive safety guidelines  
✅ **Premium Tiers** - Pricing and upgrade UI  
✅ **Mobile Navigation** - Native app-like bottom nav  
✅ **PWA Ready** - Installable web app  
✅ **Dark Theme** - Premium glassmorphism design  

---

## 🚀 Phase 2: Add Real Integrations

### Integration Priority Order:

1. **Supabase** (Essential) - Auth + Database
2. **OpenAI** (Core Feature) - AI Concierge + Translation
3. **Stripe** (Revenue) - Premium subscriptions
4. **Mapbox** (Enhancement) - Interactive maps

---

## 📋 Step-by-Step Integration Guide

### 1️⃣ SUPABASE SETUP (Required for Production)

**Time: 15 minutes | Cost: FREE**

#### A. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New Project"
5. Fill in:
   - Name: `kinovo`
   - Database Password: (generate secure password - save it!)
   - Region: (choose closest to your users)
6. Click "Create new project"
7. Wait 2-3 minutes for setup

#### B. Get Your Credentials

1. Go to Settings > API
2. Copy these values:
   ```
   Project URL: https://xxxxx.supabase.co
   anon/public key: eyJhbGc...
   ```

#### C. Add to Your .env

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

#### D. Create Database Schema

Go to SQL Editor in Supabase and run:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  bio TEXT,
  location TEXT,
  verified BOOLEAN DEFAULT false,
  trust_score DECIMAL(3,2) DEFAULT 0.0,
  is_premium BOOLEAN DEFAULT false,
  member_since TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- User languages
CREATE TABLE user_languages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  language TEXT NOT NULL
);

-- User interests
CREATE TABLE user_interests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  interest TEXT NOT NULL
);

-- Destinations
CREATE TABLE destinations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  description TEXT,
  image TEXT,
  travelers_count INTEGER DEFAULT 0
);

-- Travel groups
CREATE TABLE travel_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  destination_id TEXT REFERENCES destinations(id),
  title TEXT NOT NULL,
  description TEXT,
  date DATE,
  max_members INTEGER,
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Group members
CREATE TABLE group_members (
  group_id UUID REFERENCES travel_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (group_id, user_id)
);

-- Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Conversation participants
CREATE TABLE conversation_participants (
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (conversation_id, user_id)
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id),
  text TEXT NOT NULL,
  translated_text TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Waitlist
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Invite codes
CREATE TABLE invite_codes (
  code TEXT PRIMARY KEY,
  created_by UUID REFERENCES users(id),
  used_by UUID REFERENCES users(id),
  used_at TIMESTAMP,
  max_uses INTEGER DEFAULT 1,
  uses_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Policies (add basic policies)
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

#### E. Install Supabase Client

```bash
yarn add @supabase/supabase-js
```

#### F. Update Your Code

Create `/app/lib/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

### 2️⃣ OPENAI SETUP (Required for AI Features)

**Time: 10 minutes | Cost: ~$10 for 5,000 interactions**

#### A. Create OpenAI Account

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up / Sign in
3. Add payment method (Settings > Billing)
4. Add $10-20 credit to start

#### B. Create API Key

1. Go to API Keys section
2. Click "Create new secret key"
3. Name it: `kinovo-production`
4. Copy the key (starts with `sk-`)
5. **Save it securely** - you can't see it again!

#### C. Add to .env

```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

#### D. Install OpenAI SDK

```bash
yarn add openai
```

#### E. Update API Routes

Update `/app/app/api/[[...path]]/route.js`:

```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// In POST handler, update concierge endpoint:
if (pathname === '/api/concierge') {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a helpful travel concierge for Kinovo, an app for open-minded travelers. Provide friendly, helpful recommendations for nightlife, social spots, and travel planning."
      },
      {
        role: "user",
        content: body.message
      }
    ],
    max_tokens: 200
  });

  return NextResponse.json({
    success: true,
    response: completion.choices[0].message.content
  });
}

// For translation endpoint:
if (pathname === '/api/translate') {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `Translate the following text to ${body.targetLanguage}. Only provide the translation, no explanations.`
      },
      {
        role: "user",
        content: body.text
      }
    ]
  });

  return NextResponse.json({
    success: true,
    translated: completion.choices[0].message.content,
    detectedLanguage: body.sourceLanguage || 'auto',
    targetLanguage: body.targetLanguage
  });
}
```

#### F. Cost Estimates

- AI Concierge (GPT-4o-mini): ~$0.002 per message
- Translation: ~$0.001 per message
- 1,000 messages = ~$2-3
- $10 = approximately 3,000-5,000 AI interactions

---

### 3️⃣ STRIPE SETUP (For Premium Features)

**Time: 15 minutes | Cost: FREE (testing), 2.9% + 30¢ per transaction**

#### A. Create Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Create account
3. Complete business verification (can test immediately)

#### B. Get Test Keys

1. Go to Developers > API Keys
2. Copy:
   - Publishable key (starts with `pk_test_`)
   - Secret key (starts with `sk_test_`)

#### C. Add to .env

```bash
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

#### D. Install Stripe

```bash
yarn add stripe @stripe/stripe-js
```

#### E. Create Products in Stripe

1. Go to Products
2. Create two products:
   - **Lite**: £2.99/month recurring
   - **Premium**: £4.99/month recurring
3. Copy the Price IDs for each

#### F. Implementation

You'll need to:
- Create checkout sessions
- Set up webhooks for subscription events
- Update user premium status in database

---

### 4️⃣ MAPBOX SETUP (Optional Enhancement)

**Time: 10 minutes | Cost: FREE (50k requests/month)**

#### A. Create Mapbox Account

1. Go to [mapbox.com](https://mapbox.com)
2. Sign up
3. Go to Account > Access Tokens
4. Copy default public token (starts with `pk.`)

#### B. Add to .env

```bash
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...
```

#### C. Install Mapbox

```bash
yarn add mapbox-gl react-map-gl
```

---

## 🔄 After Adding Credentials

### Restart the Server

```bash
# In your terminal
sudo supervisorctl restart nextjs
```

### Verify Integration

1. Test authentication (Supabase)
2. Try AI concierge (OpenAI)
3. Check payment flow (Stripe)
4. View maps (Mapbox)

---

## 🎨 Customization Options

### Change Branding Colors

Edit `/app/app/globals.css`:

```css
/* Change primary colors */
--purple-400: #a78bfa;
--purple-600: #7c3aed;
--pink-400: #f472b6;
--pink-600: #db2777;
```

### Update Destinations

Edit `/app/lib/mockData.js` - add your own destinations with images

### Modify Premium Pricing

Edit landing page and profile pages to update pricing

---

## 📱 PWA Installation

### Test on Mobile

1. Open the app on your phone
2. Chrome: Menu > "Install app"
3. Safari: Share > "Add to Home Screen"
4. The app installs like a native app!

---

## 🐛 Troubleshooting

### "Can't connect to Supabase"
- Check URL and key in .env
- Verify project is active in Supabase dashboard
- Check browser console for specific errors

### "OpenAI API error"
- Verify API key is correct
- Check you have credits in your account
- Ensure key has proper permissions

### "Stripe checkout not working"
- Using test keys? Use test card: 4242 4242 4242 4242
- Check webhook is set up correctly
- Verify products exist in Stripe dashboard

### "Images not loading"
- Check image URLs are accessible
- Verify CORS settings if using custom image host
- Use CDN or Supabase Storage for production

---

## 📊 Monitoring & Analytics

### Add Posthog/Mixpanel

Track user behavior:
- Page views
- Feature usage
- Conversion rates
- User journeys

### Add Sentry

Monitor errors:
- API failures
- JavaScript errors
- Performance issues

---

## 🚀 Deployment Checklist

Before going live:

- [ ] All environment variables set
- [ ] Database schema created
- [ ] Test authentication flow
- [ ] Test AI features with real API
- [ ] Payment flow working
- [ ] Mobile responsive tested
- [ ] PWA manifest configured
- [ ] Privacy policy added
- [ ] Terms of service added
- [ ] Community guidelines published
- [ ] Safety resources available
- [ ] Email templates created
- [ ] Support email set up
- [ ] Error monitoring configured
- [ ] Analytics tracking added

---

## 💰 Cost Breakdown (Monthly)

**Free Tier:**
- Supabase: $0 (up to 500MB DB, 2GB bandwidth)
- Mapbox: $0 (up to 50k requests)

**Paid Services:**
- OpenAI: ~$50-200 (depends on usage)
- Stripe: 2.9% + 30¢ per transaction
- Hosting: Varies by platform

**Total for 100 active users:** ~$50-100/month

---

## 🎓 Next Steps

1. **Get Supabase working** - Most critical integration
2. **Add OpenAI** - Core value proposition
3. **Test thoroughly** - Use the app yourself
4. **Invite beta testers** - Get feedback
5. **Iterate based on feedback** - Improve UX
6. **Add Stripe** - Start monetizing
7. **Scale gradually** - Monitor costs and performance

---

## 📞 Need Help?

1. Check documentation for each service
2. Review error logs in browser console
3. Check Supabase/OpenAI/Stripe status pages
4. Join communities:
   - Supabase Discord
   - OpenAI Forum
   - Stripe Developer Community

---

**You've built something amazing! 🎉**

Now it's time to wire up the real integrations and launch! 🚀
