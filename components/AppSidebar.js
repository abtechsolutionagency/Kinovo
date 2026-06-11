'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, MessageCircle, Sparkles, User, Users } from 'lucide-react';

const navItems = [
  { icon: Compass, label: 'Discover', href: '/discover' },
  { icon: Users, label: 'Community', href: '/community' },
  { icon: Sparkles, label: 'Concierge', href: '/concierge' },
  { icon: MessageCircle, label: 'Messages', href: '/messages' },
  { icon: User, label: 'Profile', href: '/profile' },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-64 flex-col bg-slate-950/95 backdrop-blur-xl border-r border-purple-500/20">
      <div className="p-6 border-b border-purple-500/20">
        <Link href="/discover" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-white block leading-tight">Kinovo</span>
            <span className="text-purple-400 text-xs">Travel Together</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600/90 to-pink-600/90 text-white shadow-lg shadow-purple-600/20'
                  : 'text-purple-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-purple-400'}`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-purple-500/20">
        <div className="rounded-xl bg-gradient-to-br from-purple-900/50 to-pink-900/30 border border-purple-500/30 p-4">
          <p className="text-white text-sm font-semibold mb-1">Go Premium</p>
          <p className="text-purple-300 text-xs mb-3">Unlimited AI concierge & more</p>
          <Link
            href="/profile"
            className="block text-center text-xs font-semibold py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 transition-opacity"
          >
            Upgrade · £4.99/mo
          </Link>
        </div>
      </div>
    </aside>
  );
}
