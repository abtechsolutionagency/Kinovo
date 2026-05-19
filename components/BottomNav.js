'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Compass, MessageCircle, Sparkles, User } from 'lucide-react';
import { motion } from 'framer-motion';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Compass, label: 'Discover', href: '/discover' },
    { icon: Sparkles, label: 'Concierge', href: '/concierge' },
    { icon: MessageCircle, label: 'Messages', href: '/messages' },
    { icon: User, label: 'Profile', href: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-lg border-t border-purple-500/20">
      <div className="flex items-center justify-around px-4 py-3 max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center gap-1 relative"
              >
                <div
                  className={`p-2 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isActive ? 'text-white' : 'text-purple-300'
                    }`}
                  />
                </div>
                <span
                  className={`text-xs ${
                    isActive ? 'text-purple-300 font-semibold' : 'text-purple-400'
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
