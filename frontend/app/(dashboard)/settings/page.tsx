'use client';

import { useState } from 'react';
import {
  User, Bell, Shield, Palette, Database, Globe, Key,
  Monitor, Moon, Sun, Smartphone, Save, RefreshCcw,
  ChevronRight, CheckCircle2, Eye, EyeOff, Lock, Zap,
  ToggleLeft, ToggleRight, Building2, AlertTriangle,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/context';

// ── Types ─────────────────────────────────────────────────────────────────────
type Tab = 'profile' | 'notifications' | 'security' | 'appearance' | 'system' | 'api';

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, subtitle, color = '#3b82f6' }: {
  icon: any; title: string; subtitle?: string; color?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
        <Icon size={17} style={{ color }} />
      </div>
      <div>
        <h2 className="font-bold text-[15px]" style={{ color: 'var(--text-primary)' }}>{title}</h2>
        {subtitle && <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
      </div>
    </div>
  );
}

// ── Toggle switch ─────────────────────────────────────────────────────────────
function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="flex-shrink-0 transition-all duration-200 hover:scale-105 active:scale-95"
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: enabled ? '#3b82f6' : 'rgba(255,255,255,0.1)',
        border: `1px solid ${enabled ? '#3b82f6' : 'var(--border)'}`,
        position: 'relative', cursor: 'pointer',
        boxShadow: enabled ? '0 0 10px rgba(59,130,246,0.4)' : 'none',
        transition: 'all 0.25s',
      }}
    >
      <div style={{
        position: 'absolute', top: 2, left: enabled ? 22 : 2, width: 18, height: 18,
        borderRadius: '50%', background: '#fff',
        transition: 'left 0.25s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }} />
    </button>
  );
}

