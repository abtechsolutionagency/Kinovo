'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppPage, PageContent } from '@/components/AppPage';
import { useAuthStore } from '@/store/authStore';
import { billingApi, authApi } from '@/lib/apiClient';
import { getPlanLabel } from '@/lib/plans';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token, isInitializing, setUser } = useAuthStore();
  const [status, setStatus] = useState('loading');
  const [plan, setPlan] = useState('premium');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (isInitializing) return;

    if (!sessionId) {
      setStatus('error');
      return;
    }

    if (!token) {
      setStatus('error');
      return;
    }

    let cancelled = false;

    async function verify() {
      try {
        const data = await billingApi.verifySession(sessionId, token);
        const me = await authApi.me(token);
        if (cancelled) return;
        setUser(me.user);
        if (data.billing) setPlan(data.billing.plan);
        setStatus('success');
      } catch {
        if (!cancelled) setStatus('error');
      }
    }

    verify();

    return () => {
      cancelled = true;
    };
  }, [token, isInitializing, sessionId, setUser]);

  if (isInitializing || status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        <p className="text-purple-300">Confirming your subscription...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="text-center py-16">
        <p className="text-red-300 mb-4">
          We could not confirm your payment. If you were charged, your plan may still update shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/pricing">
            <Button className="bg-purple-600">Back to pricing</Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline" className="border-purple-500/30 text-purple-200">
              Check profile
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-16 max-w-md mx-auto">
      <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-white mb-2">You&apos;re on {getPlanLabel(plan)}!</h1>
      <p className="text-purple-300 mb-8">
        Your subscription is active. Enjoy your upgraded Kinovo experience.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={() => router.push('/travels')} className="bg-gradient-to-r from-purple-600 to-pink-600">
          Start exploring
        </Button>
        <Link href="/concierge">
          <Button variant="outline" className="w-full border-purple-500/30 text-purple-200">
            Try AI Concierge
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function PricingSuccessPage() {
  return (
    <AppPage>
      <PageContent>
        <Suspense
          fallback={
            <div className="flex justify-center py-24">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </PageContent>
    </AppPage>
  );
}
