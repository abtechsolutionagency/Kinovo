'use client';

import { useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import {
  getEffectivePlan,
  hasFeature,
  getConciergeDailyLimit,
  getConciergeUsageToday,
  getPlanFeaturesForUser,
} from '@/lib/features';

export function usePlanFeatures() {
  const { user } = useAuthStore();

  return useMemo(() => {
    const plan = getEffectivePlan(user);
    const conciergeLimit = getConciergeDailyLimit(user);
    const conciergeUsed = conciergeLimit ? getConciergeUsageToday(user?.id) : 0;

    return {
      user,
      plan,
      hasFeature: (featureKey) => hasFeature(user, featureKey),
      features: getPlanFeaturesForUser(user),
      conciergeLimit,
      conciergeUsed,
      conciergeRemaining:
        conciergeLimit === null ? null : Math.max(0, (conciergeLimit || 0) - conciergeUsed),
      canUseConcierge:
        hasFeature(user, 'aiConcierge') &&
        (conciergeLimit === null || conciergeUsed < conciergeLimit),
      isPaid: plan === 'lite' || plan === 'premium',
      isLite: plan === 'lite',
      isPremium: plan === 'premium',
    };
  }, [user]);
}
