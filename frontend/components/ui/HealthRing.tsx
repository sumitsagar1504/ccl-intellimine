'use client';

interface HealthRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showValue?: boolean;
}

export default function HealthRing({ score, size = 80, strokeWidth = 8, label, showValue = true }: HealthRingProps) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  const color = score >= 80 ? 'var(--color-green)'
    : score >= 60 ? 'var(--color-amber)'
    : score >= 40 ? '#f97316'
    : 'var(--color-red)';

  const glow = score >= 80 ? 'rgba(16,185,129,0.4)'
    : score >= 60 ? 'rgba(245,158,11,0.4)'
    : 'rgba(239,68,68,0.4)';

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${glow})`, transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        {showValue && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-bold text-sm" style={{ color }}>{score}</span>
            {size > 60 && <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>%</span>}
          </div>
        )}
      </div>
      {label && <p className="text-xs text-center" style={{ color: 'var(--color-text-secondary)' }}>{label}</p>}
    </div>
  );
}
