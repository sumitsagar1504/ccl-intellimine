'use client';

import { useAuth } from '@/lib/auth/context';
import { notificationSummary } from '@/lib/mock/notifications';
import { Bell, Search, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function TopBar({ title }: { title?: string }) {
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());
  const [search, setSearch] = useState('');

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (d: Date) =>
    d.toLocaleString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b shrink-0"
      style={{ background: 'rgba(6,13,31,0.95)', borderColor: 'var(--color-border)', backdropFilter: 'blur(12px)' }}>
      
      {/* Left */}
      <div className="flex items-center gap-4">
        {title && (
          <h1 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>{title}</h1>
        )}
        {/* Search */}
        <div className="relative hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search mines, equipment, employees..."
            className="pl-8 pr-4 py-2 text-sm rounded-xl outline-none w-72 transition-all"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--color-blue)'; e.target.style.width = '340px'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.width = '288px'; }}
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Live clock */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs"
          style={{ background: 'rgba(59,130,246,0.08)', color: 'var(--color-blue-bright)', border: '1px solid rgba(59,130,246,0.15)' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-green" />
          {fmt(time)}
        </div>

        {/* AI Copilot quick btn */}
        <Link href="/copilot"
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #1e40af, #7c3aed)', color: '#fff', boxShadow: '0 2px 12px rgba(124,58,237,0.3)' }}>
          <Zap size={13} />
          AI Copilot
        </Link>

        {/* Notifications */}
        <Link href="/notifications" className="relative p-2 rounded-xl transition-colors hover:bg-white/5">
          <Bell size={18} style={{ color: 'var(--color-text-secondary)' }} />
          {notificationSummary.unread > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center text-xs font-bold rounded-full"
              style={{ background: 'var(--color-red)', color: '#fff', fontSize: '9px' }}>
              {notificationSummary.unread}
            </span>
          )}
        </Link>

        {/* User avatar */}
        {user && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #1e40af, #7c3aed)', color: '#fff' }}>
              {user.avatar}
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-semibold leading-tight" style={{ color: 'var(--color-text-primary)' }}>{user.name}</p>
              <p className="text-xs leading-tight" style={{ color: 'var(--color-blue-bright)' }}>{user.roleLabel}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
