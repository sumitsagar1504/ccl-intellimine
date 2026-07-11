'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Bot, Cpu, FileText, Users, BarChart3,
  FileBarChart2, Bell, ShieldCheck, ChevronLeft, ChevronRight,
  Settings, LogOut, LucideIcon, Activity
} from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { notificationSummary } from '@/lib/mock/notifications';
import { useState, useEffect } from 'react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  count?: number;
  color?: string;
}
interface NavGroup {
  group: string;
  items: NavItem[];
}

const navItems: NavGroup[] = [
  { group: 'OVERVIEW', items: [
    { href: '/dashboard', label: 'Dashboard',      icon: LayoutDashboard, color: '#3b82f6' },
    { href: '/copilot',   label: 'AI Copilot',     icon: Bot,             color: '#8b5cf6', badge: 'AI' },
    { href: '/analytics', label: 'Analytics',      icon: BarChart3,       color: '#06b6d4' },
  ]},
  { group: 'OPERATIONS', items: [
    { href: '/equipment', label: 'Equipment',      icon: Cpu,             color: '#f59e0b' },
    { href: '/safety',    label: 'Safety',         icon: ShieldCheck,     color: '#10b981' },
    { href: '/employees', label: 'Employees',      icon: Users,           color: '#60a5fa' },
  ]},
  { group: 'INTELLIGENCE', items: [
    { href: '/documents', label: 'Documents',      icon: FileText,        color: '#a78bfa' },
    { href: '/reports',   label: 'Reports',        icon: FileBarChart2,   color: '#f97316' },
  ]},
  { group: 'ALERTS', items: [
    { href: '/notifications', label: 'Notifications', icon: Bell, color: '#ef4444', count: notificationSummary.unread },
  ]},
];

const COLLAPSED_KEY = 'sidebar_collapsed';

