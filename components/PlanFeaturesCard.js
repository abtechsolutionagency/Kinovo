'use client';

import Link from 'next/link';
import { Check, Lock, Crown, Sparkles } from 'lucide-react';
import { getPlanLabel } from '@/lib/plans';
import { getPlanFeaturesForUser, getEffectivePlan } from '@/lib/features';

export function PlanFeaturesCard({ user, className = '' }) {
  const plan = getEffectivePlan(user);
  const features = getPlanFeaturesForUser(user);

  return (
    <div className={`rounded-2xl border border-purple-500/30 bg-white/5 p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-purple-300 text-sm">Your plan</p>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            {plan === 'premium' && <Crown className="w-5 h-5 text-yellow-400" />}
            {plan === 'lite' && <Sparkles className="w-5 h-5 text-purple-400" />}
            {getPlanLabel(plan)}
          </h3>
        </div>
        {plan !== 'premium' && (
          <Link
            href="/pricing"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
          >
            {plan === 'free' ? 'Upgrade' : 'Go Premium'}
          </Link>
        )}
      </div>

      <ul className="space-y-2">
        {features.map((feature) => (
          <li key={feature.key} className="flex items-center gap-2 text-sm">
            {feature.unlocked ? (
              <Check className="w-4 h-4 text-green-400 shrink-0" />
            ) : (
              <Lock className="w-4 h-4 text-purple-500 shrink-0" />
            )}
            <span className={feature.unlocked ? 'text-purple-100' : 'text-purple-500'}>
              {feature.label}
            </span>
            {!feature.unlocked && (
              <span className="text-purple-500 text-xs ml-auto">
                {getPlanLabel(feature.requiredPlan)}+
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
