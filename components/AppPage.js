'use client';

import Link from 'next/link';
import { AppSidebar } from '@/components/AppSidebar';

/** Responsive app shell — sidebar on desktop, full-width content area. */
export function AppPage({ children, className = '' }) {
  return (
    <div className={`min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/80 to-slate-950 ${className}`}>
      <AppSidebar />
      <main className="lg:pl-64 min-h-screen">
        <div className="mx-auto w-full max-w-lg lg:max-w-6xl xl:max-w-7xl lg:px-8 xl:px-10 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}

export function PageContent({ children, className = '' }) {
  return (
    <div className={`px-4 py-4 pb-24 lg:px-0 lg:py-6 lg:pb-8 ${className}`}>{children}</div>
  );
}

export function GlassCard({ children, className = '', onClick }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      className={`w-full text-left bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-4 shadow-lg shadow-purple-950/20 transition-all hover:border-purple-500/40 ${className}`}
    >
      {children}
    </Tag>
  );
}

export function PageHeader({ title, subtitle, backHref, action }) {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-purple-500/20 px-4 lg:px-0 py-3 lg:py-5">
      <div className="flex items-center gap-3 min-h-[44px]">
        {backHref && (
          <Link
            href={backHref}
            className="shrink-0 w-10 h-10 rounded-xl bg-white/5 border border-purple-500/20 flex items-center justify-center text-purple-200 hover:bg-white/10 lg:w-11 lg:h-11"
          >
            ←
          </Link>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg lg:text-2xl font-bold text-white truncate">{title}</h1>
          {subtitle && (
            <p className="text-purple-400 text-xs lg:text-sm truncate mt-0.5">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
    </header>
  );
}

export function HeroBanner({
  src,
  alt,
  fallbackGradient = 'from-purple-900 via-pink-900/80 to-slate-950',
  children,
  compact = false,
}) {
  const height = compact ? 'h-40 lg:h-52' : 'h-52 sm:h-56 lg:h-64 xl:h-72';
  return (
    <div className={`relative ${height} w-full overflow-hidden lg:rounded-2xl lg:mt-6`}>
      {src ? (
        <img
          src={src}
          alt={alt || ''}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : null}
      <div className={`absolute inset-0 bg-gradient-to-br ${fallbackGradient}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}

export function StatPill({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-white/5 border border-purple-500/20 px-3 py-2 min-w-[72px] lg:min-w-0 lg:flex-1 lg:py-3">
      {Icon && <Icon className="w-4 h-4 lg:w-5 lg:h-5 text-purple-400" />}
      <span className="text-white font-bold text-sm lg:text-base">{value}</span>
      <span className="text-purple-400 text-[10px] lg:text-xs uppercase tracking-wide">{label}</span>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6 rounded-2xl bg-white/5 border border-dashed border-purple-500/30 lg:col-span-full">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-purple-400" />
        </div>
      )}
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <p className="text-purple-300 text-sm mb-4 max-w-xs">{description}</p>
      {action}
    </div>
  );
}

/** Responsive grid for cards — 1 col mobile, 2 on md, 3 on xl */
export function CardGrid({ children, className = '' }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5 ${className}`}>
      {children}
    </div>
  );
}
