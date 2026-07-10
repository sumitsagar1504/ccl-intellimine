'use client';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'muted';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  pulse?: boolean;
  size?: 'sm' | 'md';
}

const variants: Record<BadgeVariant, { bg: string; color: string; dot?: string }> = {
  default: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa', dot: '#60a5fa' },
  success: { bg: 'rgba(16,185,129,0.15)', color: '#34d399', dot: '#34d399' },
  warning: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', dot: '#fbbf24' },
  danger: { bg: 'rgba(239,68,68,0.15)', color: '#f87171', dot: '#ef4444' },
  info: { bg: 'rgba(6,182,212,0.15)', color: '#22d3ee', dot: '#22d3ee' },
  purple: { bg: 'rgba(139,92,246,0.15)', color: '#a78bfa', dot: '#8b5cf6' },
  muted: { bg: 'rgba(255,255,255,0.06)', color: '#64748b', dot: '#64748b' },
};

export default function Badge({ children, variant = 'default', dot, pulse, size = 'md' }: BadgeProps) {
  const v = variants[variant];
  return (
    <span className="badge" style={{
      background: v.bg,
      color: v.color,
      fontSize: size === 'sm' ? '10px' : '11px',
      padding: size === 'sm' ? '1px 7px' : '2px 10px',
    }}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${pulse ? 'pulse-green' : ''}`}
          style={{ background: v.dot, display: 'inline-block', verticalAlign: 'middle' }} />
      )}
      {children}
    </span>
  );
}
