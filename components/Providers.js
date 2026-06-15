'use client';

import { AuthProvider } from '@/components/AuthProvider';
import { ConfirmDialogProvider } from '@/components/ConfirmDialogProvider';

export default function Providers({ children }) {
  return (
    <ConfirmDialogProvider>
      <AuthProvider>{children}</AuthProvider>
    </ConfirmDialogProvider>
  );
}
