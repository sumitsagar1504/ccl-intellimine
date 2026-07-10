'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Bot, Cpu, FileText, Users, BarChart3,
  FileBarChart2, Bell, ShieldCheck, ChevronLeft, ChevronRight,
  Zap, Settings, LogOut, LucideIcon
} from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { notificationSummary } from '@/lib/mock/notifications';
import { useState } from 'react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  count?: number;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const navItems: NavGroup[] = [
  { group: 'CORE', items: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/copilot', label: 'AI Copilot', icon: Bot, badge: 'AI' },
  ]},
  { group: 'OPERATIONS', items: [
    { href: '/equipment', label: 'Equipment', icon: Cpu },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/safety', label: 'Safety', icon: ShieldCheck },
  ]},
  { group: 'INTELLIGENCE', items: [
    { href: '/documents', label: 'Documents', icon: FileText },
    { href: '/employees', label: 'Employees', icon: Users },
    { href: '/reports', label: 'Reports', icon: FileBarChart2 },
  ]},
  { group: 'ALERTS', items: [
    { href: '/notifications', label: 'Notifications', icon: Bell, count: notificationSummary.unread },
  ]},
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="flex flex-col h-screen border-r transition-all duration-300 relative"
      style={{
        width: collapsed ? '72px' : '240px',
        background: 'rgba(6, 13, 31, 0.98)',
        borderColor: 'var(--color-border)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center glow-blue"
          style={{ background: 'linear-gradient(135deg, #1e40af, #3b82f6)' }}>
          <span className="text-lg">⛏️</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-bold text-sm leading-tight" style={{ color: 'var(--color-text-primary)' }}>
              Intelli<span className="gradient-text-blue">Mine</span>
            </p>
            <p className="text-xs leading-tight" style={{ color: 'var(--color-text-muted)' }}>CCL · AI OS</p>
          </div>
        )}
      </div>

      {/* User card */}
      {!collapsed && user && (
        <div className="mx-3 mt-4 p-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #1e40af, #7c3aed)', color: '#fff' }}>
              {user.avatar}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>{user.name}</p>
              <p className="text-xs truncate" style={{ color: 'var(--color-blue-bright)' }}>{user.roleLabel}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navItems.map(group => (
          <div key={group.group} className="mb-4">
            {!collapsed && (
              <p className="px-3 mb-2 text-xs font-semibold tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
                {group.group}
              </p>
            )}
            {group.items.map(item => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-200 group relative ${active ? 'sidebar-active' : ''}`}
                  style={!active ? { color: 'var(--color-text-secondary)' } : {}}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={18} className={`flex-shrink-0 transition-colors ${active ? '' : 'group-hover:text-blue-400'}`} />
                  {!collapsed && (
                    <>
                      <span className="text-sm font-medium flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="text-xs px-1.5 py-0.5 rounded font-semibold"
                          style={{ background: 'rgba(59,130,246,0.2)', color: 'var(--color-blue-bright)' }}>
                          {item.badge}
                        </span>
                      )}
                      {item.count && item.count > 0 && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                          style={{ background: 'var(--color-red)', color: '#fff' }}>
                          {item.count}
                        </span>
                      )}
                    </>
                  )}
                  {/* Tooltip for collapsed */}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 rounded text-xs whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="p-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <Link href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-colors group"
          style={{ color: 'var(--color-text-muted)' }}>
          <Settings size={18} className="flex-shrink-0 group-hover:text-blue-400 transition-colors" />
          {!collapsed && <span className="text-sm">Settings</span>}
        </Link>
        <button onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-colors group"
          style={{ color: 'var(--color-text-muted)' }}>
          <LogOut size={18} className="flex-shrink-0 group-hover:text-red-400 transition-colors" />
          {!collapsed && <span className="text-sm">Sign Out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center border z-10 transition-all hover:scale-110"
        style={{ background: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
