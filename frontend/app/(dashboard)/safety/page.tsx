'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { Shield, AlertTriangle, Users, FileCheck, CheckCircle2, XCircle } from 'lucide-react';
import { safetyTrend } from '@/lib/mock/analytics';
import Badge from '@/components/ui/Badge';
import KPICard from '@/components/ui/KPICard';

const incidents = [
  { id: 'INC-001', date: '2025-07-05', mine: 'Rajrappa', type: 'Minor Injury', description: 'Worker slipped near conveyor — sprained wrist', severity: 'low', status: 'Closed' },
  { id: 'INC-002', date: '2025-07-01', mine: 'Argada', type: 'Equipment Damage', description: 'Conveyor C-7 belt failure — production stopped', severity: 'high', status: 'Open' },
  { id: 'INC-003', date: '2025-06-28', mine: 'Kuju', type: 'Near Miss', description: 'Unauthorized entry in blasting zone — no injury', severity: 'medium', status: 'Under Review' },
  { id: 'INC-004', date: '2025-06-22', mine: 'Piparwar', type: 'PPE Violation', description: '3 workers found without helmets in Zone-2', severity: 'low', status: 'Closed' },
  { id: 'INC-005', date: '2025-06-14', mine: 'Rajrappa', type: 'Minor Injury', description: 'Ankle sprain near conveyor belt — first aid given', severity: 'low', status: 'Closed' },
];

const trainingCompliance = [
  { dept: 'Operations', required: 420, completed: 398, pending: 22 },
  { dept: 'Mechanical', required: 180, completed: 142, pending: 38 },
  { dept: 'Electrical', required: 96, completed: 91, pending: 5 },
  { dept: 'Safety', required: 48, completed: 48, pending: 0 },
  { dept: 'Survey', required: 36, completed: 30, pending: 6 },
  { dept: 'HR', required: 24, completed: 22, pending: 2 },
];

export default function SafetyPage() {
  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Safety Management</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
          Safety incidents, compliance, and training tracker
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Safety Score" value="87.3%" color="green" change={2.1} changeLabel="vs last month"
          icon={<Shield size={18} />} />
        <KPICard title="Incidents MTD" value={5} color="amber" change={-37.5} changeLabel="vs last month"
          icon={<AlertTriangle size={18} />} />
        <KPICard title="PPE Violations" value={12} color="amber" change={-57} changeLabel="vs 6 months ago"
          icon={<Users size={18} />} />
        <KPICard title="Training Compliance" value="91.4%" color="blue"
          icon={<FileCheck size={18} />} subtitle="731/800 certified" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Safety Trend Chart */}
        <div className="glass-card p-5">
          <h2 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Safety Trends (Last 7 Months)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={safetyTrend.labels.map((l, i) => ({
              month: l,
              incidents: safetyTrend.incidents[i],
              violations: safetyTrend.violationsPPE[i],
              nearMisses: safetyTrend.nearMisses[i],
            }))}>
              <CartesianGrid strokeOpacity={0.06} />
              <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(13,26,53,0.95)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="incidents" stroke="#ef4444" strokeWidth={2} name="Incidents" dot={{ r: 4, fill: '#ef4444' }} />
              <Line type="monotone" dataKey="violations" stroke="#f59e0b" strokeWidth={2} name="PPE Violations" dot={{ r: 4, fill: '#f59e0b' }} />
              <Line type="monotone" dataKey="nearMisses" stroke="#3b82f6" strokeWidth={2} name="Near Misses" dot={{ r: 4, fill: '#3b82f6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Training Compliance */}
        <div className="glass-card p-5">
          <h2 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Training Compliance by Department</h2>
          <div className="space-y-3">
            {trainingCompliance.map(t => {
              const pct = Math.round((t.completed / t.required) * 100);
              return (
                <div key={t.dept}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{t.dept}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{t.completed}/{t.required}</span>
                      <span className="text-sm font-semibold"
                        style={{ color: pct === 100 ? 'var(--color-green)' : pct >= 85 ? 'var(--color-amber)' : 'var(--color-red)' }}>
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${pct}%`,
                        background: pct === 100 ? 'var(--color-green)' : pct >= 85 ? 'var(--color-amber)' : 'var(--color-red)',
                      }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Incident Log */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: 'var(--color-border)' }}>
          <AlertTriangle size={16} style={{ color: 'var(--color-amber)' }} />
          <h2 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>Incident Log</h2>
        </div>
        <table className="data-table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Mine</th>
              <th>Type</th>
              <th>Description</th>
              <th>Severity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map(inc => (
              <tr key={inc.id}>
                <td><span className="font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>{inc.id}</span></td>
                <td><span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{inc.date}</span></td>
                <td><span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>{inc.mine}</span></td>
                <td><span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{inc.type}</span></td>
                <td><span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{inc.description}</span></td>
                <td>
                  <Badge variant={inc.severity === 'high' ? 'danger' : inc.severity === 'medium' ? 'warning' : 'muted'} size="sm">
                    {inc.severity}
                  </Badge>
                </td>
                <td>
                  <div className="flex items-center gap-1.5">
                    {inc.status === 'Closed' ? <CheckCircle2 size={12} style={{ color: 'var(--color-green)' }} /> : <XCircle size={12} style={{ color: 'var(--color-amber)' }} />}
                    <span className="text-xs" style={{ color: inc.status === 'Closed' ? 'var(--color-green)' : 'var(--color-amber)' }}>{inc.status}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
