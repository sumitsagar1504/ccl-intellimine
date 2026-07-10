'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Cpu, AlertTriangle } from 'lucide-react';
import { equipment, Equipment, EquipmentStatus } from '@/lib/mock/equipment';
import HealthRing from '@/components/ui/HealthRing';
import Badge from '@/components/ui/Badge';

const statusVariant: Record<EquipmentStatus, 'success' | 'warning' | 'danger' | 'muted'> = {
  operational: 'success',
  maintenance: 'warning',
  breakdown: 'danger',
  idle: 'muted',
};

const statusLabel: Record<EquipmentStatus, string> = {
  operational: 'Operational',
  maintenance: 'Maintenance',
  breakdown: 'Breakdown',
  idle: 'Idle',
};

export default function EquipmentPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMine, setFilterMine] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'health' | 'failure' | 'name'>('failure');

  const mines = [...new Set(equipment.map(e => e.mineName))];

  const filtered = equipment
    .filter(e => {
      const matchSearch = search === '' || e.name.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'all' || e.status === filterStatus;
      const matchMine = filterMine === 'all' || e.mineName === filterMine;
      return matchSearch && matchStatus && matchMine;
    })
    .sort((a, b) => {
      if (sortBy === 'health') return a.healthScore - b.healthScore;
      if (sortBy === 'failure') return b.failureProbability - a.failureProbability;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Equipment Intelligence</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
            {equipment.length} machines · AI-powered health monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          {equipment.filter(e => e.failureProbability >= 70).length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--color-red)' }}>
              <AlertTriangle size={12} />
              {equipment.filter(e => e.failureProbability >= 70).length} critical machines
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search equipment..."
              className="w-full pl-8 pr-3 py-2 text-sm rounded-xl outline-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
            <option value="all">All Status</option>
            <option value="operational">Operational</option>
            <option value="maintenance">Maintenance</option>
            <option value="breakdown">Breakdown</option>
            <option value="idle">Idle</option>
          </select>
          <select value={filterMine} onChange={e => setFilterMine(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
            <option value="all">All Mines</option>
            {mines.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-2 text-sm rounded-xl outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
            <option value="failure">Sort: Failure Risk ↓</option>
            <option value="health">Sort: Health ↑</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(eq => (
          <Link key={eq.id} href={`/equipment/${eq.id}`}>
            <div className="glass-card p-5 cursor-pointer hover:scale-[1.02] transition-all duration-200 relative overflow-hidden"
              style={eq.failureProbability >= 70 ? { borderColor: 'rgba(239,68,68,0.4)', boxShadow: '0 0 20px rgba(239,68,68,0.15)' } : {}}>
              {eq.failureProbability >= 70 && (
                <div className="absolute top-3 right-3">
                  <AlertTriangle size={16} style={{ color: 'var(--color-red)' }} className="pulse-red" />
                </div>
              )}

              <div className="flex items-start gap-4">
                <HealthRing score={eq.healthScore} size={72} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>{eq.name}</p>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{eq.id} · {eq.type}</p>
                    </div>
                    <Badge variant={statusVariant[eq.status]} size="sm" dot>{statusLabel[eq.status]}</Badge>
                  </div>
                  <p className="text-xs mb-2" style={{ color: 'var(--color-text-secondary)' }}>{eq.mineName} Mine</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="text-center">
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Temp</p>
                  <p className="font-semibold text-sm" style={{ color: eq.temperature > 90 ? 'var(--color-red)' : 'var(--color-amber)' }}>
                    {eq.temperature}°C
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Vibration</p>
                  <p className="font-semibold text-sm" style={{ color: eq.vibration > 7 ? 'var(--color-red)' : eq.vibration > 4 ? 'var(--color-amber)' : 'var(--color-green)' }}>
                    {eq.vibration} mm/s
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Failure Risk</p>
                  <p className="font-semibold text-sm" style={{ color: eq.failureProbability >= 70 ? 'var(--color-red)' : eq.failureProbability >= 40 ? 'var(--color-amber)' : 'var(--color-green)' }}>
                    {eq.failureProbability}%
                  </p>
                </div>
              </div>

              {eq.failureProbability >= 70 && (
                <div className="mt-3 px-3 py-2 rounded-lg text-xs"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                  ⚠️ AI Alert: High failure risk — immediate inspection required
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
