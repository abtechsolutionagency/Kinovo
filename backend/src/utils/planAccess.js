const PLAN_ORDER = { free: 0, lite: 1, premium: 2 };
const ACTIVE_STATUSES = ['active', 'trialing'];

export const FEATURE_MIN_PLAN = {
  aiConcierge: 'lite',
  translation: 'lite',
  advancedFilters: 'lite',
  unlimitedConcierge: 'premium',
  anonymousBrowsing: 'premium',
  profileBoosts: 'premium',
  privateGalleries: 'premium',
};

export function getEffectivePlan(user) {
  if (!user) return 'free';

  if (user.isPremium) return 'premium';

  const plan = user.subscriptionPlan || 'free';
  if (plan === 'free') return 'free';

  const status = user.subscriptionStatus || 'none';
  if (status === 'none') return plan;
  return ACTIVE_STATUSES.includes(status) ? plan : 'free';
}

export function hasPlanFeature(user, featureKey) {
  const minPlan = FEATURE_MIN_PLAN[featureKey];
  if (!minPlan) return false;
  const userPlan = getEffectivePlan(user);
  return PLAN_ORDER[userPlan] >= PLAN_ORDER[minPlan];
}

export function isProfileBoosted(user) {
  if (!user?.profileBoostedUntil) return false;
  return new Date(user.profileBoostedUntil) > new Date();
}

import { AppError } from '../middleware/errorHandler.js';

export function requirePlanFeature(user, featureKey) {
  if (!hasPlanFeature(user, featureKey)) {
    throw new AppError(
      FEATURE_MIN_PLAN[featureKey] === 'premium'
        ? 'Upgrade to Premium to unlock this feature'
        : 'Upgrade to Lite to unlock this feature',
      403,
      'Forbidden'
    );
  }
}
