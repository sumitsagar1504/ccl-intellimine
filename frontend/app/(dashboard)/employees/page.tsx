'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, Users, AlertTriangle, Sparkles, Send, X, ChevronDown, Loader2, Zap } from 'lucide-react';
import { employees, employeeSummary } from '@/lib/mock/employees';
import Badge from '@/components/ui/Badge';
import KPICard from '@/components/ui/KPICard';

// ── Minimal markdown renderer ──────────────────────────────────────────────
function renderMarkdown(text: string): string {
  return text
    .replace(/^### (.+)$/gm, '<h3 style="font-size:13px;font-weight:700;color:rgba(200,200,255,0.95);margin:14px 0 6px;">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:15px;font-weight:700;color:rgba(220,220,255,1);margin:16px 0 8px;">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="font-size:17px;font-weight:800;color:#fff;margin:16px 0 8px;">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:rgba(220,220,255,0.95);font-weight:700;">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em style="color:rgba(180,180,220,0.85);">$1</em>')
    .replace(/`(.+?)`/g, '<code style="background:rgba(99,102,241,0.18);padding:1px 6px;border-radius:5px;font-size:12px;color:#a5b4fc;">$1</code>')
    .replace(/^\| (.+) \|$/gm, (row) => {
      const cells = row.split('|').filter(Boolean).map(c => c.trim());
      return `<div style="display:flex;gap:0;border-bottom:1px solid rgba(255,255,255,0.05);">${cells.map(c =>
        `<div style="flex:1;padding:6px 10px;font-size:12px;color:rgba(180,180,220,0.85);">${c}</div>`
      ).join('')}</div>`;
    })
    .replace(/^\|[-| ]+\|$/gm, '') // remove separator rows
    .replace(/^[-*] (.+)$/gm, '<div style="display:flex;gap:8px;margin:3px 0;"><span style="color:#818cf8;margin-top:2px;">•</span><span style="color:rgba(180,180,220,0.9);font-size:13px;">$1</span></div>')
    .replace(/^(\d+)\. (.+)$/gm, '<div style="display:flex;gap:8px;margin:3px 0;"><span style="color:#818cf8;font-size:12px;min-width:16px;text-align:right;margin-top:2px;">$1.</span><span style="color:rgba(180,180,220,0.9);font-size:13px;">$2</span></div>')
    .replace(/\n\n/g, '<div style="height:8px;"></div>')
    .replace(/\n/g, '<br/>');
}

const QUICK_PROMPTS = [
  { label: '📊 Training Gap Analysis', query: 'Which employees need urgent training retraining? Give me a detailed training gap analysis with names, departments, and recommendations.' },
  { label: '⚠️ Safety Risk Assessment', query: 'Who are the high-risk employees based on safety violations and low safety scores? What HR actions do you recommend?' },
  { label: '👥 HR Recommendations', query: 'Give me 5 actionable HR recommendations for improving workforce performance based on current attendance, training, and safety data.' },
  { label: '🏆 Top Performers', query: 'Who are the top 3 performing employees and what makes them exceptional? How can we replicate their success?' },
];

// ── Build employee context string for the prompt ──────────────────────────
function buildEmployeeContext() {
  return employees.map(e =>
    `${e.name} (${e.id}, ${e.designation}, ${e.department}, ${e.mineName}): ` +
    `Attendance ${e.attendancePercent}%, Training ${e.trainingStatus}, ` +
    `Safety score ${e.safetyScore}/100, Violations ${e.safetyViolations}, ` +
    `Performance rating ${e.performanceRating}/5, ` +
    `Certs: ${e.certifications.map(c => `${c.name} (${c.status})`).join(', ')}`
  ).join('\n');
}

export default function EmployeesPage() {
  const [search, setSearch]       = useState('');
  const [filterDept, setFilterDept]     = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // AI panel state
  const [aiOpen, setAiOpen]       = useState(false);
  const [aiQuery, setAiQuery]     = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError]     = useState('');
  const responseRef = useRef<HTMLDivElement>(null);

  const depts = [...new Set(employees.map(e => e.department))];

  const filtered = employees.filter(e => {
    const matchSearch = search === '' ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase()) ||
      e.designation.toLowerCase().includes(search.toLowerCase());
    const matchDept   = filterDept === 'all' || e.department === filterDept;
    const matchStatus = filterStatus === 'all' ||
      (filterStatus === 'training_due' && e.trainingStatus !== 'current') ||
      (filterStatus === 'violations' && e.safetyViolations > 0);
    return matchSearch && matchDept && matchStatus;
  });

  const trainingBadge = (status: string) => {
    if (status === 'current') return <Badge variant="success" size="sm" dot>Current</Badge>;
    if (status === 'due')     return <Badge variant="warning" size="sm" dot pulse>Due</Badge>;
    return <Badge variant="danger" size="sm" dot pulse>Overdue</Badge>;
  };

  async function askGemini(query: string) {
    if (!query.trim()) return;
    setAiOpen(true);
    setAiLoading(true);
    setAiResponse('');
    setAiError('');

    const enriched =
      `You are an HR analytics AI for Central Coalfields Limited (CCL). ` +
      `Here is the live employee data:\n\n${buildEmployeeContext()}\n\n` +
      `Summary: ${employeeSummary.total} total, ${employeeSummary.present} present, ` +
      `${employeeSummary.trainingDue} training due, ${employeeSummary.safetyViolationsThisMonth} safety violations.\n\n` +
      `User question: ${query}`;

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: enriched }] }),
      });
      const data = await res.json();
      setAiResponse(data.response ?? 'No response received.');
    } catch (e: any) {
      setAiError('Failed to reach AI. Check your network and try again.');
    } finally {
      setAiLoading(false);
    }
  }

  useEffect(() => {
    if (aiResponse && responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [aiResponse]);

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Employee Intelligence</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
          {employeeSummary.total.toLocaleString('en-IN')} total workforce · AI-powered insights
        </p>
      </div>

      {/* ── Gemini AI Banner + Panel ─────────────────────────────────────── */}
      <div style={{
        background: aiOpen
          ? 'linear-gradient(135deg, rgba(25,25,55,0.98) 0%, rgba(15,15,40,0.99) 100%)'
          : 'linear-gradient(90deg, rgba(30,30,50,0.95) 0%, rgba(20,20,40,0.98) 100%)',
        border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: aiOpen
          ? '0 0 40px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.05)'
          : '0 0 0 1px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
        transition: 'all 0.3s ease',
      }}>

        {/* Banner Row — always visible */}
        <button
          onClick={() => setAiOpen(o => !o)}
          style={{
            width: '100%',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          {/* Gemini icon orb */}
          <div style={{
            width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px rgba(99,102,241,0.5)',
          }}>
            <Sparkles size={14} color="#fff" />
          </div>

          <p style={{
            flex: 1, fontSize: 13, fontWeight: 500,
            color: 'rgba(200,200,235,0.92)', margin: 0,
            fontStyle: 'italic', letterSpacing: '0.01em',
          }}>
            💡 Connect Gemini AI to get employee-level insights, training gap analysis, and HR recommendations.
          </p>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: '#818cf8', fontSize: 12, fontWeight: 600, fontStyle: 'normal',
            whiteSpace: 'nowrap',
          }}>
            <Zap size={12} />
            {aiOpen ? 'Close' : 'Ask AI'}
            <ChevronDown
              size={14}
              style={{ transform: aiOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
            />
          </div>
        </button>

        {/* AI Panel — expands when open */}
        {aiOpen && (
          <div style={{ borderTop: '1px solid rgba(99,102,241,0.15)', padding: '16px' }}>

            {/* Quick prompt chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              {QUICK_PROMPTS.map(p => (
                <button
                  key={p.label}
                  onClick={() => { setAiQuery(p.query); askGemini(p.query); }}
                  disabled={aiLoading}
                  style={{
                    padding: '6px 13px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                    background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
                    color: '#a5b4fc', cursor: aiLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s', opacity: aiLoading ? 0.5 : 1,
                  }}
                  onMouseEnter={e => { if (!aiLoading) (e.currentTarget.style.background = 'rgba(99,102,241,0.22)'); }}
                  onMouseLeave={e => { (e.currentTarget.style.background = 'rgba(99,102,241,0.12)'); }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Custom query input */}
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={aiQuery}
                onChange={e => setAiQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); askGemini(aiQuery); } }}
                placeholder="Ask about any employee, department, or HR trend…"
                disabled={aiLoading}
                style={{
                  flex: 1, padding: '10px 14px', borderRadius: 10, fontSize: 13,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,102,241,0.25)',
                  color: 'var(--color-text-primary)', outline: 'none',
                  opacity: aiLoading ? 0.6 : 1,
                }}
              />
              <button
                onClick={() => askGemini(aiQuery)}
                disabled={aiLoading || !aiQuery.trim()}
                style={{
                  padding: '10px 16px', borderRadius: 10, fontWeight: 700, fontSize: 13,
                  background: aiLoading || !aiQuery.trim()
                    ? 'rgba(99,102,241,0.2)'
                    : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none', color: '#fff', cursor: aiLoading || !aiQuery.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                  transition: 'all 0.15s',
                }}
              >
                {aiLoading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                {aiLoading ? 'Thinking…' : 'Ask'}
              </button>

              {(aiResponse || aiError) && (
                <button
                  onClick={() => { setAiResponse(''); setAiError(''); setAiQuery(''); }}
                  style={{
                    padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(180,180,220,0.6)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                  }}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Loading shimmer */}
            {aiLoading && (
              <div style={{ marginTop: 16 }}>
                {[80, 60, 90, 50].map((w, i) => (
                  <div key={i} style={{
                    height: 10, width: `${w}%`, borderRadius: 6, marginBottom: 10,
                    background: 'linear-gradient(90deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.18) 50%, rgba(99,102,241,0.1) 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.4s infinite',
                    animationDelay: `${i * 0.15}s`,
                  }} />
                ))}
                <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
              </div>
            )}

            {/* AI Response */}
            {aiResponse && !aiLoading && (
              <div
                ref={responseRef}
                style={{
                  marginTop: 16, padding: '16px', borderRadius: 10,
                  background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.18)',
                  maxHeight: 420, overflowY: 'auto', scrollbarWidth: 'thin',
                }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Sparkles size={11} color="#fff" />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#818cf8', letterSpacing: '0.04em' }}>
                    GEMINI AI INSIGHTS
                  </span>
                </div>

                <div
                  style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(180,180,220,0.88)' }}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(aiResponse) }}
                />
              </div>
            )}

            {/* Error */}
            {aiError && !aiLoading && (
              <div style={{
                marginTop: 14, padding: '12px 14px', borderRadius: 10,
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                color: '#fca5a5', fontSize: 13,
              }}>
                ⚠️ {aiError}
              </div>
            )}
          </div>
        )}
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
