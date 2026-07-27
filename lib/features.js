import { getPlanLabel } from './plans';

export const PLAN_ORDER = { free: 0, lite: 1, premium: 2 };

export const FEATURES = {
  browseDestinations: { minPlan: 'free', label: 'Browse destinations' },
  basicMessaging: { minPlan: 'free', label: 'Basic messaging' },
  joinGroups: { minPlan: 'free', label: 'Join travel groups' },
  aiConcierge: { minPlan: 'lite', label: 'AI Concierge' },
  translation: { minPlan: 'lite', label: 'Real-time translation' },
  advancedFilters: { minPlan: 'lite', label: 'Advanced filters' },
  unlimitedConcierge: { minPlan: 'premium', label: 'Unlimited AI concierge' },
  anonymousBrowsing: { minPlan: 'premium', label: 'Anonymous browsing' },
  profileBoosts: { minPlan: 'premium', label: 'Profile boosts' },
  privateGalleries: { minPlan: 'premium', label: 'Private galleries' },
};

const ACTIVE_STATUSES = ['active', 'trialing'];

export function getEffectivePlan(user) {
  if (!user) return 'free';

  if (user.isPremium) return 'premium';

  const plan = user.subscriptionPlan || 'free';
  if (plan === 'free') return 'free';

  const status = user.subscriptionStatus || 'none';
  if (status === 'none') return plan;
  return ACTIVE_STATUSES.includes(status) ? plan : 'free';
}

export function hasFeature(user, featureKey) {
  const feature = FEATURES[featureKey];
  if (!feature) return false;
  const userPlan = getEffectivePlan(user);
  return PLAN_ORDER[userPlan] >= PLAN_ORDER[feature.minPlan];
}

export function getRequiredPlan(featureKey) {
  return FEATURES[featureKey]?.minPlan || 'lite';
}

export function getUpgradeMessage(featureKey) {
  const plan = getRequiredPlan(featureKey);
  if (plan === 'premium') return 'Upgrade to Premium to unlock this feature';
  return 'Upgrade to Lite to unlock this feature';
}

export function getUpgradeCta(featureKey) {
  const plan = getRequiredPlan(featureKey);
  return `Upgrade to ${getPlanLabel(plan)}`;
}

export function getConciergeDailyLimit(user) {
  if (hasFeature(user, 'unlimitedConcierge')) return null;
  if (hasFeature(user, 'aiConcierge')) return 10;
  return 0;
}

const CONCIERGE_STORAGE_PREFIX = 'kinovo_concierge_usage';

export function getConciergeUsageToday(userId) {
  if (typeof window === 'undefined' || !userId) return 0;
  const key = `${CONCIERGE_STORAGE_PREFIX}_${userId}_${new Date().toISOString().slice(0, 10)}`;
  return Number(localStorage.getItem(key) || 0);
}

export function incrementConciergeUsage(userId) {
  if (typeof window === 'undefined' || !userId) return;
  const today = new Date().toISOString().slice(0, 10);
  const key = `${CONCIERGE_STORAGE_PREFIX}_${userId}_${today}`;
  const next = getConciergeUsageToday(userId) + 1;
  localStorage.setItem(key, String(next));
  return next;
}

export function getPlanFeaturesForUser(user) {
  const plan = getEffectivePlan(user);
  return Object.entries(FEATURES).map(([key, feature]) => ({
    key,
    label: feature.label,
    unlocked: PLAN_ORDER[plan] >= PLAN_ORDER[feature.minPlan],
    requiredPlan: feature.minPlan,
  }));
}
