# Kinovo - Travel Together

**A safer way for open-minded travelers to meet worldwide**

## 🌍 About

Kinovo is a private beta invite-only AI-powered travel and social discovery platform designed for respectful, open-minded adults. Connect with verified travelers, discover destinations, access AI-powered recommendations, and experience real-time translation.

## ✨ Features (Current MVP)

### ✅ Implemented (Phase 1 - No External APIs Required)

- **Landing Page**: Luxury design with hero section, waitlist, destination previews
- **Authentication UI**: Email/password, magic link, Google/Apple login placeholders
- **User Profiles**: Full profile system with trust scores, verification badges, interests
- **Discover System**: Browse destinations, travelers, and travel groups
- **AI Concierge UI**: Chat interface with mock responses (ready for OpenAI integration)
- **Messaging**: Full messaging UI with translation toggle (ready for real-time translation)
- **Travel Groups**: Browse and join destination-based groups
- **Safety Center**: Comprehensive safety guidelines and community standards
- **Premium Tiers**: Free, Lite (£2.99), Premium (£4.99)
- **Mobile-First Design**: Responsive PWA-ready design
- **Bottom Navigation**: Native app-like navigation
- **Dark Theme**: Premium glassmorphism design

### 🔴 Pending Integration (Phase 2 - Requires API Keys)

- **Supabase**: Authentication, database, real-time features
- **OpenAI**: AI concierge, real-time translation
- **Stripe**: Payment processing for premium features
- **Mapbox**: Interactive maps and location features

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Yarn package manager

### Installation

```bash
# Install dependencies
yarn install

# Run development server
yarn dev
```

The app will be available at `http://localhost:3000`

### Project Structure

```
/app
  /api/[[...path]]      # API routes (Next.js)
  /auth                 # Authentication pages
  /discover             # Discover destinations/travelers
  /messages             # Messaging system
  /concierge            # AI concierge
  /profile              # User profile
  /safety               # Safety center
  page.js               # Landing page
  layout.js             # Root layout
  globals.css           # Global styles

/components
  BottomNav.js          # Bottom navigation
  /ui                   # shadcn/ui components

/lib
  mockData.js           # Mock data for demo
  utils.js              # Utilities

/store
  authStore.js          # Zustand auth state
  chatStore.js          # Zustand chat state

/public
  manifest.json         # PWA manifest
```

## 🔑 Setting Up External Integrations

### 1. Supabase (Required for Production)

**Get your credentials:**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project (free tier available)
3. Go to Settings > API
4. Copy your Project URL and anon/public key

**Add to `.env`:**
```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 2. OpenAI API (Required for AI Features)

**Get your API key:**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an account (requires payment method)
3. Go to API Keys section
4. Create a new API key

**Add to `.env`:**
```bash
OPENAI_API_KEY=sk-...
```

**Estimated costs:**
- AI Concierge: ~$0.002 per message (GPT-4o-mini)
- Translation: ~$0.001 per message
- $10 credit = ~5,000 AI interactions

### 3. Stripe (Optional - For Payments)

**Get your keys:**
1. Go to [stripe.com](https://stripe.com)
2. Create account (free for testing)
3. Get test keys from Dashboard > Developers > API Keys

**Add to `.env`:**
```bash
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 4. Mapbox (Optional - For Maps)

**Get your token:**
1. Go to [mapbox.com](https://mapbox.com)
2. Sign up (free tier available)
3. Copy your default public token

**Add to `.env`:**
```bash
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...
```

## 📱 PWA Setup

The app is PWA-ready! To install:

1. Open the app in Chrome/Edge/Safari
2. Look for "Install" prompt or use browser menu
3. Click "Install" to add to home screen

Features:
- Offline support (when fully implemented)
- Native app feel
- Push notifications (when implemented)
- Add to home screen

## 🎨 Design System

**Colors:**
- Primary: Purple (#8b5cf6)
- Secondary: Pink (#ec4899)
- Background: Slate (#0a0a0a)
- Accent: Various purple/pink gradients

**Typography:**
- System fonts for optimal performance
- Bold headings with gradient text
- Readable body text with good contrast

**Components:**
- Glassmorphism cards
- Smooth animations (Framer Motion)
- Rounded corners (2xl standard)
- Gradient buttons and CTAs

## 🛡️ Safety Features

- Trust scoring system
- Verification badges
- Reporting system
- Community guidelines
- Safety tips and resources
- Anonymous browsing (Premium)
- Content moderation (when AI integrated)

## 📊 Next Steps

### Immediate (Do This Next):
1. Get Supabase credentials and integrate authentication
2. Get OpenAI API key and integrate AI concierge
3. Set up database schema in Supabase
4. Test real user flows

### Short-term:
1. Implement real-time messaging with Supabase Realtime
2. Add OpenAI translation to messages
3. Set up Stripe for premium subscriptions
4. Add Mapbox for destination maps
5. Implement file upload for profile images

### Long-term:
1. Advanced AI matching algorithms
2. Video chat integration
3. Event planning and calendar
4. Push notifications
5. Advanced moderation tools
6. Analytics dashboard

## 📝 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **State**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **AI**: OpenAI GPT-4o
- **Payments**: Stripe
- **Maps**: Mapbox
- **Icons**: Lucide React

## 👥 Community

- Invite-only private beta
- Focus on quality over quantity
- Verification required
- Trust-based system
- Safe, respectful environment

## 📝 License

Proprietary - Private Beta

## 📧 Support

For issues or questions:
- Email: support@kinovo.app (placeholder)
- Discord: Coming soon

---

**Built with ❤️ for open-minded travelers worldwide**