// ── Setting row ───────────────────────────────────────────────────────────────
function SettingRow({ title, description, children }: {
  title: string; description?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b"
      style={{ borderColor: 'var(--border)' }}>
      <div className="flex-1 pr-4">
        <p className="text-[13.5px] font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</p>
        {description && (
          <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl slide-in-up"
      style={{
        background: 'rgba(16,185,129,0.15)',
        border: '1px solid rgba(16,185,129,0.35)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
      <CheckCircle2 size={16} style={{ color: 'var(--green)' }} />
      <span className="text-[13px] font-semibold" style={{ color: 'var(--green-light)' }}>{message}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [saved, setSaved] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Notification prefs
  const [notifs, setNotifs] = useState({
    equipmentAlerts: true, safetyIncidents: true, productionUpdates: false,
    aiRecommendations: true, emailDigest: true, smsAlerts: false,
    browserPush: true, criticalOnly: false,
  });

  // Appearance prefs
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [density, setDensity] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable');
  const [animations, setAnimations] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  // System prefs
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [dataRetention, setDataRetention] = useState(90);

  const saveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs: { id: Tab; label: string; icon: any; color: string }[] = [
    { id: 'profile',       label: 'Profile',       icon: User,     color: '#3b82f6' },
    { id: 'notifications', label: 'Notifications', icon: Bell,     color: '#f59e0b' },
    { id: 'security',      label: 'Security',      icon: Shield,   color: '#10b981' },
    { id: 'appearance',    label: 'Appearance',    icon: Palette,  color: '#8b5cf6' },
    { id: 'system',        label: 'System',        icon: Database, color: '#06b6d4' },
    { id: 'api',           label: 'API & Keys',    icon: Key,      color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="slide-in-up">
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Manage your account, preferences, and system configuration
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Sidebar tabs */}
        <div className="lg:w-52 flex-shrink-0">
          <div className="glass-card p-2 space-y-0.5 slide-in-up">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: active ? `${tab.color}18` : 'transparent',
                    border: `1px solid ${active ? `${tab.color}30` : 'transparent'}`,
                    color: active ? tab.color : 'var(--text-secondary)',
                  }}>
                  <Icon size={15} style={{ color: active ? tab.color : 'var(--text-muted)', flexShrink: 0 }} />
                  <span className="text-[13px] font-semibold">{tab.label}</span>
                  {active && <ChevronRight size={12} className="ml-auto" style={{ color: tab.color }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 glass-card p-6 slide-in-up" style={{ animationDelay: '0.05s' }}>

          {/* ── Profile ──────────────────────────────────────────────── */}
          {activeTab === 'profile' && (
            <div>
              <SectionHeader icon={User} title="Profile Information" subtitle="Your account details and role" color="#3b82f6" />

              {/* Avatar + name */}
              <div className="flex items-center gap-5 p-5 rounded-2xl mb-6"
                style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg,#1e40af,#6366f1)',
                    boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
                  }}>
                  {user?.avatar}
                </div>
                <div>
                  <p className="font-bold text-[17px]" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: 'var(--blue-light)' }}>{user?.roleLabel}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-1.5 h-1.5 rounded-full pulse-green" style={{ background: 'var(--green)' }} />
                    <span className="text-[11px]" style={{ color: 'var(--green-light)' }}>Online · IntelliMine v2.4</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Full Name', value: user?.name ?? '', type: 'text' },
                  { label: 'Employee ID', value: 'EMP-001', type: 'text', disabled: true },
                  { label: 'Email Address', value: 'admin@ccl.gov.in', type: 'email' },
                  { label: 'Mine / Department', value: 'All Mines · Executive', type: 'text', disabled: true },
                  { label: 'Contact Number', value: '+91 94310 12345', type: 'tel' },
                ].map(field => (
                  <div key={field.label}>
                    <label className="block text-[11.5px] font-semibold mb-1.5 uppercase tracking-wider"
                      style={{ color: 'var(--text-muted)' }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      defaultValue={field.value}
                      disabled={field.disabled}
                      className="w-full px-4 py-2.5 rounded-xl text-[13.5px] transition-all outline-none"
                      style={{
                        background: field.disabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${field.disabled ? 'var(--border)' : 'rgba(59,130,246,0.2)'}`,
                        color: field.disabled ? 'var(--text-muted)' : 'var(--text-primary)',
                        cursor: field.disabled ? 'not-allowed' : 'text',
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={saveSettings}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:scale-105 active:scale-95"
                  style={{ background: 'linear-gradient(135deg,#1e40af,#6366f1)', color: '#fff', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>
                  <Save size={14} /> Save Changes
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:scale-105"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                  <RefreshCcw size={14} /> Reset
                </button>
              </div>
            </div>
          )}

          {/* ── Notifications ─────────────────────────────────────────── */}
          {activeTab === 'notifications' && (
            <div>
              <SectionHeader icon={Bell} title="Notification Preferences" subtitle="Control what alerts you receive" color="#f59e0b" />

              <div className="space-y-0">
                {([
                  ['Equipment Alerts', 'Critical equipment failures and maintenance reminders', 'equipmentAlerts'],
                  ['Safety Incidents', 'Safety violations, near-misses and emergency alerts', 'safetyIncidents'],
                  ['Production Updates', 'Daily production summaries and target achievements', 'productionUpdates'],
                  ['AI Recommendations', 'Gemini-generated insights and action suggestions', 'aiRecommendations'],
                ] as [string, string, keyof typeof notifs][]).map(([title, desc, key]) => (
                  <SettingRow key={key} title={title} description={desc}>
                    <Toggle enabled={notifs[key]} onChange={v => setNotifs(p => ({ ...p, [key]: v }))} />
                  </SettingRow>
                ))}
              </div>

              <p className="text-[10.5px] uppercase font-bold tracking-widest mt-6 mb-3" style={{ color: 'var(--text-dim)' }}>
                Delivery Channels
              </p>
              <div className="space-y-0">
                {([
                  ['Email Digest', 'Daily summary email at 7:00 AM', 'emailDigest'],
                  ['SMS Alerts', 'Critical alerts via SMS (charges may apply)', 'smsAlerts'],
                  ['Browser Push', 'Real-time browser notifications', 'browserPush'],
                  ['Critical Only', 'Only send for critical priority items', 'criticalOnly'],
                ] as [string, string, keyof typeof notifs][]).map(([title, desc, key]) => (
                  <SettingRow key={key} title={title} description={desc}>
                    <Toggle enabled={notifs[key]} onChange={v => setNotifs(p => ({ ...p, [key]: v }))} />
                  </SettingRow>
                ))}
              </div>

              <button onClick={saveSettings}
                className="flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg,#b45309,#d97706)', color: '#fff', boxShadow: '0 4px 14px rgba(217,119,6,0.3)' }}>
                <Save size={14} /> Save Preferences
              </button>
            </div>
          )}

          {/* ── Security ──────────────────────────────────────────────── */}
          {activeTab === 'security' && (
            <div>
              <SectionHeader icon={Shield} title="Security & Access" subtitle="Manage authentication and sessions" color="#10b981" />

              <div className="p-4 rounded-2xl mb-6 flex items-start gap-3"
                style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--green)', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: 'var(--green-light)' }}>Account Secured</p>
                  <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Last login: Today at 07:24 PM from 103.21.x.x (Jharkhand, IN)
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
                  <div key={label}>
                    <label className="block text-[11.5px] font-semibold mb-1.5 uppercase tracking-wider"
                      style={{ color: 'var(--text-muted)' }}>
                      {label}
                    </label>
                    <div className="relative">
                      <input type={showApiKey ? 'text' : 'password'} placeholder="••••••••••••"
                        className="w-full px-4 py-2.5 rounded-xl text-[13.5px] outline-none pr-12 transition-all"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(16,185,129,0.2)', color: 'var(--text-primary)' }}
                      />
                      {label === 'Current Password' && (
                        <button onClick={() => setShowApiKey(p => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                          style={{ color: 'var(--text-muted)' }}>
                          {showApiKey ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-0 mb-6">
                <SettingRow title="Two-Factor Authentication" description="Extra layer of security via OTP">
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold"
                    style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--amber-light)' }}>
                    Not Enabled
                  </span>
                </SettingRow>
                <SettingRow title="Active Sessions" description="Devices currently logged in">
                  <span className="text-[13px] font-bold" style={{ color: 'var(--blue-light)' }}>2 devices</span>
                </SettingRow>
              </div>

              <div className="flex gap-3">
                <button onClick={saveSettings}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:scale-105 active:scale-95"
                  style={{ background: 'linear-gradient(135deg,#065f46,#10b981)', color: '#fff', boxShadow: '0 4px 14px rgba(16,185,129,0.3)' }}>
                  <Lock size={14} /> Update Password
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:scale-105"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--red-light)' }}>
                  Sign Out All Devices
                </button>
              </div>
            </div>
          )}

          {/* ── Appearance ────────────────────────────────────────────── */}
          {activeTab === 'appearance' && (
            <div>
              <SectionHeader icon={Palette} title="Appearance" subtitle="Customise how IntelliMine looks" color="#8b5cf6" />

              <div className="mb-6">
                <p className="text-[11.5px] font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Theme
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { id: 'dark',   label: 'Dark',   icon: Moon,    desc: 'Easy on the eyes' },
                    { id: 'light',  label: 'Light',  icon: Sun,     desc: 'High visibility' },
                    { id: 'system', label: 'System', icon: Monitor, desc: 'Follow OS setting' },
                  ] as const).map(t => {
                    const Icon = t.icon;
                    const active = theme === t.id;
                    return (
                      <button key={t.id} onClick={() => setTheme(t.id)}
                        className="p-4 rounded-xl text-center transition-all hover:scale-105 active:scale-95"
                        style={{
                          background: active ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)',
                          border: `1.5px solid ${active ? '#8b5cf6' : 'var(--border)'}`,
                          boxShadow: active ? '0 0 16px rgba(139,92,246,0.2)' : 'none',
                        }}>
                        <Icon size={20} style={{ color: active ? '#a78bfa' : 'var(--text-muted)', margin: '0 auto 8px' }} />
                        <p className="text-[13px] font-semibold" style={{ color: active ? '#a78bfa' : 'var(--text-primary)' }}>{t.label}</p>
                        <p className="text-[10.5px] mt-0.5" style={{ color: 'var(--text-dim)' }}>{t.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-[11.5px] font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Density
                </p>
                <div className="flex gap-2">
                  {(['compact', 'comfortable', 'spacious'] as const).map(d => (
                    <button key={d} onClick={() => setDensity(d)}
                      className="flex-1 py-2 rounded-xl text-[12.5px] font-semibold capitalize transition-all hover:scale-105"
                      style={{
                        background: density === d ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${density === d ? '#8b5cf6' : 'var(--border)'}`,
                        color: density === d ? '#a78bfa' : 'var(--text-secondary)',
                      }}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-0">
                <SettingRow title="Animations" description="Slide-in and transition effects">
                  <Toggle enabled={animations} onChange={setAnimations} />
                </SettingRow>
                <SettingRow title="High Contrast" description="Increase text and element contrast">
                  <Toggle enabled={highContrast} onChange={setHighContrast} />
                </SettingRow>
              </div>

              <button onClick={saveSettings}
                className="flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg,#581c87,#8b5cf6)', color: '#fff', boxShadow: '0 4px 14px rgba(139,92,246,0.3)' }}>
                <Save size={14} /> Save Appearance
              </button>
            </div>
          )}

          {/* ── System ────────────────────────────────────────────────── */}
          {activeTab === 'system' && (
            <div>
              <SectionHeader icon={Database} title="System Configuration" subtitle="Data refresh and retention settings" color="#06b6d4" />

              <div className="space-y-0 mb-6">
                <SettingRow title="Auto Refresh" description="Automatically refresh dashboard data from backend">
                  <Toggle enabled={autoRefresh} onChange={setAutoRefresh} />
                </SettingRow>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-[11.5px] font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Refresh Interval (seconds)
                  </label>
                  <select value={refreshInterval} onChange={e => setRefreshInterval(+e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-[13.5px] outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(6,182,212,0.25)', color: 'var(--text-primary)' }}>
                    {[15, 30, 60, 120, 300].map(v => (
                      <option key={v} value={v} style={{ background: '#0f1929' }}>{v}s</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11.5px] font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Data Retention (days)
                  </label>
                  <select value={dataRetention} onChange={e => setDataRetention(+e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-[13.5px] outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(6,182,212,0.25)', color: 'var(--text-primary)' }}>
                    {[30, 60, 90, 180, 365].map(v => (
                      <option key={v} value={v} style={{ background: '#0f1929' }}>{v} days</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Backend status */}
              <div className="p-4 rounded-2xl mb-4"
                style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)' }}>
                <p className="text-[12px] font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--cyan)' }}>
                  <Globe size={13} /> Backend Connection
                </p>
                {[
                  { label: 'API Endpoint', value: 'https://ccl-intellimine.onrender.com', status: 'live' },
                  { label: 'Frontend', value: 'https://ccl-intellimine.vercel.app', status: 'live' },
                  { label: 'AI Service', value: 'Gemini 2.0 Flash · Vercel', status: 'live' },
                  { label: 'Database', value: 'PostgreSQL · Render', status: 'live' },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between py-1.5 border-b last:border-0"
                    style={{ borderColor: 'rgba(6,182,212,0.1)' }}>
                    <span className="text-[11.5px]" style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono truncate max-w-[200px]" style={{ color: 'var(--text-secondary)' }}>
                        {row.value}
                      </span>
                      <div className="w-1.5 h-1.5 rounded-full pulse-green" style={{ background: 'var(--green)' }} />
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={saveSettings}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg,#0e7490,#06b6d4)', color: '#fff', boxShadow: '0 4px 14px rgba(6,182,212,0.3)' }}>
                <Save size={14} /> Save Configuration
              </button>
            </div>
          )}

          {/* ── API & Keys ────────────────────────────────────────────── */}
          {activeTab === 'api' && (
            <div>
              <SectionHeader icon={Key} title="API Keys & Integrations" subtitle="Manage API access credentials" color="#ef4444" />

              <div className="p-4 rounded-2xl mb-5 flex items-start gap-3"
                style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <AlertTriangle size={15} style={{ color: 'var(--amber)', flexShrink: 0, marginTop: 2 }} />
                <p className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                  API keys are stored securely in Vercel and Render environment variables.
                  Never share them publicly. Rotate keys regularly.
                </p>
              </div>

              {[
                { label: 'Gemini API Key (Vercel)', desc: 'Powers the AI Copilot feature on the frontend', value: 'AIza••••••••••••••••••••••••••••••••••••' },
                { label: 'Gemini API Key (Render)', desc: 'Powers the backend AI analysis pipeline', value: 'AIza••••••••••••••••••••••••••••••••••••' },
                { label: 'Backend API URL', desc: 'Render service endpoint for data APIs', value: 'https://ccl-intellimine.onrender.com' },
                { label: 'Frontend URL', desc: 'Vercel deployment URL', value: 'https://ccl-intellimine.vercel.app' },
              ].map(item => (
                <div key={item.label} className="mb-5">
                  <label className="block text-[11.5px] font-semibold mb-0.5 uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>
                    {item.label}
                  </label>
                  <p className="text-[11px] mb-2" style={{ color: 'var(--text-dim)' }}>{item.desc}</p>
                  <div className="relative">
                    <input type="password" readOnly value={item.value}
                      className="w-full px-4 py-2.5 rounded-xl text-[13px] font-mono outline-none cursor-not-allowed"
                      style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--text-primary)' }}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Lock size={13} style={{ color: 'var(--text-dim)' }} />
                    </div>
                  </div>
                </div>
              ))}

              <div className="p-4 rounded-xl mt-4"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                <p className="text-[12px] font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  To update API keys:
                </p>
                <ol className="space-y-1.5 text-[11.5px]" style={{ color: 'var(--text-muted)' }}>
                  <li className="flex items-start gap-2"><span style={{ color: 'var(--blue-light)' }}>1.</span> Go to <strong>Vercel Dashboard → Settings → Environment Variables</strong> for frontend keys</li>
                  <li className="flex items-start gap-2"><span style={{ color: 'var(--blue-light)' }}>2.</span> Go to <strong>Render Dashboard → Service → Environment</strong> for backend keys</li>
                  <li className="flex items-start gap-2"><span style={{ color: 'var(--blue-light)' }}>3.</span> Redeploy the service after updating to apply changes</li>
                </ol>
              </div>
            </div>
          )}

        </div>
      </div>

      {saved && <Toast message="Settings saved successfully!" />}
    </div>
  );
}
