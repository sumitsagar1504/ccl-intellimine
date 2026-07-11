'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { Send, Zap, RefreshCw, Sparkles, Bot, Copy, Check } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  'Show production of Rajrappa mine this month',
  'Which excavator has highest downtime?',
  'Summarize the safety inspection report',
  'What is the maximum permissible methane concentration?',
  'Which employees need safety retraining?',
  'Generate maintenance schedule for this week',
  'Show fuel consumption trend for last 6 months',
  'What is the failure probability of Dumper 203?',
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

function InlineChart({ data }: { data: { type: string; title: string; data: any[]; xKey?: string; yKeys?: string[] } }) {
  const { type, title, data: chartData, xKey = 'name', yKeys = ['value'] } = data;
  const colors = COLORS;

  const renderChart = () => {
    if (type === 'bar') {
      return (
        <BarChart data={chartData}>
          <XAxis dataKey={xKey} tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ background: 'rgba(13,26,53,0.95)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8 }} />
          {yKeys.map((k, i) => <Bar key={k} dataKey={k} fill={colors[i % colors.length]} radius={[4, 4, 0, 0]} />)}
        </BarChart>
      );
    }
    if (type === 'line') {
      return (
        <LineChart data={chartData}>
          <XAxis dataKey={xKey} tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ background: 'rgba(13,26,53,0.95)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8 }} />
          {yKeys.map((k, i) => <Line key={k} type="monotone" dataKey={k} stroke={colors[i % colors.length]} strokeWidth={2} dot={false} />)}
        </LineChart>
      );
    }
    if (type === 'area') {
      return (
        <AreaChart data={chartData}>
          <defs>{yKeys.map((k, i) => (
            <linearGradient key={k} id={`g${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors[i % colors.length]} stopOpacity={0.3} />
              <stop offset="95%" stopColor={colors[i % colors.length]} stopOpacity={0} />
            </linearGradient>
          ))}</defs>
          <XAxis dataKey={xKey} tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ background: 'rgba(13,26,53,0.95)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8 }} />
          {yKeys.map((k, i) => <Area key={k} type="monotone" dataKey={k} stroke={colors[i % colors.length]} fill={`url(#g${i})`} strokeWidth={2} />)}
        </AreaChart>
      );
    }
    if (type === 'pie') {
      return (
        <PieChart>
          <Pie data={chartData} dataKey={yKeys[0]} nameKey={xKey} cx="50%" cy="50%" outerRadius={80} label stroke="none">
            {chartData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ background: 'rgba(13,26,53,0.95)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8 }} />
        </PieChart>
      );
    }
    return null;
  };

  return (
    <div className="mt-3 rounded-xl overflow-hidden" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}>
      <div className="px-4 py-2 border-b flex items-center gap-2" style={{ borderColor: 'rgba(59,130,246,0.15)' }}>
        <Sparkles size={13} style={{ color: 'var(--blue)' }} />
        <span className="text-xs font-semibold" style={{ color: 'var(--blue-light)' }}>{title}</span>
      </div>
      <div className="p-4">
        <ResponsiveContainer width="100%" height={220}>{renderChart()!}</ResponsiveContainer>
      </div>
    </div>
  );
}

function parseChartFromContent(content: string): { text: string; chart: any | null } {
  const match = content.match(/```chart\n([\s\S]*?)```/);
  if (!match) return { text: content, chart: null };
  try {
    const chart = JSON.parse(match[1]);
    const text = content.replace(/```chart\n[\s\S]*?```/, '').trim();
    return { text, chart };
  } catch {
    return { text: content, chart: null };
  }
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  const { text, chart } = parseChartFromContent(msg.content);

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} slide-in-up`}>
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold"
        style={{ background: isUser ? 'linear-gradient(135deg, #1e40af, #2563eb)' : 'linear-gradient(135deg, #1e40af, #7c3aed)' }}>
        {isUser ? '👤' : '🤖'}
      </div>
      <div className={`max-w-[78%] ${isUser ? 'chat-user' : 'chat-ai'} px-4 py-3`}>
        {isUser ? (
          <p className="text-sm text-white">{text}</p>
        ) : (
          <>
            <div className="text-sm prose-custom" style={{ color: 'var(--text-primary)' }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed text-sm" style={{ color: 'var(--text-primary)' }}>{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold" style={{ color: 'var(--blue-light)' }}>{children}</strong>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-sm" style={{ color: 'var(--text-secondary)' }}>{children}</li>,
                  table: ({ children }) => <div className="overflow-x-auto my-2"><table className="data-table w-full text-xs rounded-lg overflow-hidden">{children}</table></div>,
                  th: ({ children }) => <th className="text-left" style={{ color: 'var(--text-secondary)', background: 'rgba(59,130,246,0.1)', padding: '8px 12px', borderBottom: '1px solid rgba(59,130,246,0.2)', fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{children}</th>,
                  td: ({ children }) => <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(59,130,246,0.08)', color: 'var(--text-primary)' }}>{children}</td>,
                  code: ({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) => <code className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(59,130,246,0.1)', color: '#93c5fd' }}>{children}</code>,
                  h1: ({ children }) => <h1 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{children}</h1>,
                  h2: ({ children }) => <h2 className="text-sm font-bold mb-1" style={{ color: 'var(--blue-light)' }}>{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>{children}</h3>,
                  blockquote: ({ children }) => <blockquote className="border-l-2 pl-3 my-2 italic" style={{ borderColor: 'var(--blue)', color: 'var(--text-secondary)' }}>{children}</blockquote>,
                  a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--blue-light)' }}>{children}</a>,
                }}>
                {text}
              </ReactMarkdown>
            </div>
            {chart && <InlineChart data={chart} />}
          </>
        )}
        <p className="text-xs mt-1.5 opacity-40" style={{ textAlign: isUser ? 'right' : 'left' }}>
          {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #1e40af, #7c3aed)' }}>🤖</div>
      <div className="chat-ai px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-2 h-2 rounded-full" style={{ background: 'var(--blue)', animation: `bounce 1.4s ${i * 0.2}s infinite` }} />
        ))}
      </div>
    </div>
  );
}

export default function CopilotPage() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `# Welcome to IntelliMine Copilot 🤖

I'm your AI assistant for Central Coalfields Limited operations. I have real-time access to:

- **Production data** from all 7 mines
- **Equipment health** for 10+ machines  
- **Employee records** for 4,820+ workers
- **Document library** including safety manuals, inspection reports, SOPs

**Try asking me:**
- *"Show production of Rajrappa mine this month"*
- *"Which excavator has highest downtime?"*
- *"What is the max permissible methane concentration?"*
- *"Which employees need safety retraining?"*`,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const autoSentRef = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response || data.error || 'I encountered an error. Please try again.',
        timestamp: new Date(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Connection error. Please check your internet connection and try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  // Auto-send query from URL ?q= param (comes from search bar)
  useEffect(() => {
    const q = searchParams.get('q');
    if (q && !autoSentRef.current) {
      autoSentRef.current = true;
      // Small delay so the page renders first
      const timer = setTimeout(() => send(q), 300);
      return () => clearTimeout(timer);
    }
  }, [searchParams, send]);

  return (
    <div className="h-full flex flex-col fade-in" style={{ maxHeight: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center glow-blue"
            style={{ background: 'linear-gradient(135deg, #1e40af, #7c3aed)' }}>
            <Zap size={20} style={{ color: '#fff' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>AI Copilot</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-green" />
              <p className="text-xs" style={{ color: 'var(--color-green)' }}>Gemini AI · Connected to CCL Data</p>
            </div>
          </div>
        </div>
        <button onClick={() => setMessages(msgs => [msgs[0]])}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-colors hover:bg-white/5"
          style={{ color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
          <RefreshCw size={12} />
          New Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1">
        {messages.map((m, i) => <MessageBubble key={i} msg={m} />)}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Suggested Prompts */}
      {messages.length <= 1 && !loading && (
        <div className="shrink-0 py-3">
          <p className="text-xs mb-2 font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
            Suggested queries
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map(p => (
              <button key={p} onClick={() => send(p)}
                className="text-xs px-3 py-1.5 rounded-xl transition-all hover:scale-105"
                style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: 'var(--color-blue-bright)' }}>
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 pt-3">
        <form onSubmit={e => { e.preventDefault(); send(input); }}
          className="flex gap-2 p-3 rounded-2xl"
          style={{ background: 'rgba(13,26,53,0.8)', border: '1px solid var(--color-border)' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about production, equipment, safety..."
            className="flex-1 bg-transparent outline-none chat-input"
            style={{ color: 'var(--color-text-primary)', fontSize: 16, lineHeight: 1.4 }}
            disabled={loading}
          />
          <button type="submit" disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #1e40af, #7c3aed)' }}>
            <Send size={16} style={{ color: '#fff' }} />
          </button>
        </form>
        <p className="text-xs text-center mt-2" style={{ color: 'var(--color-text-muted)' }}>
          Powered by Gemini AI · Responses may contain errors. Verify critical decisions.
        </p>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
