'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Crown, Heart, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/BottomNav';
import { AppPage, PageContent, PageHeader } from '@/components/AppPage';
import { useAuthStore } from '@/store/authStore';
import { billingApi } from '@/lib/apiClient';
import { PLAN_CARDS, getPlanLabel } from '@/lib/plans';
import { getEffectivePlan } from '@/lib/features';
import { toast } from 'sonner';

export default function PricingPage() {
  const { token, user, setUser, refreshSession } = useAuthStore();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const currentPlan = getEffectivePlan(user);

  useEffect(() => {
    if (token) refreshSession();
  }, [token, refreshSession]);

  const handleCheckout = async (planId) => {
    if (!token) {
      toast.error('Please sign in to upgrade');
      return;
    }
    if (planId === 'free') return;

    setLoadingPlan(planId);
    try {
      const data = await billingApi.createCheckout(planId, token);
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      toast.error(err.message || 'Could not start checkout');
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleManageBilling = async () => {
    if (!token) return;
    setPortalLoading(true);
    try {
      const data = await billingApi.createPortal(token);
      if (data.url) window.location.href = data.url;
    } catch (err) {
      toast.error(err.message || 'Could not open billing portal');
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <AppPage>
      <PageHeader
        title="Choose Your Experience"
        subtitle="Start free, upgrade anytime"
        action={
          user && (currentPlan !== 'free' || user?.subscriptionPlan) ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleManageBilling}
              disabled={portalLoading || currentPlan === 'free'}
              className="border-purple-500/30 text-purple-200"
            >
              {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Manage billing'}
            </Button>
          ) : null
        }
      />

      <PageContent>
        {user && (
          <div className="mb-6 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-3 text-sm text-purple-200">
            Current plan: <span className="font-semibold text-white">{getPlanLabel(currentPlan)}</span>
            {user.subscriptionStatus && user.subscriptionStatus !== 'none' && (
              <span className="text-purple-400"> · {user.subscriptionStatus}</span>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PLAN_CARDS.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            const isDowngrade =
              (currentPlan === 'premium' && plan.id === 'lite') ||
              (currentPlan !== 'free' && plan.id === 'free');
            const isUpgrade = !isCurrent && !isDowngrade && plan.id !== 'free';

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 border ${
                  plan.highlight
                    ? 'border-pink-500/40 bg-white/5'
                    : plan.premium
                      ? 'border-purple-500/30 bg-gradient-to-br from-purple-900/50 to-pink-900/30'
                      : 'border-purple-500/20 bg-white/5'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-medium">
                    {plan.badge}
                  </div>
                )}

                <div className="flex items-center gap-2 mb-2">
                  {plan.premium && <Crown className="w-5 h-5 text-yellow-400" />}
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                </div>

                <div className="mb-5">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-purple-400 text-sm ml-1">{plan.priceNote}</span>
                </div>

                <ul className="space-y-2.5 mb-6 text-purple-300 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Heart className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <Button disabled className="w-full bg-green-600/80">
                    Current plan
                  </Button>
                ) : isDowngrade ? (
                  <Button variant="outline" disabled className="w-full border-purple-500/30 text-purple-400">
                    Included in your plan
                  </Button>
                ) : isUpgrade ? (
                  <Button
                    onClick={() => handleCheckout(plan.id)}
                    disabled={loadingPlan === plan.id}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    {loadingPlan === plan.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </Button>
                ) : (
                  <Button variant="outline" disabled className="w-full border-purple-500/30 text-purple-300">
                    Included
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {!token && (
          <p className="text-center text-purple-400 text-sm mt-8">
            <Link href="/auth" className="text-purple-200 underline hover:text-white">
              Sign in
            </Link>{' '}
            to upgrade your plan.
          </p>
        )}

        <div className="mt-8 flex items-center justify-center gap-2 text-purple-400 text-xs">
          <Sparkles className="w-4 h-4" />
          Secure payments powered by Stripe
        </div>
      </PageContent>

      <BottomNav />
    </AppPage>
  );
}
