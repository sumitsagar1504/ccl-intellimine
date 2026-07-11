'use client';

import { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Pickaxe, Cpu, Users, ShieldAlert, ClipboardCheck,
  Zap, AlertTriangle, Clock, TrendingUp, Activity, ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import KPICard from '@/components/ui/KPICard';
import Badge from '@/components/ui/Badge';
import { mines, totalProductionToday, totalTargetToday, overallEfficiency, monthlyTrend } from '@/lib/mock/production';
import { equipment, equipmentSummary } from '@/lib/mock/equipment';
import { employeeSummary } from '@/lib/mock/employees';
import { notifications } from '@/lib/mock/notifications';

const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444', '#334155'];

const TT = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2.5 text-xs" style={{ border: '1px solid rgba(59,130,246,0.25)' }}>
      <p className="font-semibold mb-1.5 text-[11px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span style={{ color: 'var(--text-secondary)' }}>{p.name}:</span>
          <span className="font-semibold" style={{ color: p.color }}>
            {typeof p.value === 'number' ? p.value.toLocaleString('en-IN') : p.value}
          </span>
        </p>
      ))}
    </div>
  );
};

const AI_RECS = [
  { icon: '🔴', text: 'Remove Dumper 203 from service — 83% failure probability. Bearing replacement required.', priority: 'critical' },
  { icon: '⚠️', text: 'Schedule dust suppression in Rajrappa Sector-4 — air quality at 112% of safe limit.', priority: 'high' },
  { icon: '⚠️', text: '14 employee safety certifications expire within 30 days. Initiate renewal process.', priority: 'high' },
  { icon: '🟡', text: 'Kuju mine needs DR-2 drill rig maintenance to prevent Q3 production shortfall.', priority: 'medium' },
  { icon: '✅', text: 'Piparwar at 100.5% efficiency — evaluate capacity expansion for FY2026.', priority: 'low' },
];

const priorityBar: Record<string, string> = {
  critical: 'var(--red)', high: 'var(--amber)', medium: 'var(--cyan)', low: 'var(--green)',
};

