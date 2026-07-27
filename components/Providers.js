'use client';

import { AuthProvider } from '@/components/AuthProvider';
import { PresenceProvider } from '@/components/PresenceProvider';
import { ConfirmDialogProvider } from '@/components/ConfirmDialogProvider';

export default function Providers({ children }) {
  return (
    <ConfirmDialogProvider>
      <AuthProvider>
        <PresenceProvider>{children}</PresenceProvider>
      </AuthProvider>
    </ConfirmDialogProvider>
  );
}
