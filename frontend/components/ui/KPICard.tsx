'use client';

import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number; // % change
  changeLabel?: string;
  icon?: ReactNode;
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
  subtitle?: string;
  live?: boolean;
}

const colorMap = {
  blue: { border: 'var(--color-blue)', glow: 'rgba(59,130,246,0.15)', icon: 'rgba(59,130,246,0.15)', iconText: 'var(--color-blue)' },
  green: { border: 'var(--color-green)', glow: 'rgba(16,185,129,0.15)', icon: 'rgba(16,185,129,0.15)', iconText: 'var(--color-green)' },
  amber: { border: 'var(--color-amber)', glow: 'rgba(245,158,11,0.15)', icon: 'rgba(245,158,11,0.15)', iconText: 'var(--color-amber)' },
  red: { border: 'var(--color-red)', glow: 'rgba(239,68,68,0.15)', icon: 'rgba(239,68,68,0.15)', iconText: 'var(--color-red)' },
  purple: { border: 'var(--color-purple)', glow: 'rgba(139,92,246,0.15)', icon: 'rgba(139,92,246,0.15)', iconText: 'var(--color-purple)' },
};

export default function KPICard({ title, value, unit, change, changeLabel, icon, color = 'blue', subtitle, live }: KPICardProps) {
  const c = colorMap[color];
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div className="glass-card p-5 relative overflow-hidden"
      style={{ borderTop: `3px solid ${c.border}`, boxShadow: `0 0 20px ${c.glow}` }}>
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20 pointer-events-none -translate-y-8 translate-x-8"
        style={{ background: `radial-gradient(circle, ${c.border}, transparent)` }} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>
                {title}
              </p>
              {live && (
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-green" />
                  <span className="text-xs" style={{ color: 'var(--color-green)' }}>LIVE</span>
                </div>
              )}
            </div>
          </div>
          {icon && (
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: c.icon, color: c.iconText }}>
              {icon}
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-3xl font-bold count-up" style={{ color: 'var(--color-text-primary)' }}>
            {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
          </span>
          {unit && <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>{unit}</span>}
        </div>

        {subtitle && (
          <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>{subtitle}</p>
        )}

        {change !== undefined && (
          <div className="flex items-center gap-1">
            {isPositive && <TrendingUp size={12} style={{ color: 'var(--color-green)' }} />}
            {isNegative && <TrendingDown size={12} style={{ color: 'var(--color-red)' }} />}
            {!isPositive && !isNegative && <Minus size={12} style={{ color: 'var(--color-text-muted)' }} />}
            <span className="text-xs font-semibold"
              style={{ color: isPositive ? 'var(--color-green)' : isNegative ? 'var(--color-red)' : 'var(--color-text-muted)' }}>
              {change > 0 ? '+' : ''}{change}%
            </span>
            {changeLabel && (
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}> {changeLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