export default function Sidebar() {
  const pathname  = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem(COLLAPSED_KEY) === 'true';
    return false;
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(COLLAPSED_KEY, String(next));
  };

  const roleColors: Record<string, string> = {
    admin:                 'linear-gradient(135deg,#1e40af,#7c3aed)',
    mine_manager:          'linear-gradient(135deg,#065f46,#0891b2)',
    safety_officer:        'linear-gradient(135deg,#7c2d12,#b45309)',
    maintenance_engineer:  'linear-gradient(135deg,#1e3a8a,#1e40af)',
    hr:                    'linear-gradient(135deg,#581c87,#7c3aed)',
  };

  return (
    <aside
      className="frosted flex flex-col h-screen border-r shrink-0 relative"
      style={{
        width:       collapsed ? '68px' : '232px',
        borderColor: 'var(--border)',
        transition:  'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        zIndex:      40,
      }}
    >
      {/* Decorative top glow */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.6), transparent)' }} />

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b shrink-0"
        style={{ borderColor: 'var(--border)' }}>
        <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center glow-blue"
          style={{ background: 'linear-gradient(135deg, #1e40af, #6366f1)', boxShadow: '0 0 16px rgba(99,102,241,0.4)' }}>
          <span className="text-base select-none">⛏</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden whitespace-nowrap slide-in-right">
            <p className="font-bold text-[13px] leading-tight tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Intelli<span className="gradient-text">Mine</span>
            </p>
            <p className="text-[10px] font-medium tracking-widest uppercase"
              style={{ color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
              CCL · AI OS v2.4
            </p>
          </div>
        )}
      </div>

      {/* User card */}
      {user && (
        <div className="mx-3 mt-3 mb-1 shrink-0">
          {!collapsed ? (
            <div className="p-3 rounded-xl slide-in-up"
              style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.14)' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 font-semibold"
                  style={{ background: roleColors[user.role] || roleColors.admin, color: '#fff' }}>
                  {user.avatar}
                </div>
                <div className="overflow-hidden flex-1">
                  <p className="text-xs font-semibold truncate leading-tight" style={{ color: 'var(--text-primary)' }}>
                    {user.name}
                  </p>
                  <p className="text-[10px] truncate mt-0.5" style={{ color: 'var(--blue-light)' }}>
                    {user.roleLabel}
                  </p>
                </div>
                {/* Online dot */}
                <div className="w-2 h-2 rounded-full flex-shrink-0 pulse-green"
                  style={{ background: 'var(--green)' }} />
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold"
                style={{ background: roleColors[user.role] || roleColors.admin, color: '#fff' }}>
                {user.avatar}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-4" style={{ scrollbarWidth: 'none' }}>
        {navItems.map((group, gi) => (
          <div key={group.group} className="slide-in-up" style={{ animationDelay: `${gi * 0.06}s` }}>
            {!collapsed && (
              <p className="px-3 mb-1.5 text-[9.5px] font-bold tracking-[0.18em] uppercase"
                style={{ color: 'var(--text-dim)' }}>
                {group.group}
              </p>
            )}
            {collapsed && gi > 0 && (
              <div className="mx-2 mb-2" style={{ height: '1px', background: 'var(--border-subtle)' }} />
            )}
            <div className="space-y-0.5">
              {group.items.map((item, ii) => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/');
                const Icon   = item.icon;
                return (
                  <div key={item.href} className="tooltip">
                    <Link
                      href={item.href}
                      className={`nav-item ${active ? 'nav-item-active' : ''}`}
                      style={{
                        animationDelay: `${(gi * 3 + ii) * 0.04}s`,
                        justifyContent: collapsed ? 'center' : undefined,
                        padding: collapsed ? '10px' : undefined,
                      }}
                    >
                      <div className="flex-shrink-0 relative">
                        <Icon
                          size={17}
                          style={{
                            color: active ? item.color || 'var(--blue-light)' : undefined,
                            filter: active ? `drop-shadow(0 0 6px ${item.color || 'var(--blue)'})` : undefined,
                            transition: 'all 0.2s',
                          }}
                        />
                      </div>

                      {!collapsed && (
                        <>
                          <span className="flex-1 text-[13.5px]">{item.label}</span>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest"
                              style={{
                                background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(99,102,241,0.2))',
                                color: '#a78bfa',
                                border: '1px solid rgba(139,92,246,0.2)',
                              }}>
                              {item.badge}
                            </span>
                          )}
                          {item.count != null && item.count > 0 && (
                            <span className="min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full text-[10px] font-bold pop-in"
                              style={{ background: 'var(--red)', color: '#fff', boxShadow: '0 0 8px rgba(239,68,68,0.5)' }}>
                              {item.count}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                    {/* Tooltip on collapsed */}
                    {collapsed && (
                      <div className="tooltip-content">
                        {item.label}
                        {item.count != null && item.count > 0 && (
                          <span className="ml-1.5 px-1 py-0.5 rounded-full text-[9px] font-bold"
                            style={{ background: 'var(--red)', color: '#fff' }}>
                            {item.count}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* System status */}
      {!collapsed && (
        <div className="mx-3 mb-2 p-2.5 rounded-xl slide-in-up"
          style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)' }}>
          <div className="flex items-center gap-2">
            <Activity size={11} style={{ color: 'var(--green)' }} />
            <p className="text-[10px] font-semibold" style={{ color: 'var(--green)' }}>All Systems Operational</p>
          </div>
          <div className="flex gap-1 mt-1.5">
            {['API', 'DB', 'AI', 'IoT'].map(s => (
              <div key={s} className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--green-light)' }}>
                <div className="w-1 h-1 rounded-full blink" style={{ background: 'var(--green)' }} />
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom actions */}
      <div className="p-2 border-t shrink-0" style={{ borderColor: 'var(--border)' }}>
        <div className="tooltip">
          <Link href="/settings"
            className="nav-item"
            style={{ justifyContent: collapsed ? 'center' : undefined }}>
            <Settings size={16} />
            {!collapsed && <span className="text-[13px]">Settings</span>}
          </Link>
          {collapsed && <div className="tooltip-content">Settings</div>}
        </div>
        <div className="tooltip">
          <button onClick={logout}
            className="nav-item w-full"
            style={{
              justifyContent: collapsed ? 'center' : undefined,
              color: 'var(--text-muted)',
            }}>
            <LogOut size={16} />
            {!collapsed && <span className="text-[13px]">Sign Out</span>}
          </button>
          {collapsed && <div className="tooltip-content">Sign Out</div>}
        </div>
      </div>

      {/* Collapse toggle button */}
      <button
        onClick={toggle}
        className="absolute -right-3 top-[88px] w-6 h-6 rounded-full flex items-center justify-center border z-50 transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          background:   'var(--bg-elevated)',
          borderColor:  'var(--border-bright)',
          color:        'var(--text-secondary)',
          boxShadow:    '0 2px 12px rgba(0,0,0,0.4)',
        }}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
      </button>

      {/* Bottom gradient edge */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent)' }} />
    </aside>
  );
}
