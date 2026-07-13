'use client';

import { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, RadialBarChart, RadialBar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import {
  Pickaxe, Cpu, Users, ShieldAlert, ClipboardCheck,
  Zap, AlertTriangle, Clock, TrendingUp, Activity, ArrowUpRight,
  ShieldCheck, FileText, Wrench, GraduationCap, UserCheck,
  CalendarDays, BarChart3, HeartPulse, CheckCircle2, XCircle
} from 'lucide-react';
import Link from 'next/link';
import KPICard from '@/components/ui/KPICard';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/lib/auth/context';
import { monthlyTrend } from '@/lib/mock/production';
import { useMines, useEquipment, useEmployees, useEmployeeSummary, useNotifications } from '@/lib/api/hooks';

// ── Tooltip ─────────────────────────────────────────────────────────────────
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

const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444', '#334155'];

// ── Role meta ────────────────────────────────────────────────────────────────
const ROLE_META: Record<string, { title: string; subtitle: string; color: string; emoji: string }> = {
  admin:                { title: 'Executive Dashboard',     subtitle: 'Real-time operations overview · All mines',            color: '#6366f1', emoji: '🛡️' },
  mine_manager:         { title: 'Operations Command',       subtitle: 'Production, equipment & workforce at a glance',        color: '#0891b2', emoji: '⛏️' },
  safety_officer:       { title: 'Safety Control Center',   subtitle: 'Incidents, compliance & risk monitoring',              color: '#10b981', emoji: '🦺' },
  maintenance_engineer: { title: 'Equipment Intelligence',  subtitle: 'Fleet health, maintenance schedules & predictions',    color: '#f59e0b', emoji: '🔧' },
  hr:                   { title: 'Workforce Intelligence',  subtitle: 'Attendance, training, performance & leave analytics',  color: '#8b5cf6', emoji: '👥' },
};

// ── Role-specific AI recs ────────────────────────────────────────────────────
const AI_RECS: Record<string, { icon: string; text: string; priority: string }[]> = {
  admin: [
    { icon: '🔴', text: 'Remove Dumper 203 from service — 83% failure probability. Bearing replacement required.', priority: 'critical' },
    { icon: '⚠️', text: 'Schedule dust suppression in Rajrappa Sector-4 — air quality at 112% of safe limit.', priority: 'high' },
    { icon: '⚠️', text: '14 employee safety certifications expire within 30 days. Initiate renewal process.', priority: 'high' },
    { icon: '🟡', text: 'Kuju mine needs DR-2 drill rig maintenance to prevent Q3 production shortfall.', priority: 'medium' },
    { icon: '✅', text: 'Piparwar at 100.5% efficiency — evaluate capacity expansion for FY2026.', priority: 'low' },
  ],
  mine_manager: [
    { icon: '🔴', text: 'Rajrappa is 4.2% below daily target. Mobilise Shovel-4 to Sector-3 to recover tonnage.', priority: 'critical' },
    { icon: '⚠️', text: 'Dumper 203 flagged for bearing failure (83% probability) — schedule replacement today.', priority: 'high' },
    { icon: '🟡', text: 'Argada efficiency dropped to 81% — check blast pattern adherence for Sector-2.', priority: 'medium' },
    { icon: '✅', text: 'Piparwar on 100.5% efficiency — consider bonus incentive for shift crew.', priority: 'low' },
  ],
  safety_officer: [
    { icon: '🔴', text: 'Vijay Kumar Singh (EMP-005) has 4 safety violations and 2 expired certifications. Restrict access.', priority: 'critical' },
    { icon: '⚠️', text: 'Air quality in Rajrappa Sector-4 at 112% of permissible limit. Issue PPE advisory.', priority: 'high' },
    { icon: '⚠️', text: '3 employees have overdue safety training — Argada mine operations at risk.', priority: 'high' },
    { icon: '🟡', text: 'Suresh Pandey\'s Electrical Safety cert expired Dec 2024. Schedule renewal.', priority: 'medium' },
    { icon: '✅', text: 'Priya Sharma maintains perfect safety score (99/100) — nominate for Safety Excellence Award.', priority: 'low' },
  ],
  maintenance_engineer: [
    { icon: '🔴', text: 'Dumper 203: bearing failure probability 83%. Take offline for immediate inspection.', priority: 'critical' },
    { icon: '⚠️', text: 'Excavator EX-101 at 67% health — hydraulic system service overdue by 12 days.', priority: 'high' },
    { icon: '🟡', text: 'Conveyor CV-301 vibration sensors showing early wear pattern. Schedule inspection.', priority: 'medium' },
    { icon: '🟡', text: 'DR-2 drill rig Kuju: 2 scheduled maintenance items due next week. Prepare parts.', priority: 'medium' },
    { icon: '✅', text: 'Pumping Station PS-001 performing optimally — no action required.', priority: 'low' },
  ],
  hr: [
    { icon: '⚠️', text: '184 employees have training due — risk of compliance violation. Prioritise Argada mine.', priority: 'high' },
    { icon: '⚠️', text: 'Vijay Kumar Singh attendance at 88.1% — below policy threshold of 90%. Issue warning.', priority: 'high' },
    { icon: '🟡', text: 'Leave balance for 3 employees critically low (< 6 days). Plan replacements.', priority: 'medium' },
    { icon: '🟡', text: '3 employees have rating below 3.5 — schedule performance improvement plans.', priority: 'medium' },
    { icon: '✅', text: 'Priya Sharma (Safety Officer) eligible for performance increment — rating 4.9.', priority: 'low' },
  ],
};

const priorityBar: Record<string, string> = {
  critical: 'var(--red)', high: 'var(--amber)', medium: 'var(--cyan)', low: 'var(--green)',
};

// ── Safety trend data for safety officer ────────────────────────────────────
const safetyTrend = [
  { month: 'Feb', incidents: 12, violations: 18 },
  { month: 'Mar', incidents: 9,  violations: 14 },
  { month: 'Apr', incidents: 11, violations: 16 },
  { month: 'May', incidents: 7,  violations: 11 },
  { month: 'Jun', incidents: 8,  violations: 10 },
  { month: 'Jul', incidents: 5,  violations: 7  },
];



// ── Attendance trend for HR ──────────────────────────────────────────────────
const attendanceTrend = [
  { day: 'Mon', present: 4180, absent: 640 },
  { day: 'Tue', present: 4230, absent: 590 },
  { day: 'Wed', present: 4150, absent: 670 },
  { day: 'Thu', present: 4290, absent: 530 },
  { day: 'Fri', present: 4210, absent: 610 },
];

// ── SECTION components ───────────────────────────────────────────────────────

function SectionAIRecs({ role }: { role: string }) {
  const recs = AI_RECS[role] ?? AI_RECS.admin;
  return (
    <div className="glass-card p-5 slide-in-up">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#1e40af,#6366f1,#7c3aed)', boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }}>
          <Zap size={15} style={{ color: '#fff' }} />
        </div>
        <div>
          <h2 className="font-semibold text-[13.5px]" style={{ color: 'var(--text-primary)' }}>AI Recommendations</h2>
          <p className="text-[10.5px]" style={{ color: 'var(--text-muted)' }}>Gemini · role-filtered for you</p>
        </div>
      </div>
      <div className="space-y-2">
        {recs.map((r, i) => (
          <div key={i}
            className="flex items-start gap-3 p-3 rounded-xl text-[12.5px] transition-all hover:scale-[1.01] slide-in-up"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border)',
              borderLeft: `3px solid ${priorityBar[r.priority]}`,
              animationDelay: `${i * 0.05 + 0.3}s`,
            }}>
            <span className="flex-shrink-0 text-base">{r.icon}</span>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.55 }}>{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionAlerts({ notifications }: { notifications: any[] }) {
  const criticalAlerts = notifications.filter(n => n.priority === 'critical' || n.priority === 'high').slice(0, 4);
  return (
    <div className="glass-card p-5 slide-in-up">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} style={{ color: 'var(--amber)' }} />
          <h2 className="font-semibold text-[13.5px]" style={{ color: 'var(--text-primary)' }}>Recent Alerts</h2>
        </div>
        <Link href="/notifications" className="text-[10.5px] font-semibold hover:opacity-70" style={{ color: 'var(--blue-light)' }}>
          View all →
        </Link>
      </div>
      <div className="space-y-1.5">
        {criticalAlerts.map((n, i) => (
          <div key={n.id}
            className="flex items-start gap-2.5 text-[12px] p-2.5 rounded-xl transition-all hover:bg-white/5 slide-in-up"
            style={{ animationDelay: `${i * 0.06}s` }}>
            <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${n.priority === 'critical' ? 'pulse-red' : 'pulse-amber'}`}
              style={{ background: n.priority === 'critical' ? 'var(--red)' : 'var(--amber)' }} />
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{n.title.replace(/[🔴⚠️🟡]/g, '').trim()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionMaintenance({ equipment }: { equipment: any[] }) {
  const upcoming = [...equipment]
    .sort((a, b) => new Date(a.nextMaintenance).getTime() - new Date(b.nextMaintenance).getTime())
    .slice(0, 5);
  return (
    <div className="glass-card p-5 slide-in-up">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock size={14} style={{ color: 'var(--blue-light)' }} />
          <h2 className="font-semibold text-[13.5px]" style={{ color: 'var(--text-primary)' }}>Upcoming Maintenance</h2>
        </div>
        <Link href="/equipment" className="text-[10.5px] font-semibold hover:opacity-70" style={{ color: 'var(--blue-light)' }}>
          View all →
        </Link>
      </div>
      <div className="space-y-1.5">
        {upcoming.map((e, i) => {
          const days = Math.ceil((new Date(e.nextMaintenance).getTime() - Date.now()) / 86400000);
          return (
            <div key={e.id}
              className="flex items-center justify-between text-[12px] p-2.5 rounded-xl hover:bg-white/5 slide-in-up"
              style={{ animationDelay: `${i * 0.06}s` }}>
              <div>
                <p className="font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>{e.name}</p>
                <p className="text-[10.5px]" style={{ color: 'var(--text-muted)' }}>{e.mineName}</p>
              </div>
              <span className="badge" style={{
                background: days <= 0 ? 'rgba(239,68,68,0.15)' : days <= 7 ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.12)',
                color: days <= 0 ? 'var(--red-light)' : days <= 7 ? 'var(--amber-light)' : 'var(--green-light)',
              }}>
                {days <= 0 ? 'Overdue' : days === 1 ? 'Tomorrow' : `${days}d`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  ROLE VIEWS
// ══════════════════════════════════════════════════════════════════════════════

function AdminView({ liveProduction, mines, equipment, equipmentSummary, employees, employeeSummary, notifications, totalTargetToday }: {
  liveProduction: number; mines: any[]; equipment: any[]; equipmentSummary: any;
  employees: any[]; employeeSummary: any; notifications: any[]; totalTargetToday: number;
}) {
  const efficiency = Math.round((liveProduction / totalTargetToday) * 100);
  const pieData = [
    { name: 'Operational', value: equipmentSummary?.operational ?? 0 },
    { name: 'Maintenance', value: equipmentSummary?.maintenance ?? 0 },
    { name: 'Breakdown',   value: equipmentSummary?.breakdown ?? 0 },
    { name: 'Idle',        value: equipmentSummary?.idle ?? 0 },
  ];
  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
        <KPICard index={0} title="Production Today" live value={(liveProduction/1000).toFixed(1)} unit="K MT"
          change={-4.2} changeLabel="vs target" icon={<Pickaxe size={17}/>} color="blue"
          subtitle={`Target: ${(totalTargetToday/1000).toFixed(0)}K MT`} />
        <KPICard index={1} title="Equipment Health" value={equipmentSummary.avgHealth} unit="%"
          change={-3.1} changeLabel="vs last week" icon={<Cpu size={17}/>}
          color={equipmentSummary.avgHealth >= 75 ? 'green' : 'amber'}
          subtitle={`${equipmentSummary.operational}/${equipmentSummary.total} operational`} />
        <KPICard index={2} title="Active Workers" value={employeeSummary.present.toLocaleString('en-IN')}
          change={2.1} changeLabel="vs yesterday" icon={<Users size={17}/>} color="green"
          subtitle={`of ${employeeSummary.total.toLocaleString('en-IN')} total`} />
        <KPICard index={3} title="Safety Incidents" value={5} unit="this month"
          change={-37.5} changeLabel="vs last month" icon={<ShieldAlert size={17}/>} color="amber"
          subtitle="8 last month — improving" />
        <KPICard index={4} title="Pending Approvals" value={12} icon={<ClipboardCheck size={17}/>} color="purple"
          subtitle="3 marked urgent" />
      </div>

      {/* Efficiency bar */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Activity size={14} style={{ color: 'var(--blue-light)' }} />
            <span className="text-[12px] font-semibold" style={{ color: 'var(--text-secondary)' }}>Overall Fleet Efficiency Today</span>
          </div>
          <span className="text-[13px] font-bold" style={{ color: efficiency >= 90 ? 'var(--green)' : efficiency >= 75 ? 'var(--amber)' : 'var(--red)' }}>
            {efficiency}%
          </span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{
            width: `${efficiency}%`,
            background: efficiency >= 90 ? 'linear-gradient(90deg,#10b981,#34d399)' : efficiency >= 75 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#ef4444,#f87171)',
          }} />
        </div>
        <div className="flex justify-between mt-1.5 text-[10px]" style={{ color: 'var(--text-dim)' }}>
          <span>0%</span><span>Target: 92%</span><span>100%</span>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card p-5">
          <h2 className="font-semibold text-[14px] mb-1" style={{ color: 'var(--text-primary)' }}>Monthly Production Trend</h2>
          <p className="text-[11px] mb-4" style={{ color: 'var(--text-muted)' }}>All mines combined · last 30 days (MT)</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyTrend} margin={{ left: -10, right: 8 }}>
              <defs>
                <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                <linearGradient id="gT" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill:'#445577', fontSize:10 }} tickLine={false} axisLine={false} tickFormatter={v=>v.slice(5)} interval={4}/>
              <YAxis tick={{ fill:'#445577', fontSize:10 }} tickLine={false} axisLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}K`} width={36}/>
              <Tooltip content={<TT/>}/>
              <Area type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={1.5} fill="url(#gT)" name="Target" strokeDasharray="5 3" dot={false}/>
              <Area type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gA)" name="Actual" dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card p-5">
          <h2 className="font-semibold text-[14px] mb-0.5" style={{ color: 'var(--text-primary)' }}>Equipment Status</h2>
          <p className="text-[11px] mb-4" style={{ color: 'var(--text-muted)' }}>{equipmentSummary.total} machines across all mines</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={68} dataKey="value" stroke="none" paddingAngle={2}>
              {pieData.map((_,i) => <Cell key={i} fill={PIE_COLORS[i]}/>)}
            </Pie><Tooltip content={<TT/>}/></PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-2">
            {pieData.map((p,i) => (
              <div key={p.name} className="flex items-center gap-1.5 text-[11px]">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }}/>
                <span style={{ color: 'var(--text-muted)' }}>{p.name}</span>
                <span className="font-bold ml-auto" style={{ color: 'var(--text-primary)' }}>{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mine chart + bottom row */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div><h2 className="font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>Mine-wise Production</h2><p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Actual vs Target (MT)</p></div>
          <Link href="/analytics" className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: 'var(--blue-light)' }}>Full Analytics <ArrowUpRight size={11}/></Link>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={mines} margin={{ left:-10, right:8 }} barCategoryGap="30%">
            <XAxis dataKey="name" tick={{ fill:'#445577', fontSize:11 }} tickLine={false} axisLine={false}/>
            <YAxis tick={{ fill:'#445577', fontSize:10 }} tickLine={false} axisLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}K`} width={36}/>
            <Tooltip content={<TT/>}/>
            <Bar dataKey="monthTarget" name="Target" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" strokeWidth={1} radius={[4,4,0,0]}/>
            <Bar dataKey="monthActual" name="Actual" radius={[4,4,0,0]}>
              {mines.map((m,i) => <Cell key={i} fill={m.monthActual >= m.monthTarget ? '#10b981' : '#3b82f6'}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionAIRecs role="admin"/>
        <div className="space-y-4">
          <SectionAlerts notifications={notifications}/>
          <SectionMaintenance equipment={equipment}/>
        </div>
      </div>
    </div>
  );
}

// ─── Mine Manager ────────────────────────────────────────────────────────────
function MineManagerView({ liveProduction, mines, equipment, equipmentSummary, employees, employeeSummary, notifications, totalTargetToday }: {
  liveProduction: number; mines: any[]; equipment: any[]; equipmentSummary: any;
  employees: any[]; employeeSummary: any; notifications: any[]; totalTargetToday: number;
}) {
  const efficiency = Math.round((liveProduction / totalTargetToday) * 100);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KPICard index={0} title="Production Today" live value={(liveProduction/1000).toFixed(1)} unit="K MT"
          change={-4.2} changeLabel="vs target" icon={<Pickaxe size={17}/>} color="blue"
          subtitle={`Target: ${(totalTargetToday/1000).toFixed(0)}K MT`}/>
        <KPICard index={1} title="Fleet Efficiency" value={efficiency} unit="%"
          icon={<Activity size={17}/>} color={efficiency>=90?'green':efficiency>=75?'amber':'red'}
          subtitle="All mines combined"/>
        <KPICard index={2} title="Equipment Operational" value={`${equipmentSummary.operational}/${equipmentSummary.total}`}
          icon={<Cpu size={17}/>} color="amber"
          subtitle={`${equipmentSummary.breakdown} breakdowns`}/>
        <KPICard index={3} title="Workforce Active" value={employeeSummary.present.toLocaleString('en-IN')}
          icon={<Users size={17}/>} color="green" subtitle={`${employeeSummary.absent} absent today`}/>
      </div>

      {/* Efficiency bar */}
      <div className="glass-card p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[12px] font-semibold flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
            <Activity size={14} style={{ color: 'var(--blue-light)' }}/> Overall Fleet Efficiency Today
          </span>
          <span className="font-bold text-[13px]" style={{ color: efficiency>=90?'var(--green)':efficiency>=75?'var(--amber)':'var(--red)' }}>{efficiency}%</span>
        </div>
        <div className="progress-track"><div className="progress-fill" style={{ width:`${efficiency}%`, background:'linear-gradient(90deg,#3b82f6,#06b6d4)' }}/></div>
        <div className="flex justify-between mt-1.5 text-[10px]" style={{ color: 'var(--text-dim)' }}><span>0%</span><span>Target 92%</span><span>100%</span></div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h2 className="font-semibold text-[14px] mb-1" style={{ color: 'var(--text-primary)' }}>Mine-wise Production · This Month</h2>
          <p className="text-[11px] mb-4" style={{ color: 'var(--text-muted)' }}>Actual vs Target (MT)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mines} barCategoryGap="30%" margin={{ left:-10,right:8 }}>
              <XAxis dataKey="name" tick={{ fill:'#445577', fontSize:10 }} tickLine={false} axisLine={false}/>
              <YAxis tick={{ fill:'#445577', fontSize:10 }} tickLine={false} axisLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}K`} width={36}/>
              <Tooltip content={<TT/>}/>
              <Bar dataKey="monthTarget" name="Target" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" strokeWidth={1} radius={[4,4,0,0]}/>
              <Bar dataKey="monthActual" name="Actual" radius={[4,4,0,0]}>
                {mines.map((m,i) => <Cell key={i} fill={m.monthActual>=m.monthTarget?'#10b981':'#3b82f6'}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card p-5">
          <h2 className="font-semibold text-[14px] mb-1" style={{ color: 'var(--text-primary)' }}>Production Trend · 30 Days</h2>
          <p className="text-[11px] mb-4" style={{ color: 'var(--text-muted)' }}>Daily actual vs target (MT)</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyTrend} margin={{ left:-10,right:8 }}>
              <defs>
                <linearGradient id="mm1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill:'#445577', fontSize:10 }} tickLine={false} axisLine={false} tickFormatter={v=>v.slice(5)} interval={5}/>
              <YAxis tick={{ fill:'#445577', fontSize:10 }} tickLine={false} axisLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}K`} width={36}/>
              <Tooltip content={<TT/>}/>
              <Area type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} fill="url(#mm1)" name="Actual" dot={false}/>
              <Area type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={1.5} fill="none" name="Target" strokeDasharray="4 3" dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionAIRecs role="mine_manager"/>
        <div className="space-y-4"><SectionAlerts notifications={notifications}/><SectionMaintenance equipment={equipment}/></div>
      </div>
    </div>
  );
}

// ─── Safety Officer ──────────────────────────────────────────────────────────
function SafetyOfficerView({ employees, employeeSummary }: { employees: any[]; employeeSummary: any }) {
  const overdueTraining = employees.filter(e => e.trainingStatus !== 'current');
  const highRisk        = employees.filter(e => e.safetyViolations > 0);
  const expiredCerts    = employees.flatMap(e => e.certifications?.filter((c: any) => c.status === 'expired') ?? []);

  return (
    <div className="space-y-5">
      {/* Safety KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KPICard index={0} title="Incidents This Month" value={5}
          change={-37.5} changeLabel="vs last month"
          icon={<ShieldAlert size={17}/>} color="amber" subtitle="8 last month — improving"/>
        <KPICard index={1} title="Safety Violations" value={employeeSummary.safetyViolationsThisMonth}
          icon={<AlertTriangle size={17}/>} color="red" subtitle="July 2025"/>
        <KPICard index={2} title="Training Overdue" value={overdueTraining.length}
          icon={<GraduationCap size={17}/>} color="red" subtitle="Immediate action needed"/>
        <KPICard index={3} title="Expired Certificates" value={expiredCerts.length}
          icon={<XCircle size={17}/>} color="amber" subtitle="Across all mines"/>
      </div>

      {/* Incident trend + High-risk employees */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h2 className="font-semibold text-[14px] mb-1" style={{ color: 'var(--text-primary)' }}>Safety Trend · 6 Months</h2>
          <p className="text-[11px] mb-4" style={{ color: 'var(--text-muted)' }}>Incidents & violations per month</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={safetyTrend} margin={{ left:-10,right:8 }}>
              <XAxis dataKey="month" tick={{ fill:'#445577', fontSize:10 }} tickLine={false} axisLine={false}/>
              <YAxis tick={{ fill:'#445577', fontSize:10 }} tickLine={false} axisLine={false} width={28}/>
              <Tooltip content={<TT/>}/>
              <Line type="monotone" dataKey="incidents" stroke="#ef4444" strokeWidth={2.5} dot={{ r:4, fill:'#ef4444' }} name="Incidents"/>
              <Line type="monotone" dataKey="violations" stroke="#f59e0b" strokeWidth={2} dot={{ r:3, fill:'#f59e0b' }} name="Violations"/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>⚠️ High-Risk Employees</h2>
            <Link href="/employees" className="text-[10.5px] font-semibold" style={{ color: 'var(--blue-light)' }}>View all →</Link>
          </div>
          <div className="space-y-2">
            {highRisk.map((e,i) => (
              <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl slide-in-up"
                style={{ background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.15)', animationDelay:`${i*0.08}s` }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background:'linear-gradient(135deg,#7c2d12,#b45309)', color:'#fff' }}>
                  {e.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] font-semibold truncate" style={{ color:'var(--text-primary)' }}>{e.name}</p>
                  <p className="text-[10.5px]" style={{ color:'var(--text-muted)' }}>{e.designation} · {e.mineName}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[11px] font-bold" style={{ color:'var(--red-light)' }}>{e.safetyViolations} violations</p>
                  <p className="text-[10px]" style={{ color:'var(--text-muted)' }}>Score: {e.safetyScore}/100</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Training compliance table */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>Training Compliance Status</h2>
          <Link href="/employees" className="text-[10.5px] font-semibold" style={{ color: 'var(--blue-light)' }}>Manage →</Link>
        </div>
        <div className="space-y-2">
          {employees.filter(e => e.trainingStatus !== 'current').map((e,i) => (
            <div key={e.id} className="flex items-center justify-between p-3 rounded-xl slide-in-up"
              style={{ background:'rgba(255,255,255,0.02)', border:'1px solid var(--border)', animationDelay:`${i*0.06}s` }}>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                  style={{ background:'linear-gradient(135deg,#7c2d12,#b45309)', color:'#fff' }}>
                  {e.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                </div>
                <div>
                  <p className="text-[12px] font-semibold" style={{ color:'var(--text-primary)' }}>{e.name}</p>
                  <p className="text-[10px]" style={{ color:'var(--text-muted)' }}>{e.department} · {e.mineName}</p>
                </div>
              </div>
              <Badge variant={e.trainingStatus === 'overdue' ? 'danger' : 'warning'} size="sm" dot pulse>
                {e.trainingStatus === 'overdue' ? 'Overdue' : 'Due'}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <SectionAIRecs role="safety_officer"/>
    </div>
  );
}

// ─── Maintenance Engineer ────────────────────────────────────────────────────
function MaintenanceView({ equipment, equipmentSummary, notifications }: { equipment: any[]; equipmentSummary: any; notifications: any[] }) {
  const critical = equipment.filter(e => e.status === 'breakdown' || e.healthScore < 60);
  const upcoming = [...equipment].sort((a,b) => new Date(a.nextMaintenance).getTime()-new Date(b.nextMaintenance).getTime()).slice(0,6);
  const equipmentHealthData = equipment.slice(0, 6).map(e => ({
    name: e.name.replace(/^(Dumper|Shovel|Drill|Conveyor|Pump|Excavator)\s/i, '').slice(0, 8),
    health: e.healthScore,
    fill: e.healthScore >= 80 ? '#10b981' : e.healthScore >= 60 ? '#f59e0b' : '#ef4444',
  }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KPICard index={0} title="Operational" value={equipmentSummary.operational}
          icon={<CheckCircle2 size={17}/>} color="green"
          subtitle={`of ${equipmentSummary.total} total`}/>
        <KPICard index={1} title="In Maintenance" value={equipmentSummary.maintenance}
          icon={<Wrench size={17}/>} color="amber" subtitle="Scheduled"/>
        <KPICard index={2} title="Breakdowns" value={equipmentSummary.breakdown}
          icon={<AlertTriangle size={17}/>} color="red" subtitle="Need immediate attention"
          change={-20} changeLabel="vs last week"/>
        <KPICard index={3} title="Avg Fleet Health" value={`${equipmentSummary.avgHealth}%`}
          icon={<HeartPulse size={17}/>} color={equipmentSummary.avgHealth>=75?'green':'amber'}
          subtitle="Across all equipment"/>
      </div>

      {/* Health chart + Critical list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h2 className="font-semibold text-[14px] mb-1" style={{ color: 'var(--text-primary)' }}>Equipment Health Scores</h2>
          <p className="text-[11px] mb-4" style={{ color: 'var(--text-muted)' }}>Top 6 machines by health score</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={equipmentHealthData} layout="vertical" margin={{ left:8, right:16 }}>
              <XAxis type="number" domain={[0,100]} tick={{ fill:'#445577', fontSize:10 }} tickLine={false} axisLine={false} tickFormatter={v=>`${v}%`}/>
              <YAxis type="category" dataKey="name" tick={{ fill:'#8899bb', fontSize:10 }} tickLine={false} axisLine={false} width={52}/>
              <Tooltip content={<TT/>}/>
              <Bar dataKey="health" name="Health" radius={[0,4,4,0]}>
                {equipmentHealthData.map((e,i) => <Cell key={i} fill={e.fill}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>🔴 Critical Equipment</h2>
            <Link href="/equipment" className="text-[10.5px] font-semibold" style={{ color: 'var(--blue-light)' }}>View all →</Link>
          </div>
          {critical.length === 0 ? (
            <p className="text-sm" style={{ color:'var(--text-muted)' }}>No critical equipment 🎉</p>
          ) : (
            <div className="space-y-2">
              {critical.map((e,i) => (
                <div key={e.id} className="p-3 rounded-xl slide-in-up"
                  style={{ background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.2)', animationDelay:`${i*0.08}s` }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[12.5px] font-semibold" style={{ color:'var(--text-primary)' }}>{e.name}</p>
                      <p className="text-[10.5px]" style={{ color:'var(--text-muted)' }}>{e.mineName} · {e.type}</p>
                    </div>
                    <Badge variant={e.status==='breakdown'?'danger':'warning'} size="sm" dot pulse>
                      {e.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full" style={{ width:`${e.healthScore}%`, background:'var(--red)' }}/>
                    </div>
                    <span className="text-[10px] font-bold" style={{ color:'var(--red-light)' }}>{e.healthScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Maintenance schedule */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>Upcoming Maintenance Schedule</h2>
          <Link href="/equipment" className="text-[10.5px] font-semibold" style={{ color: 'var(--blue-light)' }}>Full Schedule →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {upcoming.map((e,i) => {
            const days = Math.ceil((new Date(e.nextMaintenance).getTime()-Date.now())/86400000);
            return (
              <div key={e.id} className="flex items-center justify-between p-3 rounded-xl slide-in-up"
                style={{ background:'rgba(255,255,255,0.02)', border:'1px solid var(--border)', animationDelay:`${i*0.05}s` }}>
                <div>
                  <p className="text-[12px] font-semibold" style={{ color:'var(--text-primary)' }}>{e.name}</p>
                  <p className="text-[10px]" style={{ color:'var(--text-muted)' }}>{e.mineName}</p>
                </div>
                <span className="badge" style={{
                  background: days<=0?'rgba(239,68,68,0.15)':days<=7?'rgba(245,158,11,0.15)':'rgba(16,185,129,0.12)',
                  color: days<=0?'var(--red-light)':days<=7?'var(--amber-light)':'var(--green-light)',
                }}>
                  {days<=0?'Overdue':days===1?'Tomorrow':`${days}d`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <SectionAIRecs role="maintenance_engineer"/>
    </div>
  );
}

// ─── HR Officer ──────────────────────────────────────────────────────────────
function HRView({ employees, employeeSummary }: { employees: any[]; employeeSummary: any }) {
  const training_issues = employees.filter(e => e.trainingStatus !== 'current');
  const low_performers  = employees.filter(e => e.performanceRating < 4.0);
  const low_attendance  = employees.filter(e => e.attendancePercent < 90);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KPICard index={0} title="Present Today" value={employeeSummary.present.toLocaleString('en-IN')}
          change={2.1} changeLabel="vs yesterday"
          icon={<UserCheck size={17}/>} color="green"
          subtitle={`of ${employeeSummary.total.toLocaleString('en-IN')} total`}/>
        <KPICard index={1} title="On Leave" value={employeeSummary.onLeave}
          icon={<CalendarDays size={17}/>} color="amber" subtitle="Approved leave"/>
        <KPICard index={2} title="Training Due" value={employeeSummary.trainingDue}
          icon={<GraduationCap size={17}/>} color="red" subtitle="Need renewal"/>
        <KPICard index={3} title="Avg Attendance" value={`${employeeSummary.avgAttendance}%`}
          icon={<BarChart3 size={17}/>} color="blue" subtitle="All mines · July 2025"/>
      </div>

      {/* Attendance trend + Training status pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h2 className="font-semibold text-[14px] mb-1" style={{ color: 'var(--text-primary)' }}>Attendance Trend · This Week</h2>
          <p className="text-[11px] mb-4" style={{ color: 'var(--text-muted)' }}>Present vs Absent headcount</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={attendanceTrend} barCategoryGap="30%" margin={{ left:-10,right:8 }}>
              <XAxis dataKey="day" tick={{ fill:'#445577', fontSize:11 }} tickLine={false} axisLine={false}/>
              <YAxis tick={{ fill:'#445577', fontSize:10 }} tickLine={false} axisLine={false} tickFormatter={v=>`${(v/1000).toFixed(1)}K`} width={36}/>
              <Tooltip content={<TT/>}/>
              <Bar dataKey="present" name="Present" fill="#10b981" radius={[4,4,0,0]}/>
              <Bar dataKey="absent"  name="Absent"  fill="#ef4444" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h2 className="font-semibold text-[14px] mb-1" style={{ color: 'var(--text-primary)' }}>Training Status Breakdown</h2>
          <p className="text-[11px] mb-3" style={{ color: 'var(--text-muted)' }}>All listed employees</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={[
                { name:'Current',  value: employees.filter(e=>e.trainingStatus==='current').length },
                { name:'Due',      value: employees.filter(e=>e.trainingStatus==='due').length },
                { name:'Overdue',  value: employees.filter(e=>e.trainingStatus==='overdue').length },
              ]} cx="50%" cy="50%" innerRadius={38} outerRadius={60} dataKey="value" stroke="none" paddingAngle={3}>
                <Cell fill="#10b981"/><Cell fill="#f59e0b"/><Cell fill="#ef4444"/>
              </Pie>
              <Tooltip content={<TT/>}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-around mt-2 text-[11px]">
            {[{ label:'Current',c:'#10b981'},{ label:'Due',c:'#f59e0b'},{ label:'Overdue',c:'#ef4444'}].map(s=>(
              <div key={s.label} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background:s.c }}/>
                <span style={{ color:'var(--text-muted)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Employees needing attention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>Low Attendance Alert</h2>
            <Link href="/employees" className="text-[10.5px] font-semibold" style={{ color: 'var(--blue-light)' }}>Manage →</Link>
          </div>
          {low_attendance.length === 0 ? (
            <p className="text-sm" style={{ color:'var(--text-muted)' }}>All employees above 90% threshold ✅</p>
          ) : (
            <div className="space-y-2">
              {low_attendance.map((e,i) => (
                <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl slide-in-up"
                  style={{ background:'rgba(245,158,11,0.06)', border:'1px solid rgba(245,158,11,0.18)', animationDelay:`${i*0.07}s` }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background:'linear-gradient(135deg,#581c87,#7c3aed)', color:'#fff' }}>
                    {e.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] font-semibold" style={{ color:'var(--text-primary)' }}>{e.name}</p>
                    <p className="text-[10.5px]" style={{ color:'var(--text-muted)' }}>{e.designation}</p>
                  </div>
                  <span className="text-[12px] font-bold" style={{ color:'var(--amber-light)' }}>{e.attendancePercent}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>Performance Review Needed</h2>
          </div>
          <div className="space-y-2">
            {low_performers.map((e,i) => (
              <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl slide-in-up"
                style={{ background:'rgba(255,255,255,0.02)', border:'1px solid var(--border)', animationDelay:`${i*0.07}s` }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background:'linear-gradient(135deg,#1e3a8a,#1e40af)', color:'#fff' }}>
                  {e.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                </div>
                <div className="flex-1">
                  <p className="text-[12px] font-semibold" style={{ color:'var(--text-primary)' }}>{e.name}</p>
                  <p className="text-[10.5px]" style={{ color:'var(--text-muted)' }}>{e.department}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({length:5}).map((_,j)=>(
                    <div key={j} className="w-2.5 h-2.5 rounded-sm"
                      style={{ background: j < Math.floor(e.performanceRating) ? '#f59e0b' : 'rgba(255,255,255,0.08)' }}/>
                  ))}
                  <span className="ml-1.5 text-[11px] font-bold" style={{ color:'var(--text-secondary)' }}>{e.performanceRating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SectionAIRecs role="hr"/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function DashboardPage() {
  const { user } = useAuth();
  const role = user?.role ?? 'admin';
  const meta = ROLE_META[role] ?? ROLE_META.admin;

  // Live data from Render API (falls back to mock if backend sleeping)
  const { data: minesData } = useMines();
  const { data: equipData } = useEquipment();
  const { data: empData } = useEmployees();
  const { data: empSummaryData } = useEmployeeSummary();
  const { data: notifData } = useNotifications();

  const mines = minesData.mines;
  const totalProductionToday = minesData.summary.totalProductionToday;
  const totalTargetToday = minesData.summary.totalTargetToday;
  const equipment = equipData.equipment;
  const equipmentSummary = equipData.summary;
  const employees = empData.employees;
  const employeeSummary = empSummaryData;
  const notifications = notifData.notifications;

  const [liveProduction, setLiveProduction] = useState(totalProductionToday);

  useEffect(() => {
    setLiveProduction(totalProductionToday);
  }, [totalProductionToday]);

  useEffect(() => {
    const t = setInterval(() => {
      setLiveProduction(p => p + Math.floor(Math.random() * 8 + 2));
    }, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-5">
      {/* Role-aware page header */}
      <div className="flex items-start justify-between slide-in-up">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xl">{meta.emoji}</span>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{meta.title}</h1>
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest"
              style={{ background:`${meta.color}22`, color: meta.color, border:`1px solid ${meta.color}44` }}>
              {user?.roleLabel}
            </span>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{meta.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold"
            style={{ background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', color:'var(--green)' }}>
            <div className="w-1.5 h-1.5 rounded-full pulse-green" style={{ background:'var(--green)' }}/>
            7 Mines Live
          </div>
          {role !== 'hr' && (
            <Link href="/copilot"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all hover:scale-105"
              style={{ background:'linear-gradient(135deg,#1e40af,#6366f1)', color:'#fff', boxShadow:'0 3px 12px rgba(99,102,241,0.35)' }}>
              <Zap size={12}/> Ask AI
            </Link>
          )}
        </div>
      </div>

      {/* Role-specific view — pass live data as props */}
      {role === 'admin'                && <AdminView liveProduction={liveProduction} mines={mines} equipment={equipment} equipmentSummary={equipmentSummary} employees={employees} employeeSummary={employeeSummary} notifications={notifications} totalTargetToday={totalTargetToday}/>}
      {role === 'mine_manager'         && <MineManagerView liveProduction={liveProduction} mines={mines} equipment={equipment} equipmentSummary={equipmentSummary} employees={employees} employeeSummary={employeeSummary} notifications={notifications} totalTargetToday={totalTargetToday}/>}
      {role === 'safety_officer'       && <SafetyOfficerView employees={employees} employeeSummary={employeeSummary}/>}
      {role === 'maintenance_engineer' && <MaintenanceView equipment={equipment} equipmentSummary={equipmentSummary} notifications={notifications}/>}
      {role === 'hr'                   && <HRView employees={employees} employeeSummary={employeeSummary}/>}
    </div>
  );
}
