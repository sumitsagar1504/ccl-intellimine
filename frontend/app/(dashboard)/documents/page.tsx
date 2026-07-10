'use client';

import { useState } from 'react';
import { Search, Upload, FileText, Shield, Wrench, AlertCircle, FileBarChart2, ShoppingCart, ExternalLink } from 'lucide-react';
import { documents } from '@/lib/mock/documents';
import Badge from '@/components/ui/Badge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const categoryIcons: Record<string, any> = {
  'Safety Manual': Shield,
  'Inspection Report': AlertCircle,
  'SOP': Wrench,
  'Circular': FileBarChart2,
  'Technical Report': FileText,
  'Tender': ShoppingCart,
  'Purchase Order': ShoppingCart,
};

const categoryColors: Record<string, 'success' | 'danger' | 'warning' | 'info' | 'purple' | 'default' | 'muted'> = {
  'Safety Manual': 'success',
  'Inspection Report': 'warning',
  'SOP': 'info',
  'Circular': 'purple',
  'Technical Report': 'default',
};

export default function DocumentsPage() {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [ragQuery, setRagQuery] = useState('');
  const [ragAnswer, setRagAnswer] = useState('');
  const [ragLoading, setRagLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'library' | 'search'>('library');

  const cats = [...new Set(documents.map(d => d.category))];

  const filtered = documents.filter(d => {
    const matchSearch = search === '' || d.title.toLowerCase().includes(search.toLowerCase()) || d.tags.some(t => t.includes(search.toLowerCase()));
    const matchCat = filterCat === 'all' || d.category === filterCat;
    return matchSearch && matchCat;
  });

  const handleRagSearch = async () => {
    if (!ragQuery.trim()) return;
    setRagLoading(true);
    setRagAnswer('');
    try {
      const res = await fetch('/api/documents/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: ragQuery }),
      });
      const data = await res.json();
      setRagAnswer(data.answer || 'No answer found.');
    } catch {
      setRagAnswer('⚠️ Search failed. Please try again.');
    } finally {
      setRagLoading(false);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Document Intelligence</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
            {documents.length} documents · AI-powered search & analysis
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: '#fff', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>
          <Upload size={15} /> Upload Document
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)' }}>
        {(['library', 'search'] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className="px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all"
            style={activeTab === t ? {
              background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: '#fff',
            } : { color: 'var(--color-text-secondary)' }}>
            {t === 'library' ? '📁 Library' : '🔍 AI Search'}
          </button>
        ))}
      </div>

      {activeTab === 'library' && (
        <>
          {/* Filters */}
          <div className="glass-card p-4 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search documents..."
                className="w-full pl-8 pr-3 py-2 text-sm rounded-xl outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
            </div>
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
              className="px-3 py-2 text-sm rounded-xl outline-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
              <option value="all">All Categories</option>
              {cats.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Document Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(doc => {
              const Icon = categoryIcons[doc.category] || FileText;
              return (
                <div key={doc.id} className="glass-card p-5 hover:scale-[1.01] transition-all cursor-pointer">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(59,130,246,0.1)' }}>
                      <Icon size={18} style={{ color: 'var(--color-blue)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--color-text-primary)' }}>{doc.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{doc.author}</p>
                    </div>
                  </div>
                  <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{doc.summary}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={categoryColors[doc.category] || 'default'} size="sm">{doc.category}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      <span>{doc.pages}p</span>
                      <span>·</span>
                      <span>{doc.size}</span>
                      <span>·</span>
                      <span>{doc.date}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {doc.tags.slice(0, 4).map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-muted)' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === 'search' && (
        <div className="space-y-4">
          {/* RAG Search Box */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1e40af, #7c3aed)' }}>
                <Search size={18} style={{ color: '#fff' }} />
              </div>
              <div>
                <h2 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>AI Document Search</h2>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Ask any question — AI finds the answer in your documents</p>
              </div>
            </div>
            <div className="flex gap-3">
              <input
                value={ragQuery}
                onChange={e => setRagQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleRagSearch()}
                placeholder='e.g. "What is the maximum permissible methane concentration?"'
                className="flex-1 px-4 py-3 text-sm rounded-xl outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
              />
              <button onClick={handleRagSearch} disabled={ragLoading || !ragQuery.trim()}
                className="px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: '#fff' }}>
                {ragLoading ? 'Searching...' : 'Search →'}
              </button>
            </div>

            {/* Sample questions */}
            <div className="flex flex-wrap gap-2 mt-3">
              {['What is the maximum permissible methane concentration?', 'What PPE is required underground?', 'Summarize the June 2025 safety inspection', 'What are the bearing maintenance intervals?'].map(q => (
                <button key={q} onClick={() => { setRagQuery(q); }}
                  className="text-xs px-3 py-1.5 rounded-xl transition-all hover:scale-105"
                  style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: 'var(--color-blue-bright)' }}>
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Answer */}
          {ragAnswer && (
            <div className="glass-card p-6 slide-in-up">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <p className="text-xs font-semibold" style={{ color: 'var(--color-green)' }}>AI Answer — sourced from document library</p>
              </div>
              <div className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <p className="mb-3 leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>{children}</p>,
                    strong: ({ children }) => <strong style={{ color: 'var(--color-blue-bright)' }}>{children}</strong>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                    li: ({ children }) => <li style={{ color: 'var(--color-text-secondary)' }}>{children}</li>,
                    blockquote: ({ children }) => <blockquote className="border-l-2 pl-3 my-2 italic" style={{ borderColor: 'var(--color-blue)', color: 'var(--color-text-secondary)' }}>{children}</blockquote>,
                  }}>
                  {ragAnswer}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
