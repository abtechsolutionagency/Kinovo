'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, MapPin, LogOut, Plus } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

const navItems = [
  { id: 'travels', icon: MapPin, label: 'Travels', href: '/admin/travels' },
  { id: 'create', icon: Plus, label: 'Create Travel', href: '/admin/travels/create' },
];

function isNavActive(pathname, item) {
  if (item.id === 'create') {
    return pathname === '/admin/travels/create';
  }
  if (item.id === 'travels') {
    if (pathname === '/admin/travels') return true;
    if (pathname === '/admin/travels/create') return false;
    return /^\/admin\/travels\/[^/]+$/.test(pathname);
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function AdminShell({ children, title, subtitle, action }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logoutAsync } = useAuthStore();

  const handleLogout = async () => {
    await logoutAsync();
    toast.success('Logged out');
    router.replace('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/80 to-slate-950">
      <div className="lg:flex min-h-screen">
        <aside className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-64 flex-col bg-slate-950/95 backdrop-blur-xl border-r border-purple-500/20">
          <div className="p-6 border-b border-purple-500/20">
            <Link href="/admin/travels" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white block leading-tight">Kinovo</span>
                <span className="text-purple-400 text-xs">Admin · Travel management</span>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const active = isNavActive(pathname, item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active
                      ? 'bg-gradient-to-r from-purple-600/90 to-pink-600/90 text-white shadow-lg shadow-purple-600/20'
                      : 'text-purple-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-purple-400'}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-purple-500/20 space-y-3">
            <div className="px-3 py-2 rounded-lg bg-white/5 border border-purple-500/20">
              <p className="text-white text-sm font-medium truncate">{user?.name || 'Admin'}</p>
              <p className="text-purple-400 text-xs truncate">{user?.email}</p>
            </div>
            <Link
              href="/travels"
              className="flex items-center gap-2 px-3 py-2 text-sm text-purple-300 hover:text-white transition-colors"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              Back to app
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-300 hover:text-red-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </aside>

        <main className="flex-1 lg:pl-64 min-h-screen">
          <div className="mx-auto w-full max-w-7xl px-4 lg:px-8 py-4 lg:py-8">
            <div className="lg:hidden flex items-center justify-between mb-4 pb-4 border-b border-purple-500/20">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white">Kinovo Admin</span>
              </div>
              <button type="button" onClick={handleLogout} className="text-purple-400 text-sm">
                Logout
              </button>
            </div>

            {(title || action) && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
                <div>
                  {title && <h1 className="text-2xl lg:text-3xl font-bold text-white">{title}</h1>}
                  {subtitle && <p className="text-purple-300 text-sm lg:text-base mt-1">{subtitle}</p>}
                </div>
                {action}
              </div>
            )}

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
