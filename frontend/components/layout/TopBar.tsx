'use client';

import { useAuth } from '@/lib/auth/context';
import { notificationSummary } from '@/lib/mock/notifications';
import { Bell, Search, Zap, Command, X, Menu } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':     'Dashboard',
  '/copilot':       'AI Copilot',
  '/equipment':     'Equipment',
  '/documents':     'Documents',
  '/employees':     'Employees',
  '/analytics':     'Analytics',
  '/reports':       'Reports',
  '/notifications': 'Notifications',
  '/safety':        'Safety',
};

const SEARCH_SHORTCUTS = [
  { label: 'Rajrappa mine production',       icon: '⛏️' },
  { label: 'Dumper 203 health status',        icon: '🔧' },
  { label: 'Safety incidents this month',     icon: '🦺' },
  { label: 'Employees with training overdue', icon: '👥' },
  { label: 'Piparwar mine efficiency',        icon: '📊' },
  { label: 'Equipment breakdown list',        icon: '⚙️' },
];

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const router   = useRouter();
  const [time, setTime] = useState(new Date());
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchRef       = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Cmd+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
        setShowDropdown(true);
      }
      if (e.key === 'Escape') {
        setShowDropdown(false);
        setFocused(false);
        setShowMobileSearch(false);
        searchRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Auto-focus mobile search when opened
  useEffect(() => {
    if (showMobileSearch) setTimeout(() => mobileSearchRef.current?.focus(), 100);
  }, [showMobileSearch]);

  const navigateToQuery = (query: string) => {
    if (!query.trim()) return;
    setShowDropdown(false);
    setShowMobileSearch(false);
    setSearch('');
    router.push(`/copilot?q=${encodeURIComponent(query.trim())}`);
  };

  const title = Object.entries(PAGE_TITLES).find(([k]) => pathname.startsWith(k))?.[1] ?? 'IntelliMine';
  const date  = time.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' });
  const clock = time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  return (
    <>
      <header
        className="frosted flex items-center justify-between px-3 md:px-5 py-2.5 border-b shrink-0 relative"
        style={{ borderColor: 'var(--border)', zIndex: 30 }}
      >
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.4) 40%, rgba(139,92,246,0.3) 60%, transparent 100%)' }} />

        {/* LEFT — hamburger (mobile) + page title */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Hamburger — mobile only */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-xl transition-all hover:bg-white/5 active:scale-95 flex-shrink-0"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>

          <div className="min-w-0">
            <h1 className="text-[14px] md:text-[15px] font-semibold truncate leading-tight" style={{ color: 'var(--text-primary)' }}>
              {title}
            </h1>
            <p className="text-[10px] leading-tight hidden sm:block" style={{ color: 'var(--text-muted)' }}>
              Central Coalfields Limited
            </p>
          </div>
        </div>

        {/* CENTER — search (hidden on small mobile, shown on md+) */}
        <div className="flex-1 max-w-md mx-4 relative hidden sm:block">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${focused ? 'ring-1 ring-blue-500/40' : ''}`}
            style={{
              background:  focused ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.03)',
              border:      `1px solid ${focused ? 'rgba(59,130,246,0.4)' : 'var(--border)'}`,
              boxShadow:   focused ? '0 0 0 3px rgba(59,130,246,0.08)' : 'none',
            }}>
            <Search size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input
              ref={searchRef}
              value={search}
              onChange={e => { setSearch(e.target.value); setShowDropdown(true); }}
              onFocus={() => { setFocused(true); setShowDropdown(true); }}
              onBlur={() => { setTimeout(() => { setFocused(false); setShowDropdown(false); }, 150); }}
              onKeyDown={e => { if (e.key === 'Enter' && search.trim()) navigateToQuery(search); }}
              placeholder="Search or ask AI… (Enter)"
              className="flex-1 bg-transparent text-[13px] outline-none"
              style={{ color: 'var(--text-primary)' }}
            />
            {search ? (
              <button onClick={() => setSearch('')}>
                <X size={12} style={{ color: 'var(--text-muted)' }} />
              </button>
            ) : (
              <div className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                <Command size={9} /> K
              </div>
            )}
          </div>

          {/* Search dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden z-50 scale-in"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', boxShadow: '0 16px 48px rgba(0,0,0,0.5)' }}>
              <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  {search ? 'Results' : 'Suggested'}
                </p>
              </div>
              {SEARCH_SHORTCUTS
                .filter(s => !search || s.label.toLowerCase().includes(search.toLowerCase()))
                .map(s => (
                  <button key={s.label}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-[13px] transition-colors hover:bg-white/5"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseDown={() => navigateToQuery(s.label)}>
                    <span className="text-sm flex-shrink-0">{s.icon}</span>
                    <span className="flex-1">{s.label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8' }}>Ask AI →</span>
                  </button>
                ))}
              <div className="px-3 py-2 border-t" style={{ borderColor: 'var(--border)' }}>
                <Link href="/copilot"
                  className="flex items-center gap-2 text-[11px] font-semibold"
                  style={{ color: 'var(--blue-light)' }}>
                  <Zap size={11} /> Ask AI Copilot instead →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — actions */}
        <div className="flex items-center gap-1.5 shrink-0">

          {/* Mobile search icon */}
          <button
            onClick={() => setShowMobileSearch(true)}
            className="sm:hidden p-2 rounded-xl transition-all hover:bg-white/5 active:scale-95"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Search"
          >
            <Search size={17} />
          </button>

          {/* Live clock — desktop only */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-[11.5px]"
            style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.14)', color: 'var(--blue-light)' }}>
            <div className="w-1.5 h-1.5 rounded-full pulse-green" style={{ background: 'var(--green)', flexShrink: 0 }} />
            <span style={{ color: 'var(--text-muted)' }}>{date}</span>
            <span className="font-semibold" style={{ color: 'var(--blue-light)', minWidth: 56, display: 'inline-block', textAlign: 'right' }}>{clock}</span>
          </div>

          {/* AI Copilot button — hidden on mobile */}
          <Link href="/copilot"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #1e40af 0%, #6366f1 60%, #7c3aed 100%)', color: '#fff', boxShadow: '0 3px 14px rgba(99,102,241,0.35)' }}>
            <Zap size={12} />
            <span className="hidden lg:inline">AI Copilot</span>
          </Link>

          {/* Notifications */}
          <Link href="/notifications"
            className="relative p-2 rounded-xl transition-all duration-200 hover:bg-white/5 hover:scale-105 active:scale-95"
            style={{ color: 'var(--text-secondary)' }}>
            <Bell size={17} />
            {notificationSummary.unread > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-0.5 flex items-center justify-center rounded-full text-[9px] font-bold pop-in"
                style={{ background: 'var(--red)', color: '#fff', boxShadow: '0 0 8px rgba(239,68,68,0.6)' }}>
                {notificationSummary.unread}
              </span>
            )}
          </Link>

          {/* User avatar */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l" style={{ borderColor: 'var(--border)' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer transition-all hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #1e40af, #7c3aed)', color: '#fff', boxShadow: '0 2px 10px rgba(124,58,237,0.3)' }}>
                {user.avatar}
              </div>
              <div className="hidden lg:block">
                <p className="text-[12px] font-semibold leading-tight truncate max-w-[100px]" style={{ color: 'var(--text-primary)' }}>
                  {user.name}
                </p>
                <p className="text-[10px] leading-tight" style={{ color: 'var(--blue-light)' }}>
                  {user.roleLabel}
                </p>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile full-screen search overlay */}
      {showMobileSearch && (
        <div className="fixed inset-0 z-50 sm:hidden flex flex-col"
          style={{ background: 'var(--bg-elevated)' }}>
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input
              ref={mobileSearchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && search.trim()) navigateToQuery(search); }}
              placeholder="Search or ask AI… press Enter"
              className="flex-1 bg-transparent text-[15px] outline-none"
              style={{ color: 'var(--text-primary)' }}
            />
            <button onClick={() => { setShowMobileSearch(false); setSearch(''); }}
              className="p-2 rounded-xl hover:bg-white/5 active:scale-95"
              style={{ color: 'var(--text-muted)' }}>
              <X size={18} />
            </button>
          </div>

          {/* Shortcuts list */}
          <div className="flex-1 overflow-y-auto p-2">
            <p className="px-2 py-2 text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>
              {search ? 'Results' : 'Quick suggestions'}
            </p>
            {SEARCH_SHORTCUTS
              .filter(s => !search || s.label.toLowerCase().includes(search.toLowerCase()))
              .map(s => (
                <button key={s.label}
                  className="w-full flex items-center gap-3 px-3 py-4 rounded-xl text-left transition-colors hover:bg-white/5 active:scale-[0.98]"
                  style={{ color: 'var(--text-secondary)' }}
                  onClick={() => navigateToQuery(s.label)}>
                  <span className="text-xl flex-shrink-0">{s.icon}</span>
                  <span className="flex-1 text-[14px]">{s.label}</span>
                  <span className="text-[11px] px-2 py-1 rounded-lg"
                    style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8' }}>Ask AI</span>
                </button>
              ))}

            <div className="mt-4 mx-2">
              <Link href="/copilot"
                onClick={() => setShowMobileSearch(false)}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-[14px] font-semibold"
                style={{ background: 'linear-gradient(135deg,#1e40af,#6366f1)', color: '#fff', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>
                <Zap size={15} /> Open AI Copilot
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
