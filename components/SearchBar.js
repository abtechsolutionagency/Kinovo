'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function SearchBar({ value, onChange, placeholder, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10 h-11 bg-white/10 border-purple-500/30 text-white placeholder:text-purple-400/60 focus:border-purple-400 rounded-xl"
      />
    </div>
  );
}