export default function DashboardPage() {
  const [liveProduction, setLiveProduction] = useState(totalProductionToday);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setLiveProduction(p => p + Math.floor(Math.random() * 8 + 2));
      setAnimating(true);
      setTimeout(() => setAnimating(false), 600);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const criticalAlerts = notifications.filter(n => n.priority === 'critical' || n.priority === 'high').slice(0, 4);
  const upcomingMaintenance = equipment
    .sort((a, b) => new Date(a.nextMaintenance).getTime() - new Date(b.nextMaintenance).getTime())
    .slice(0, 4);

  const pieData = [
    { name: 'Operational', value: equipmentSummary.operational },
    { name: 'Maintenance', value: equipmentSummary.maintenance },
    { name: 'Breakdown',   value: equipmentSummary.breakdown },
    { name: 'Idle',        value: equipmentSummary.idle },
  ];

  const efficiency = Math.round((totalProductionToday / totalTargetToday) * 100);

  return (
    <div className="space-y-5">

      {/* Page header */}
      <div className="flex items-start justify-between slide-in-up">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Executive Dashboard
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Real-time operations overview · Updated every 4 seconds
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold"
            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: 'var(--green)' }}>
            <div className="w-1.5 h-1.5 rounded-full pulse-green" style={{ background: 'var(--green)' }} />
            7 Mines Live
          </div>
          <Link href="/copilot"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg,#1e40af,#6366f1)', color: '#fff', boxShadow: '0 3px 12px rgba(99,102,241,0.35)' }}>
            <Zap size={12} /> Ask AI
          </Link>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
        <KPICard index={0} title="Production Today" live
          value={(liveProduction / 1000).toFixed(1)} unit="K MT"
          change={-4.2} changeLabel="vs target"
          icon={<Pickaxe size={17} />} color="blue"
          subtitle={`Target: ${(totalTargetToday / 1000).toFixed(0)}K MT`}
        />
        <KPICard index={1} title="Equipment Health"
          value={equipmentSummary.avgHealth} unit="%"
          change={-3.1} changeLabel="vs last week"
          icon={<Cpu size={17} />}
          color={equipmentSummary.avgHealth >= 75 ? 'green' : 'amber'}
          subtitle={`${equipmentSummary.operational}/${equipmentSummary.total} operational`}
        />
        <KPICard index={2} title="Active Workers"
          value={employeeSummary.present.toLocaleString('en-IN')}
          change={2.1} changeLabel="vs yesterday"
          icon={<Users size={17} />} color="green"
          subtitle={`of ${employeeSummary.total.toLocaleString('en-IN')} total`}
        />
        <KPICard index={3} title="Safety Incidents"
          value={5} unit="this month"
          change={-37.5} changeLabel="vs last month"
          icon={<ShieldAlert size={17} />} color="amber"
          subtitle="8 last month — improving"
        />
        <KPICard index={4} title="Pending Approvals"
          value={12}
          icon={<ClipboardCheck size={17} />} color="purple"
          subtitle="3 marked urgent"
        />
      </div>

      {/* Efficiency bar */}
      <div className="glass-card p-4 slide-in-up delay-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Activity size={14} style={{ color: 'var(--blue-light)' }} />
            <span className="text-[12px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Overall Fleet Efficiency Today
            </span>
          </div>
          <span className="text-[13px] font-bold" style={{ color: efficiency >= 90 ? 'var(--green)' : efficiency >= 75 ? 'var(--amber)' : 'var(--red)' }}>
            {efficiency}%
          </span>
        </div>
        <div className="progress-track">
          <div className="progress-fill"
            style={{
              width: `${efficiency}%`,
              background: efficiency >= 90
                ? 'linear-gradient(90deg, #10b981, #34d399)'
                : efficiency >= 75
                ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                : 'linear-gradient(90deg, #ef4444, #f87171)',
            }} />
        </div>
        <div className="flex justify-between mt-1.5 text-[10px]" style={{ color: 'var(--text-dim)' }}>
          <span>0%</span>
          <span className="text-center">Target: 92%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Production Area Chart */}
        <div className="lg:col-span-2 glass-card p-5 slide-in-up delay-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>Monthly Production Trend</h2>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>All mines combined · last 30 days (MT)</p>
            </div>
            <div className="flex items-center gap-3 text-[10.5px]">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-0.5 rounded" style={{ background: '#3b82f6' }} /><span style={{ color: 'var(--text-muted)' }}>Actual</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-0.5 rounded border-0 border-dashed" style={{ background: '#f59e0b', height: 1 }} /><span style={{ color: 'var(--text-muted)' }}>Target</span></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={monthlyTrend} margin={{ left: -10, right: 8 }}>
              <defs>
                <linearGradient id="gActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: '#445577', fontSize: 10 }} tickLine={false} axisLine={false}
                tickFormatter={v => v.slice(5)} interval={4} />
              <YAxis tick={{ fill: '#445577', fontSize: 10 }} tickLine={false} axisLine={false}
                tickFormatter={v => `${(v / 1000).toFixed(0)}K`} width={36} />
              <Tooltip content={<TT />} />
              <Area type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={1.5} fill="url(#gTarget)"
                name="Target" strokeDasharray="5 3" dot={false} />
              <Area type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gActual)"
                name="Actual" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Equipment Donut */}
        <div className="glass-card p-5 slide-in-up delay-3">
          <h2 className="font-semibold text-[14px] mb-0.5" style={{ color: 'var(--text-primary)' }}>Equipment Status</h2>
          <p className="text-[11px] mb-4" style={{ color: 'var(--text-muted)' }}>{equipmentSummary.total} machines across all mines</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={68} dataKey="value" stroke="none" paddingAngle={2}>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip content={<TT />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-3">
            {pieData.map((p, i) => (
              <div key={p.name} className="flex items-center gap-1.5 text-[11px]">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                <span style={{ color: 'var(--text-muted)' }}>{p.name}</span>
                <span className="font-bold ml-auto" style={{ color: 'var(--text-primary)' }}>{p.value}</span>
              </div>
            ))}
          </div>
          {equipmentSummary.criticalCount > 0 && (
            <Link href="/equipment"
              className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] transition-all hover:scale-[1.02]"
              style={{ background: 'rgba(239,68,68,0.09)', border: '1px solid rgba(239,68,68,0.22)', color: 'var(--red-light)' }}>
              <AlertTriangle size={11} className="flex-shrink-0" />
              <span className="flex-1">{equipmentSummary.criticalCount} critical — immediate action</span>
              <ArrowUpRight size={11} />
            </Link>
          )}
        </div>
      </div>

      {/* Mine Bar Chart */}
      <div className="glass-card p-5 slide-in-up delay-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>Mine-wise Production · Current Month</h2>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Actual vs Target (MT)</p>
          </div>
          <Link href="/analytics"
            className="flex items-center gap-1 text-[11px] font-semibold transition-colors hover:opacity-80"
            style={{ color: 'var(--blue-light)' }}>
            Full Analytics <ArrowUpRight size={11} />
          </Link>
        </div>
        <ResponsiveContainer width="100%" height={190}>
          <BarChart data={mines} margin={{ left: -10, right: 8 }} barCategoryGap="30%">
            <XAxis dataKey="name" tick={{ fill: '#445577', fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: '#445577', fontSize: 10 }} tickLine={false} axisLine={false}
              tickFormatter={v => `${(v / 1000).toFixed(0)}K`} width={36} />
            <Tooltip content={<TT />} />
            <Bar dataKey="monthTarget" name="Target"
              fill="rgba(245,158,11,0.15)" stroke="#f59e0b" strokeWidth={1} radius={[4, 4, 0, 0]} />
            <Bar dataKey="monthActual" name="Actual" radius={[4, 4, 0, 0]}>
              {mines.map((mine, i) => (
                <Cell key={i} fill={mine.monthActual >= mine.monthTarget ? '#10b981' : '#3b82f6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-[10px] mt-2" style={{ color: 'var(--text-dim)' }}>
          🟢 Green = on or above target · 🔵 Blue = below target
        </p>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* AI Recommendations */}
        <div className="glass-card p-5 slide-in-up delay-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#1e40af,#6366f1,#7c3aed)', boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }}>
              <Zap size={15} style={{ color: '#fff' }} />
            </div>
            <div>
              <h2 className="font-semibold text-[13.5px]" style={{ color: 'var(--text-primary)' }}>AI Recommendations</h2>
              <p className="text-[10.5px]" style={{ color: 'var(--text-muted)' }}>Generated by Gemini · Updated just now</p>
            </div>
          </div>
          <div className="space-y-2">
            {AI_RECS.map((r, i) => (
              <div key={i}
                className="flex items-start gap-3 p-3 rounded-xl text-[12.5px] transition-all hover:scale-[1.01] slide-in-up"
                style={{
                  background:     'rgba(255,255,255,0.02)',
                  border:         '1px solid var(--border)',
                  borderLeft:     `3px solid ${priorityBar[r.priority]}`,
                  animationDelay: `${i * 0.05 + 0.3}s`,
                }}>
                <span className="flex-shrink-0 text-base">{r.icon}</span>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.55 }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts + Maintenance */}
        <div className="space-y-4">
          {/* Recent Alerts */}
          <div className="glass-card p-5 slide-in-up delay-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} style={{ color: 'var(--amber)' }} />
                <h2 className="font-semibold text-[13.5px]" style={{ color: 'var(--text-primary)' }}>Recent Alerts</h2>
              </div>
              <Link href="/notifications" className="text-[10.5px] font-semibold hover:opacity-70 transition-opacity"
                style={{ color: 'var(--blue-light)' }}>
                View all →
              </Link>
            </div>
            <div className="space-y-1.5">
              {criticalAlerts.map((n, i) => (
                <div key={n.id}
                  className="flex items-start gap-2.5 text-[12px] p-2.5 rounded-xl transition-all hover:bg-white/5 slide-in-up"
                  style={{ animationDelay: `${i * 0.06}s` }}>
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${n.priority === 'critical' ? 'pulse-red' : 'pulse-amber'}`}
                    style={{ background: n.priority === 'critical' ? 'var(--red)' : 'var(--amber)' }} />
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {n.title.replace(/[🔴⚠️🟡]/g, '').trim()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Maintenance */}
          <div className="glass-card p-5 slide-in-up delay-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock size={14} style={{ color: 'var(--blue-light)' }} />
                <h2 className="font-semibold text-[13.5px]" style={{ color: 'var(--text-primary)' }}>Upcoming Maintenance</h2>
              </div>
              <Link href="/equipment" className="text-[10.5px] font-semibold hover:opacity-70 transition-opacity"
                style={{ color: 'var(--blue-light)' }}>
                View all →
              </Link>
            </div>
            <div className="space-y-1.5">
              {upcomingMaintenance.map((e, i) => {
                const days = Math.ceil((new Date(e.nextMaintenance).getTime() - Date.now()) / 86400000);
                return (
                  <div key={e.id}
                    className="flex items-center justify-between text-[12px] p-2.5 rounded-xl transition-all hover:bg-white/5 slide-in-up"
                    style={{ animationDelay: `${i * 0.06}s` }}>
                    <div>
                      <p className="font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>{e.name}</p>
                      <p className="text-[10.5px]" style={{ color: 'var(--text-muted)' }}>{e.mineName}</p>
                    </div>
                    <span className="badge"
                      style={{
                        background: days <= 0 ? 'rgba(239,68,68,0.15)' : days <= 7 ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.12)',
                        color:      days <= 0 ? 'var(--red-light)'     : days <= 7 ? 'var(--amber-light)'    : 'var(--green-light)',
                      }}>
                      {days <= 0 ? 'Overdue' : days === 1 ? 'Tomorrow' : `${days}d`}
                    </span>
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
