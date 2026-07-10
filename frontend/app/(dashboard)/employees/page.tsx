'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Users, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { employees, employeeSummary } from '@/lib/mock/employees';
import Badge from '@/components/ui/Badge';
import KPICard from '@/components/ui/KPICard';

export default function EmployeesPage() {
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const depts = [...new Set(employees.map(e => e.department))];

  const filtered = employees.filter(e => {
    const matchSearch = search === '' ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase()) ||
      e.designation.toLowerCase().includes(search.toLowerCase());
    const matchDept = filterDept === 'all' || e.department === filterDept;
    const matchStatus = filterStatus === 'all' ||
      (filterStatus === 'training_due' && e.trainingStatus !== 'current') ||
      (filterStatus === 'violations' && e.safetyViolations > 0);
    return matchSearch && matchDept && matchStatus;
  });

  const trainingBadge = (status: string) => {
    if (status === 'current') return <Badge variant="success" size="sm" dot>Current</Badge>;
    if (status === 'due') return <Badge variant="warning" size="sm" dot pulse>Due</Badge>;
    return <Badge variant="danger" size="sm" dot pulse>Overdue</Badge>;
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Employee Intelligence</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
          {employeeSummary.total.toLocaleString('en-IN')} total workforce · AI-powered insights
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Present Today" value={employeeSummary.present.toLocaleString('en-IN')}
          color="green" change={2.1} changeLabel="vs yesterday" icon={<Users size={18} />} />
        <KPICard title="On Leave" value={employeeSummary.onLeave} color="amber" icon={<Users size={18} />} />
        <KPICard title="Training Due" value={employeeSummary.trainingDue} color="red"
          subtitle="Need retraining" icon={<AlertTriangle size={18} />} />
        <KPICard title="Avg Safety Score" value={`${employeeSummary.avgSafetyScore}%`} color="blue" icon={<Users size={18} />} />
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search employees..."
            className="w-full pl-8 pr-3 py-2 text-sm rounded-xl outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
        </div>
        <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
          className="px-3 py-2 text-sm rounded-xl outline-none"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
          <option value="all">All Departments</option>
          {depts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-sm rounded-xl outline-none"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
          <option value="all">All Status</option>
          <option value="training_due">Training Due</option>
          <option value="violations">Has Violations</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <table className="data-table w-full">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Mine</th>
              <th className="text-center">Attendance</th>
              <th>Training</th>
              <th className="text-center">Safety Score</th>
              <th className="text-center">Violations</th>
              <th className="text-center">Rating</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(emp => (
              <tr key={emp.id} style={{ cursor: 'pointer' }}>
                <td>
                  <Link href={`/employees/${emp.id}`} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #1e40af, #7c3aed)', color: '#fff' }}>
                      {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{emp.name}</p>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{emp.id} · {emp.designation}</p>
                    </div>
                  </Link>
                </td>
                <td><span style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>{emp.department}</span></td>
                <td><span style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>{emp.mineName}</span></td>
                <td className="text-center">
                  <span className="font-semibold text-sm"
                    style={{ color: emp.attendancePercent >= 90 ? 'var(--color-green)' : emp.attendancePercent >= 80 ? 'var(--color-amber)' : 'var(--color-red)' }}>
                    {emp.attendancePercent}%
                  </span>
                </td>
                <td>{trainingBadge(emp.trainingStatus)}</td>
                <td className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <div className="h-1.5 w-20 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full"
                        style={{
                          width: `${emp.safetyScore}%`,
                          background: emp.safetyScore >= 85 ? 'var(--color-green)' : emp.safetyScore >= 70 ? 'var(--color-amber)' : 'var(--color-red)',
                        }} />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>{emp.safetyScore}</span>
                  </div>
                </td>
                <td className="text-center">
                  {emp.safetyViolations > 0 ? (
                    <Badge variant={emp.safetyViolations >= 3 ? 'danger' : 'warning'} size="sm">{emp.safetyViolations}</Badge>
                  ) : (
                    <Badge variant="success" size="sm">0</Badge>
                  )}
                </td>
                <td className="text-center">
                  <div className="flex items-center justify-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-sm"
                        style={{ background: i < Math.floor(emp.performanceRating) ? '#f59e0b' : 'rgba(255,255,255,0.08)' }} />
                    ))}
                    <span className="ml-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>{emp.performanceRating}</span>
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
