"use client";

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

const Toaster = ({ ...props }) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme}
      position="top-center"
      richColors
      closeButton
      duration={4000}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-slate-950 group-[.toaster]:text-white group-[.toaster]:border-purple-500/30 group-[.toaster]:shadow-xl group-[.toaster]:shadow-purple-950/30',
          description: 'group-[.toast]:text-purple-300',
          title: 'group-[.toast]:text-white group-[.toast]:font-semibold',
          actionButton:
            'group-[.toast]:bg-purple-600 group-[.toast]:text-white',
          cancelButton:
            'group-[.toast]:bg-white/10 group-[.toast]:text-purple-200',
          success:
            'group-[.toast]:border-emerald-500/40 group-[.toast]:bg-slate-950',
          error:
            'group-[.toast]:border-red-500/40 group-[.toast]:bg-slate-950',
          warning:
            'group-[.toast]:border-amber-500/40 group-[.toast]:bg-slate-950',
          info: 'group-[.toast]:border-purple-500/40 group-[.toast]:bg-slate-950',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
