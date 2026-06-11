'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, MessageCircle, Sparkles, User, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { icon: Compass, label: 'Discover', href: '/discover' },
  { icon: Users, label: 'Community', href: '/community' },
  { icon: Sparkles, label: 'Concierge', href: '/concierge' },
  { icon: MessageCircle, label: 'Messages', href: '/messages' },
  { icon: User, label: 'Profile', href: '/profile' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none lg:hidden">
      <div className="mx-auto w-full max-w-lg lg:max-w-none pointer-events-auto">
        <div className="bg-slate-950/95 backdrop-blur-xl border-t border-purple-500/25 px-2 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href} className="flex-1 max-w-[72px]">
                  <motion.div whileTap={{ scale: 0.92 }} className="flex flex-col items-center gap-0.5 py-1">
                    <div
                      className={`p-2 rounded-xl transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-600/30'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-purple-400'}`} />
                    </div>
                    <span
                      className={`text-[10px] font-medium truncate ${
                        isActive ? 'text-purple-200' : 'text-purple-500'
                      }`}
                    >
                      {item.label}
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
