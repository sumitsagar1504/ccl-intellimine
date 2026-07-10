'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { ArrowLeft, Thermometer, Activity, Fuel, Clock, Calendar, AlertTriangle, CheckCircle2, Wrench } from 'lucide-react';
import { equipment } from '@/lib/mock/equipment';
import HealthRing from '@/components/ui/HealthRing';
import Badge from '@/components/ui/Badge';

export default function EquipmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const eq = equipment.find(e => e.id === id);
  if (!eq) return notFound();

  const statusVariant: any = { operational: 'success', maintenance: 'warning', breakdown: 'danger', idle: 'muted' };

  const failureColor = eq.failureProbability >= 70 ? 'var(--color-red)'
    : eq.failureProbability >= 40 ? 'var(--color-amber)'
    : 'var(--color-green)';

  // Failure probability gauge (SVG)
  const gaugeSize = 180;
  const gaugeR = 70;
  const gaugeCirc = Math.PI * gaugeR; // semicircle
  const gaugeOffset = gaugeCirc - (eq.failureProbability / 100) * gaugeCirc;

  return (
    <div className="space-y-6 fade-in">
      {/* Back + Header */}
      <div className="flex items-center gap-4">
        <Link href="/equipment" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
          <ArrowLeft size={18} style={{ color: 'var(--color-text-secondary)' }} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{eq.name}</h1>
            <Badge variant={statusVariant[eq.status]} dot>{eq.status.charAt(0).toUpperCase() + eq.status.slice(1)}</Badge>
          </div>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
            {eq.id} · {eq.type} · {eq.manufacturer} {eq.model} · {eq.mineName} Mine
          </p>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Hours', value: eq.totalHours.toLocaleString('en-IN'), unit: 'hrs', icon: <Clock size={16} />, color: 'blue' },
          { label: 'This Month', value: eq.hoursThisMonth, unit: 'hrs', icon: <Activity size={16} />, color: 'green' },
          { label: 'Fuel Today', value: eq.fuelConsumptionToday.toLocaleString('en-IN'), unit: 'L', icon: <Fuel size={16} />, color: 'amber' },
          { label: 'Downtime MTD', value: eq.downtimeHours, unit: 'hrs', icon: <AlertTriangle size={16} />, color: eq.downtimeHours > 20 ? 'red' : 'purple' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <span style={{ color: `var(--color-${s.color})` }}>{s.icon}</span>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{s.label}</p>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{s.value}</p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{s.unit}</p>
          </div>
        ))}
      </div>

      {/* Charts + Gauge Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Health Trend Chart */}
        <div className="lg:col-span-2 glass-card p-5">
          <h2 className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>30-Day Health Trend</h2>
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-secondary)' }}>Health score, temperature & vibration over time</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={eq.healthTrend}>
              <CartesianGrid strokeOpacity={0.07} />
              <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false}
                tickFormatter={v => v.slice(5)} interval={4} />
              <YAxis yAxisId="left" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(13,26,53,0.95)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Line yAxisId="left" type="monotone" dataKey="health" stroke="#10b981" strokeWidth={2} dot={false} name="Health %" />
              <Line yAxisId="right" type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="Temp °C" strokeDasharray="4 2" />
              <Line yAxisId="right" type="monotone" dataKey="vibration" stroke="#ef4444" strokeWidth={1.5} dot={false} name="Vibration" strokeDasharray="2 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Failure Probability Gauge */}
        <div className="glass-card p-5 flex flex-col items-center justify-center">
          <h2 className="font-semibold mb-1 self-start" style={{ color: 'var(--color-text-primary)' }}>Failure Probability</h2>
          <p className="text-xs mb-4 self-start" style={{ color: 'var(--color-text-secondary)' }}>AI prediction model</p>

          <svg width={gaugeSize} height={gaugeSize / 2 + 30} viewBox={`0 0 ${gaugeSize} ${gaugeSize / 2 + 30}`}>
            {/* Track */}
            <path d={`M 15 ${gaugeSize / 2} A ${gaugeR} ${gaugeR} 0 0 1 ${gaugeSize - 15} ${gaugeSize / 2}`}
              fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={16} strokeLinecap="round" />
            {/* Fill */}
            <path d={`M 15 ${gaugeSize / 2} A ${gaugeR} ${gaugeR} 0 0 1 ${gaugeSize - 15} ${gaugeSize / 2}`}
              fill="none" stroke={failureColor} strokeWidth={16} strokeLinecap="round"
              strokeDasharray={gaugeCirc} strokeDashoffset={gaugeOffset}
              style={{ filter: `drop-shadow(0 0 8px ${failureColor})`, transition: 'stroke-dashoffset 1s ease', transform: 'rotate(180deg)', transformOrigin: `${gaugeSize / 2}px ${gaugeSize / 2}px` }} />
            {/* Value */}
            <text x={gaugeSize / 2} y={gaugeSize / 2 - 5} textAnchor="middle" fill={failureColor} fontSize="32" fontWeight="bold" fontFamily="Inter">
              {eq.failureProbability}%
            </text>
            <text x={gaugeSize / 2} y={gaugeSize / 2 + 18} textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="Inter">
              failure probability
            </text>
            <text x="15" y={gaugeSize / 2 + 28} fill="#64748b" fontSize="10" fontFamily="Inter">0%</text>
            <text x={gaugeSize - 25} y={gaugeSize / 2 + 28} fill="#64748b" fontSize="10" fontFamily="Inter">100%</text>
          </svg>

          {/* AI Prediction Box */}
          {eq.failureProbability >= 50 && (
            <div className="w-full mt-2 px-3 py-3 rounded-xl text-xs"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>
              <p className="font-semibold mb-1 flex items-center gap-1.5">
                <AlertTriangle size={12} /> AI Prediction
              </p>
              <p style={{ lineHeight: 1.6 }}>
                {eq.failureProbability >= 80
                  ? `Machine likely to fail within 48 hours. Recommended action: Remove from service immediately and replace bearing (Part No: SKF-29415).`
                  : `Elevated failure risk detected. Schedule maintenance within ${eq.remainingLife} months. Monitor temperature closely.`}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 w-full mt-3">
            <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Machine Age</p>
              <p className="font-bold" style={{ color: 'var(--color-text-primary)' }}>{eq.age} yrs</p>
            </div>
            <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Life Left</p>
              <p className="font-bold" style={{ color: eq.remainingLife <= 6 ? 'var(--color-red)' : 'var(--color-green)' }}>{eq.remainingLife} mo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Sensors + Maintenance History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Live Sensors */}
        <div className="glass-card p-5">
          <h2 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Live Sensor Readings</h2>
          <div className="space-y-4">
            {[
              { label: 'Engine Temperature', value: eq.temperature, unit: '°C', max: 120, warn: 80, crit: 95, icon: <Thermometer size={14} /> },
              { label: 'Vibration Level', value: eq.vibration, unit: 'mm/s', max: 15, warn: 4, crit: 7, icon: <Activity size={14} /> },
              { label: 'Health Score', value: eq.healthScore, unit: '%', max: 100, warn: 60, crit: 40, reverse: true, icon: <CheckCircle2 size={14} /> },
            ].map(s => {
              const pct = (s.value / s.max) * 100;
              const isWarn = s.reverse ? s.value <= s.warn : s.value >= s.warn;
              const isCrit = s.reverse ? s.value <= s.crit : s.value >= s.crit;
              const barColor = isCrit ? 'var(--color-red)' : isWarn ? 'var(--color-amber)' : 'var(--color-green)';
              return (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      {s.icon} {s.label}
                    </div>
                    <span className="text-sm font-bold" style={{ color: barColor }}>{s.value} {s.unit}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(pct, 100)}%`, background: barColor, boxShadow: `0 0 8px ${barColor}` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Maintenance Dates */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl text-xs" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
              <div className="flex items-center gap-1.5 mb-1" style={{ color: 'var(--color-green)' }}>
                <Calendar size={12} /> Last Maintenance
              </div>
              <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{eq.lastMaintenance}</p>
            </div>
            <div className="p-3 rounded-xl text-xs" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}>
              <div className="flex items-center gap-1.5 mb-1" style={{ color: 'var(--color-blue)' }}>
                <Calendar size={12} /> Next Scheduled
              </div>
              <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{eq.nextMaintenance}</p>
            </div>
          </div>
        </div>

        {/* Maintenance History */}
        <div className="glass-card p-5">
          <h2 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Maintenance History</h2>
          {eq.maintenanceHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              <CheckCircle2 size={24} className="mb-2 opacity-30" />
              No maintenance records yet
            </div>
          ) : (
            <div className="space-y-3">
              {eq.maintenanceHistory.map((m, i) => (
                <div key={i} className="flex gap-3 text-xs">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: m.type === 'Breakdown' ? 'rgba(239,68,68,0.15)' : m.type === 'Scheduled' ? 'rgba(59,130,246,0.15)' : 'rgba(16,185,129,0.15)',
                        color: m.type === 'Breakdown' ? 'var(--color-red)' : m.type === 'Scheduled' ? 'var(--color-blue)' : 'var(--color-green)',
                      }}>
                      <Wrench size={12} />
                    </div>
                    {i < eq.maintenanceHistory.length - 1 && (
                      <div className="w-px flex-1 mt-1" style={{ background: 'var(--color-border)', minHeight: 16 }} />
                    )}
                  </div>
                  <div className="pb-4">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{m.date}</span>
                      <Badge variant={m.type === 'Breakdown' ? 'danger' : m.type === 'Scheduled' ? 'default' : 'success'} size="sm">{m.type}</Badge>
                    </div>
                    <p className="mb-0.5" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{m.description}</p>
                    <div className="flex gap-3" style={{ color: 'var(--color-text-muted)' }}>
                      <span>Cost: ₹{m.cost.toLocaleString('en-IN')}</span>
                      <span>·</span>
                      <span>{m.hours} hrs</span>
                      <span>·</span>
                      <span>{m.technician}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
