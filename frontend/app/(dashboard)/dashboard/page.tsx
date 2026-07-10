'use client';

import { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Pickaxe, Cpu, Users, ShieldAlert, ClipboardCheck,
  Zap, TrendingUp, AlertTriangle, Clock, CheckCircle2
} from 'lucide-react';
import KPICard from '@/components/ui/KPICard';
import Badge from '@/components/ui/Badge';
import { mines, totalProductionToday, totalTargetToday, overallEfficiency, monthlyTrend } from '@/lib/mock/production';
import { equipment, equipmentSummary } from '@/lib/mock/equipment';
import { employeeSummary } from '@/lib/mock/employees';
import { notifications } from '@/lib/mock/notifications';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#64748b'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs">
      <p className="font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString('en-IN') : p.value}
        </p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const [liveProduction, setLiveProduction] = useState(totalProductionToday);

  // Simulate live production increments
  useEffect(() => {
    const t = setInterval(() => {
      setLiveProduction(p => p + Math.floor(Math.random() * 5));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const aiRecommendations = [
    { icon: '🔴', text: 'Remove Dumper 203 from service immediately — 83% failure probability', priority: 'critical' },
    { icon: '⚠️', text: 'Schedule dust suppression in Rajrappa Sector-4 — levels at 112% of limit', priority: 'high' },
    { icon: '⚠️', text: '14 employee safety certifications expiring within 30 days', priority: 'high' },
    { icon: '🟡', text: 'Kuju mine needs DR-2 drill rig maintenance to avoid Q3 shortfall', priority: 'medium' },
    { icon: '🟢', text: 'Piparwar achieving 100.5% production — consider capacity expansion study', priority: 'low' },
  ];

  const pieData = [
    { name: 'Operational', value: equipmentSummary.operational },
    { name: 'Maintenance', value: equipmentSummary.maintenance },
    { name: 'Breakdown', value: equipmentSummary.breakdown },
    { name: 'Idle', value: equipmentSummary.idle },
  ];

  const criticalAlerts = notifications.filter(n => n.priority === 'critical' || n.priority === 'high').slice(0, 4);

  const upcomingMaintenance = equipment
    .sort((a, b) => new Date(a.nextMaintenance).getTime() - new Date(b.nextMaintenance).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            Executive Dashboard
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
            Central Coalfields Limited · Real-time Operations Overview
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold"
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: 'var(--color-green)' }}>
          <div className="w-2 h-2 rounded-full bg-green-400 pulse-green" />
          7 Mines Online
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <KPICard
          title="Production Today"
          value={(liveProduction / 1000).toFixed(1)}
          unit="K MT"
          change={-4.2}
          changeLabel="vs target"
          icon={<Pickaxe size={20} />}
          color="blue"
          live
        />
        <KPICard
          title="Equipment Health"
          value={equipmentSummary.avgHealth}
          unit="%"
          change={-3.1}
          changeLabel="vs last week"
          icon={<Cpu size={20} />}
          color={equipmentSummary.avgHealth >= 75 ? 'green' : 'amber'}
          subtitle={`${equipmentSummary.operational}/${equipmentSummary.total} operational`}
        />
        <KPICard
          title="Active Workers"
          value={employeeSummary.present.toLocaleString('en-IN')}
          unit=""
          change={2.1}
          changeLabel="vs yesterday"
          icon={<Users size={20} />}
          color="green"
          subtitle={`of ${employeeSummary.total.toLocaleString('en-IN')} total`}
        />
        <KPICard
          title="Safety Incidents"
          value={5}
          unit="this month"
          change={-37.5}
          changeLabel="vs last month"
          icon={<ShieldAlert size={20} />}
          color="amber"
          subtitle="8 last month"
        />
        <KPICard
          title="Pending Approvals"
          value={12}
          icon={<ClipboardCheck size={20} />}
          color="purple"
          subtitle="3 urgent"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Production Trend */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>Monthly Production Trend</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>All mines combined — last 30 days (MT)</p>
            </div>
            <Badge variant="info">30-day view</Badge>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false}
                tickFormatter={v => v.slice(5)} interval={4} />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false}
                tickFormatter={v => (v / 1000).toFixed(0) + 'K'} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={1.5} fill="url(#targetGrad)" name="Target" strokeDasharray="4 2" />
              <Area type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} fill="url(#prodGrad)" name="Actual" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Equipment Status Pie */}
        <div className="glass-card p-5">
          <h2 className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Equipment Status</h2>
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-secondary)' }}>{equipmentSummary.total} machines total</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                dataKey="value" stroke="none">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {pieData.map((p, i) => (
              <div key={p.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
                <span style={{ color: 'var(--color-text-secondary)' }}>{p.name}</span>
                <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{p.value}</span>
              </div>
            ))}
          </div>
          {equipmentSummary.criticalCount > 0 && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
              <AlertTriangle size={12} />
              {equipmentSummary.criticalCount} critical — action needed
            </div>
          )}
        </div>
      </div>

      {/* Mine-wise Production Bar */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>Mine-wise Production — Current Month</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>Actual vs Target (MT)</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: '#3b82f6' }} /><span style={{ color: 'var(--color-text-secondary)' }}>Actual</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded border" style={{ borderColor: '#f59e0b', background: 'transparent' }} /><span style={{ color: 'var(--color-text-secondary)' }}>Target</span></div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={mines} margin={{ left: 0, right: 0 }}>
            <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false}
              tickFormatter={v => (v / 1000).toFixed(0) + 'K'} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="monthTarget" name="Target" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" strokeWidth={1} radius={[4, 4, 0, 0]} />
            <Bar dataKey="monthActual" name="Actual" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* AI Recommendations */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1e40af, #7c3aed)' }}>
              <Zap size={14} style={{ color: '#fff' }} />
            </div>
            <div>
              <h2 className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>AI Recommendations</h2>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Generated by IntelliMine Copilot</p>
            </div>
          </div>
          <div className="space-y-3">
            {aiRecommendations.map((r, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl text-sm"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)' }}>
                <span className="flex-shrink-0">{r.icon}</span>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Recent Alerts */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} style={{ color: 'var(--color-amber)' }} />
              <h2 className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>Recent Alerts</h2>
            </div>
            <div className="space-y-2">
              {criticalAlerts.map(n => (
                <div key={n.id} className="flex items-start gap-2 text-xs p-2 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-0.5 ${n.priority === 'critical' ? 'pulse-red' : 'pulse-amber'}`}
                    style={{ background: n.priority === 'critical' ? 'var(--color-red)' : 'var(--color-amber)' }} />
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{n.title.replace(/🔴|⚠️|🟡/g, '').trim()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Maintenance */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={16} style={{ color: 'var(--color-blue)' }} />
              <h2 className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>Upcoming Maintenance</h2>
            </div>
            <div className="space-y-2">
              {upcomingMaintenance.map(e => {
                const due = new Date(e.nextMaintenance);
                const days = Math.ceil((due.getTime() - Date.now()) / 86400000);
                return (
                  <div key={e.id} className="flex items-center justify-between text-xs p-2 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{e.name}</p>
                      <p style={{ color: 'var(--color-text-muted)' }}>{e.mineName}</p>
                    </div>
                    <Badge variant={days <= 0 ? 'danger' : days <= 7 ? 'warning' : 'success'} size="sm">
                      {days <= 0 ? 'Overdue' : days === 1 ? 'Tomorrow' : `${days}d`}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
