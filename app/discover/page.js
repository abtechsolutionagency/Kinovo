'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AppPage } from '@/components/AppPage';

function DiscoverRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'travelers') router.replace('/travelers');
    else if (tab === 'groups') router.replace('/community');
    else router.replace('/travels');
  }, [router, searchParams]);

  return (
    <AppPage>
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    </AppPage>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense
      fallback={
        <AppPage>
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
        </AppPage>
      }
    >
      <DiscoverRedirect />
    </Suspense>
  );
}
