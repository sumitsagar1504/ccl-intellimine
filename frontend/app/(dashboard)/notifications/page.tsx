'use client';

import { useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, AlertCircle, Info, Zap, Clock } from 'lucide-react';
import { notifications, Notification, notificationSummary } from '@/lib/mock/notifications';
import Badge from '@/components/ui/Badge';

const priorityConfig = {
  critical: { label: 'Critical', variant: 'danger' as const, icon: AlertCircle, color: 'var(--color-red)', glow: 'rgba(239,68,68,0.15)' },
  high: { label: 'High', variant: 'warning' as const, icon: AlertTriangle, color: 'var(--color-amber)', glow: 'rgba(245,158,11,0.1)' },
  medium: { label: 'Medium', variant: 'info' as const, icon: Info, color: 'var(--color-cyan)', glow: 'transparent' },
  low: { label: 'Low', variant: 'success' as const, icon: CheckCircle, color: 'var(--color-green)', glow: 'transparent' },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function NotifCard({ n }: { n: Notification }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  const cfg = priorityConfig[n.priority];
  const Icon = cfg.icon;

  return (
    <div className="glass-card p-4 relative slide-in-up"
      style={!n.read ? { borderColor: cfg.color + '40', boxShadow: `0 0 20px ${cfg.glow}` } : {}}>
      {!n.read && <div className="absolute top-3 right-3 w-2 h-2 rounded-full" style={{ background: cfg.color }} />}

      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: cfg.color + '18', color: cfg.color }}>
          <Icon size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1.5">
            <p className="text-sm font-semibold leading-snug flex-1" style={{ color: 'var(--color-text-primary)' }}>{n.title}</p>
            <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>
          </div>

          <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--color-text-secondary)' }}>{n.message}</p>

          {n.recommendation && (
            <div className="flex items-start gap-2 p-3 rounded-lg mb-2 text-xs"
              style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
              <Zap size={12} style={{ color: 'var(--color-blue)', flexShrink: 0, marginTop: 1 }} />
              <div>
                <p className="font-semibold mb-0.5" style={{ color: 'var(--color-blue-bright)' }}>AI Recommendation</p>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{n.recommendation}</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              <span className="flex items-center gap-1"><Clock size={10} />{timeAgo(n.timestamp)}</span>
              {n.mineName && <span>📍 {n.mineName}</span>}
              {n.aiGenerated && <Badge variant="purple" size="sm">AI Generated</Badge>}
            </div>
            <div className="flex gap-2">
              {n.actionRequired && (
                <button className="text-xs px-2.5 py-1 rounded-lg font-semibold transition-all hover:scale-105"
                  style={{ background: cfg.color + '20', color: cfg.color, border: `1px solid ${cfg.color}40` }}>
                  Take Action
                </button>
              )}
              <button onClick={() => setDismissed(true)}
                className="text-xs px-2.5 py-1 rounded-lg transition-all hover:bg-white/5"
                style={{ color: 'var(--color-text-muted)' }}>
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'unread'>('all');

  const filtered = notifications.filter(n => {
    if (filter === 'critical') return n.priority === 'critical';
    if (filter === 'high') return n.priority === 'high' || n.priority === 'critical';
    if (filter === 'unread') return !n.read;
    return true;
  });

  const groups = ['critical', 'high', 'medium', 'low'] as const;

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Notification Center</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
            AI-generated alerts and recommendations
          </p>
        </div>
        <div className="flex items-center gap-2">
          {notificationSummary.critical > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--color-red)' }}>
              <div className="w-2 h-2 rounded-full bg-red-400 pulse-red" />
              {notificationSummary.critical} critical
            </div>
          )}
        </div>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        {[
          { key: 'all', label: `All (${notificationSummary.total})` },
          { key: 'critical', label: `Critical (${notificationSummary.critical})` },
          { key: 'high', label: `High (${notificationSummary.high})` },
          { key: 'unread', label: `Unread (${notificationSummary.unread})` },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key as any)}
            className="px-4 py-1.5 rounded-xl text-sm font-semibold transition-all"
            style={filter === f.key
              ? { background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: '#fff' }
              : { background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Grouped notifications */}
      {filter === 'all' ? (
        <div className="space-y-6">
          {groups.map(priority => {
            const group = notifications.filter(n => n.priority === priority);
            if (group.length === 0) return null;
            const cfg = priorityConfig[priority];
            return (
              <div key={priority}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
                  <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: cfg.color }}>
                    {cfg.label} Priority
                  </h2>
                  <div className="flex-1 h-px" style={{ background: cfg.color + '20' }} />
                </div>
                <div className="space-y-3">
                  {group.map(n => <NotifCard key={n.id} n={n} />)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(n => <NotifCard key={n.id} n={n} />)}
        </div>
      )}
    </div>
  );
}
