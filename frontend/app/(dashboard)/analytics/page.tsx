'use client';

import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine
} from 'recharts';
import { TrendingUp, Zap, Fuel, Cpu, Package } from 'lucide-react';
import { productionForecast, fuelConsumption, equipmentFailurePrediction, powerConsumption, productionByMine, safetyTrend, inventoryLevels, kpiSummary } from '@/lib/mock/analytics';
import Badge from '@/components/ui/Badge';

const tabs = [
  { id: 'production', label: 'Production Forecast', icon: TrendingUp },
  { id: 'equipment', label: 'Equipment Failure', icon: Cpu },
  { id: 'fuel', label: 'Fuel Consumption', icon: Fuel },
  { id: 'power', label: 'Power Usage', icon: Zap },
  { id: 'inventory', label: 'Inventory', icon: Package },
];

const TT = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs">
      <p className="font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>{label}</p>
      {payload.map((p: any) => p.value != null && (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' ? p.value.toLocaleString('en-IN') : p.value}</p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('production');

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Predictive Analytics</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
          ML-powered forecasts and insights for CCL operations
        </p>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'MTD Production', value: `${(kpiSummary.totalProductionMTD / 1000000).toFixed(2)}M MT`, color: 'var(--color-blue)' },
          { label: 'Efficiency', value: `${kpiSummary.efficiency}%`, color: 'var(--color-green)' },
          { label: 'Equip. Health', value: `${kpiSummary.avgEquipmentHealth}%`, color: 'var(--color-amber)' },
          { label: 'Safety Score', value: `${kpiSummary.safetyScore}%`, color: 'var(--color-green)' },
          { label: 'Fuel Efficiency', value: `${kpiSummary.fuelEfficiency}%`, color: 'var(--color-cyan)' },
          { label: 'Active Equip', value: `${kpiSummary.activeEquipment}/${kpiSummary.totalEquipment}`, color: 'var(--color-purple)' },
        ].map(k => (
          <div key={k.label} className="glass-card p-3 text-center">
            <p className="text-lg font-bold" style={{ color: k.color }}>{k.value}</p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl overflow-x-auto" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)' }}>
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all"
              style={activeTab === t.id
                ? { background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: '#fff' }
                : { color: 'var(--color-text-secondary)' }}>
              <Icon size={14} />{t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'production' && (
        <div className="space-y-4">
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>Annual Production Forecast (MT in Millions)</h2>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Actual + AI forecast with target line</p>
              </div>
              <Badge variant="purple">AI Forecast</Badge>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={productionForecast.labels.map((l, i) => ({
                month: l, target: productionForecast.target[i],
                actual: productionForecast.actual[i], forecast: productionForecast.forecast[i],
              }))}>
                <defs>
                  <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} /><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeOpacity={0.06} />
                <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<TT />} />
                <Area type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={1.5} fill="none" strokeDasharray="4 2" name="Target" />
                <Area type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} fill="url(#ag)" name="Actual" />
                <Area type="monotone" dataKey="forecast" stroke="#8b5cf6" strokeWidth={2} fill="url(#fg)" strokeDasharray="6 3" name="AI Forecast" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1e40af, #7c3aed)' }}>
                <Zap size={14} style={{ color: '#fff' }} />
              </div>
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-blue-bright)' }}>AI Insight</p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                  Production is tracking 8.2% below annual target. Key driver: Kuju mine shortfall of 19.6% in Q2 due to DR-2 downtime. 
                  Piparwar mine is outperforming at 100.5%. AI model forecasts year-end achievement of <strong style={{ color: 'var(--color-text-primary)' }}>68.4M MT</strong> vs target of 72M MT 
                  unless Kuju mine maintenance is expedited within 30 days.
                </p>
              </div>
            </div>
          </div>
          <div className="glass-card p-5">
            <h2 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Mine-wise Production vs Target (MTD)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={productionByMine.labels.map((l, i) => ({ mine: l, actual: productionByMine.actual[i], target: productionByMine.target[i] }))}>
                <XAxis dataKey="mine" tick={{ fill: '#475569', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => (v / 1000).toFixed(0) + 'K'} />
                <Tooltip content={<TT />} />
                <Bar dataKey="target" name="Target" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" strokeWidth={1} radius={[3, 3, 0, 0]} />
                <Bar dataKey="actual" name="Actual" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'equipment' && (
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h2 className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Equipment Failure Probability</h2>
            <p className="text-xs mb-4" style={{ color: 'var(--color-text-secondary)' }}>AI-predicted probability of failure in next 30 days</p>
            <div className="space-y-4">
              {equipmentFailurePrediction.labels.map((label, i) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {equipmentFailurePrediction.estimatedDaysToFailure[i] <= 0 ? '⛔ Now' : `~${equipmentFailurePrediction.estimatedDaysToFailure[i]} days`}
                      </span>
                      <span className="font-bold text-sm" style={{ color: equipmentFailurePrediction.colors[i] }}>
                        {equipmentFailurePrediction.failureProbability[i]}%
                      </span>
                    </div>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${equipmentFailurePrediction.failureProbability[i]}%`,
                        background: equipmentFailurePrediction.colors[i],
                        boxShadow: `0 0 8px ${equipmentFailurePrediction.colors[i]}60`,
                      }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'fuel' && (
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h2 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Fuel Consumption (Litres/Month)</h2>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={fuelConsumption.labels.map((l, i) => ({ month: l, consumption: fuelConsumption.data[i] }))}>
                <defs>
                  <linearGradient id="fuelg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} /><stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeOpacity={0.06} />
                <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => (v / 1000).toFixed(0) + 'K'} />
                <Tooltip content={<TT />} />
                <Area type="monotone" dataKey="consumption" stroke="#f59e0b" strokeWidth={2.5} fill="url(#fuelg)" name="Litres" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-card p-4">
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              <strong style={{ color: 'var(--color-amber)' }}>⚠️ AI Insight: </strong>{fuelConsumption.insight}
            </p>
          </div>
        </div>
      )}

      {activeTab === 'power' && (
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h2 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Power Consumption (MW-hours × 1000/Month)</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={powerConsumption.labels.map((l, i) => ({ month: l, consumption: powerConsumption.data[i], target: powerConsumption.target[i] }))}>
                <CartesianGrid strokeOpacity={0.06} />
                <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip content={<TT />} />
                <ReferenceLine y={9.5} stroke="#f59e0b" strokeDasharray="4 2" label={{ value: 'Target', fill: '#f59e0b', fontSize: 11 }} />
                <Bar dataKey="consumption" name="Actual" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-card p-4">
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              <strong style={{ color: 'var(--color-cyan)' }}>💡 AI Insight: </strong>{powerConsumption.insight}
            </p>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="glass-card p-5">
          <h2 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Inventory Status</h2>
          <div className="space-y-4">
            {inventoryLevels.items.map(item => {
              const pct = Math.min((item.current / (item.minimum * 3)) * 100, 100);
              const color = item.status === 'critical' ? 'var(--color-red)' : item.status === 'warning' ? 'var(--color-amber)' : 'var(--color-green)';
              return (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{item.name}</span>
                      <span className="text-xs ml-2" style={{ color: 'var(--color-text-muted)' }}>Min: {item.minimum.toLocaleString('en-IN')} {item.unit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {item.daysLeft <= 0 ? '⛔ Critical' : `${item.daysLeft} days left`}
                      </span>
                      <span className="font-bold text-sm" style={{ color }}>
                        {item.current.toLocaleString('en-IN')} {item.unit}
                      </span>
                    </div>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color, transition: 'width 1s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
