'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const ConfirmContext = createContext(null);

const defaultOptions = {
  title: 'Are you sure?',
  description: 'This action cannot be undone.',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  variant: 'default',
};

export function ConfirmDialogProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState(defaultOptions);
  const resolveRef = useRef(null);

  const confirm = useCallback((opts = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setOptions({ ...defaultOptions, ...opts });
      setOpen(true);
    });
  }, []);

  const finish = (result) => {
    setOpen(false);
    resolveRef.current?.(result);
    resolveRef.current = null;
  };

  const isDestructive = options.variant === 'destructive';

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <AlertDialog open={open} onOpenChange={(next) => !next && finish(false)}>
        <AlertDialogContent className="bg-slate-950 border border-purple-500/30 text-white max-w-md shadow-2xl shadow-purple-950/50">
          <AlertDialogHeader>
            <div className="flex items-start gap-3">
              {isDestructive && (
                <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
              )}
              <div className="text-left">
                <AlertDialogTitle className="text-white text-lg">{options.title}</AlertDialogTitle>
                <AlertDialogDescription className="text-purple-300 mt-2">
                  {options.description}
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2 mt-2">
            <AlertDialogCancel
              onClick={() => finish(false)}
              className="border-purple-500/30 bg-white/5 text-purple-200 hover:bg-white/10 hover:text-white"
            >
              {options.cancelLabel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => finish(true)}
              className={
                isDestructive
                  ? 'bg-red-600 hover:bg-red-500 text-white border-0'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0'
              }
            >
              {options.confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error('useConfirm must be used within ConfirmDialogProvider');
  }
  return ctx.confirm;
}
