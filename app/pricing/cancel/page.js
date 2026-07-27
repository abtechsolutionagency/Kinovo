'use client';

import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppPage, PageContent } from '@/components/AppPage';

export default function PricingCancelPage() {
  return (
    <AppPage>
      <PageContent>
        <div className="text-center py-16 max-w-md mx-auto">
          <XCircle className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Checkout cancelled</h1>
          <p className="text-purple-300 mb-8">
            No worries — you can upgrade whenever you&apos;re ready.
          </p>
          <Link href="/pricing">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600">View plans</Button>
          </Link>
        </div>
      </PageContent>
    </AppPage>
  );
}
