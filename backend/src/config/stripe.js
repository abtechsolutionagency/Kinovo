import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = secretKey ? new Stripe(secretKey) : null;

export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'gbp',
    features: ['Browse destinations', 'Basic messaging', 'Join travel groups'],
  },
  lite: {
    id: 'lite',
    name: 'Lite',
    price: 2.99,
    currency: 'gbp',
    priceId: process.env.STRIPE_PRICE_LITE || '',
    features: [
      'Everything in Free',
      'AI concierge (10/day)',
      'Real-time translation',
      'Advanced filters',
    ],
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 4.99,
    currency: 'gbp',
    priceId: process.env.STRIPE_PRICE_PREMIUM || '',
    features: [
      'Everything in Lite',
      'Unlimited AI concierge',
      'Anonymous browsing',
      'Profile boosts',
      'Private galleries',
    ],
  },
};

export function getFrontendUrl() {
  const origin = process.env.FRONTEND_URL || process.env.CORS_ORIGIN?.split(',')?.[0];
  return (origin || 'http://localhost:3000').replace(/\/$/, '');
}

export function planFromPriceId(priceId) {
  if (!priceId) return 'free';
  if (priceId === PLANS.lite.priceId) return 'lite';
  if (priceId === PLANS.premium.priceId) return 'premium';
  return 'free';
}

export function assertStripeConfigured() {
  if (!stripe) {
    throw new Error('Stripe is not configured. Set STRIPE_SECRET_KEY in backend .env');
  }
}
