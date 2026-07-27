export const PLAN_CARDS = [
  {
    id: 'free',
    name: 'Free',
    price: '£0',
    priceNote: 'forever',
    highlight: false,
    features: ['Browse destinations', 'Basic messaging', 'Join travel groups'],
  },
  {
    id: 'lite',
    name: 'Lite',
    price: '£2.99',
    priceNote: '/month',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Everything in Free',
      'AI concierge (10/day)',
      'Real-time translation',
      'Advanced filters',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '£4.99',
    priceNote: '/month',
    highlight: false,
    premium: true,
    features: [
      'Everything in Lite',
      'Unlimited AI concierge',
      'Anonymous browsing',
      'Profile boosts',
      'Private galleries',
    ],
  },
];

export function getPlanLabel(planId) {
  if (planId === 'premium') return 'Premium';
  if (planId === 'lite') return 'Lite';
  return 'Free';
}

export function hasPaidPlan(planId) {
  return planId === 'lite' || planId === 'premium';
}
