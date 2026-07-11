'use client';

import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

type Color = 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'cyan';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  color?: Color;
  subtitle?: string;
  live?: boolean;
  index?: number; // for stagger
}

const palette: Record<Color, { border: string; glow: string; iconBg: string; iconColor: string; badge: string }> = {
  blue:   { border: '#3b82f6', glow: 'rgba(59,130,246,0.18)',  iconBg: 'rgba(59,130,246,0.12)',  iconColor: '#60a5fa', badge: 'rgba(59,130,246,0.15)' },
  green:  { border: '#10b981', glow: 'rgba(16,185,129,0.18)',  iconBg: 'rgba(16,185,129,0.12)',  iconColor: '#34d399', badge: 'rgba(16,185,129,0.15)' },
  amber:  { border: '#f59e0b', glow: 'rgba(245,158,11,0.18)',  iconBg: 'rgba(245,158,11,0.12)',  iconColor: '#fbbf24', badge: 'rgba(245,158,11,0.15)' },
  red:    { border: '#ef4444', glow: 'rgba(239,68,68,0.18)',   iconBg: 'rgba(239,68,68,0.12)',   iconColor: '#f87171', badge: 'rgba(239,68,68,0.15)' },
  purple: { border: '#8b5cf6', glow: 'rgba(139,92,246,0.18)', iconBg: 'rgba(139,92,246,0.12)', iconColor: '#a78bfa', badge: 'rgba(139,92,246,0.15)' },
  cyan:   { border: '#06b6d4', glow: 'rgba(6,182,212,0.18)',  iconBg: 'rgba(6,182,212,0.12)',  iconColor: '#22d3ee', badge: 'rgba(6,182,212,0.15)' },
};

export default function KPICard({ title, value, unit, change, changeLabel, icon, color = 'blue', subtitle, live, index = 0 }: KPICardProps) {
  const c = palette[color];
  const pos = change !== undefined && change > 0;
  const neg = change !== undefined && change < 0;

  return (
    <div
      className="glass-card glass-card-interactive p-5 relative overflow-hidden slide-in-up"
      style={{
        borderTop: `2px solid ${c.border}`,
        boxShadow: `var(--shadow-card), 0 0 24px ${c.glow}`,
        animationDelay: `${index * 0.07}s`,
      }}
    >
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-36 h-36 -translate-y-12 translate-x-12 pointer-events-none rounded-full"
        style={{ background: `radial-gradient(circle, ${c.border}25, transparent 70%)` }} />

      {/* Shimmer accent bar */}
      <div className="absolute top-0 left-0 right-0 h-px shimmer" />

      <div className="relative z-10">
        {/* Title row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--text-muted)' }}>
              {title}
            </p>
            {live && (
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full pulse-green" style={{ background: 'var(--green)' }} />
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--green)' }}>LIVE</span>
              </div>
            )}
          </div>
          {icon && (
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: c.iconBg, color: c.iconColor, boxShadow: `0 4px 12px ${c.glow}` }}>
              {icon}
            </div>
          )}
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-1.5 mb-1.5">
          <span className="text-[28px] font-bold leading-none count-up" style={{ color: 'var(--text-primary)' }}>
            {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
          </span>
          {unit && (
            <span className="text-xs font-semibold" style={{ color: c.iconColor }}>{unit}</span>
          )}
        </div>

        {subtitle && (
          <p className="text-[11px] mb-3" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
        )}

        {/* Trend */}
        {change !== undefined && (
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
              style={{
                background: pos ? 'rgba(16,185,129,0.12)' : neg ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${pos ? 'rgba(16,185,129,0.2)' : neg ? 'rgba(239,68,68,0.2)' : 'var(--border)'}`,
              }}>
              {pos && <TrendingUp  size={10} style={{ color: 'var(--green)' }} />}
              {neg && <TrendingDown size={10} style={{ color: 'var(--red)' }} />}
              {!pos && !neg && <Minus size={10} style={{ color: 'var(--text-muted)' }} />}
              <span className="text-[11px] font-bold"
                style={{ color: pos ? 'var(--green)' : neg ? 'var(--red)' : 'var(--text-muted)' }}>
                {change > 0 ? '+' : ''}{change}%
              </span>
            </div>
            {changeLabel && (
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{changeLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
