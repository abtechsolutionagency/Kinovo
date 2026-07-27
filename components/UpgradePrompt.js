'use client';

import Link from 'next/link';
import { Lock, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUpgradeCta, getUpgradeMessage, getRequiredPlan } from '@/lib/features';
import { getPlanLabel } from '@/lib/plans';

export function UpgradePrompt({
  feature,
  compact = false,
  className = '',
}) {
  const requiredPlan = getRequiredPlan(feature);
  const isPremium = requiredPlan === 'premium';
  const Icon = isPremium ? Crown : Sparkles;

  if (compact) {
    return (
      <div className={`flex items-center gap-2 text-purple-300 text-xs ${className}`}>
        <Lock className="w-3.5 h-3.5 shrink-0" />
        <span>{getUpgradeMessage(feature)}</span>
        <Link href="/pricing" className="text-purple-200 underline hover:text-white shrink-0">
          {getUpgradeCta(feature)}
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-900/40 to-pink-900/20 p-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            isPremium ? 'bg-yellow-500/20' : 'bg-purple-500/20'
          }`}
        >
          <Icon className={`w-5 h-5 ${isPremium ? 'text-yellow-400' : 'text-purple-300'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm">Locked feature</p>
          <p className="text-purple-300 text-sm mt-1">{getUpgradeMessage(feature)}</p>
          <p className="text-purple-400 text-xs mt-1">
            Available on {getPlanLabel(requiredPlan)} and above
          </p>
          <Link href="/pricing" className="inline-block mt-3">
            <Button
              size="sm"
              className={
                isPremium
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-slate-950 hover:opacity-90'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600'
              }
            >
              {getUpgradeCta(feature)}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function LockedOverlay({ feature, children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <div className="pointer-events-none opacity-40 select-none">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-[1px] rounded-xl">
        <div className="pointer-events-auto max-w-sm w-full">
          <UpgradePrompt feature={feature} />
        </div>
      </div>
    </div>
  );
}
