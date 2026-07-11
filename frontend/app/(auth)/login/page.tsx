'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/lib/auth/context';
import { Eye, EyeOff, Zap, Shield, BarChart3, ChevronRight } from 'lucide-react';

const ROLES = [
  { id: 'admin',               label: 'Admin',                 avatar: '👨‍💼', desc: 'Full system access',           email: 'admin@ccl.gov.in',    password: 'admin123' },
  { id: 'mine_manager',        label: 'Mine Manager',          avatar: '⛏️',  desc: 'Production & operations',    email: 'manager@ccl.gov.in',  password: 'manager123' },
  { id: 'safety_officer',      label: 'Safety Officer',        avatar: '🦺',  desc: 'Safety & compliance',        email: 'safety@ccl.gov.in',   password: 'safety123' },
  { id: 'maintenance_engineer',label: 'Maintenance Engineer',  avatar: '🔧',  desc: 'Equipment & maintenance',    email: 'engineer@ccl.gov.in', password: 'eng123' },
  { id: 'hr',                  label: 'HR Officer',            avatar: '👥',  desc: 'Workforce management',       email: 'hr@ccl.gov.in',       password: 'hr123' },
];

const FEATURES = [
  { icon: <Zap size={16} />,      label: 'AI Copilot',  desc: 'Powered by Gemini' },
  { icon: <Shield size={16} />,   label: 'Live Safety', desc: 'Real-time alerts' },
  { icon: <BarChart3 size={16} />,label: 'Predictive',  desc: 'ML forecasts' },
];

const STATS = [
  { value: '7',    label: 'Active Mines' },
  { value: '4,820',label: 'Employees' },
  { value: '99.2%',label: 'Uptime' },
];

export default function LoginPage() {
  const [selected, setSelected]     = useState<typeof ROLES[0] | null>(null);
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPass, setShowPass]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [step, setStep]             = useState<'role' | 'creds'>('role');
  const [mounted, setMounted]       = useState(false);
  const { login, isAuthenticated }  = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  const pickRole = (role: typeof ROLES[0]) => {
    setSelected(role);
    setEmail(role.email);
    setPassword(role.password);
    setError('');
    setTimeout(() => setStep('creds'), 50);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) { setError('Please select a role'); return; }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 900));
    const ok = await login(selected.id as UserRole, password);
    if (ok) { router.push('/dashboard'); }
    else { setError('Invalid credentials. Use the pre-filled credentials below.'); setLoading(false); }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: 'var(--bg-base)' }}>

      {/* LEFT PANEL — Branding */}
      <div className="hidden lg:flex lg:w-[54%] relative flex-col justify-between p-12 overflow-hidden">

        {/* Background layers */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(145deg, #060f24 0%, #0c1d3e 50%, #07101f 100%)',
        }} />
        <div className="bg-grid" style={{ position: 'absolute', inset: 0, opacity: 0.8 }} />

        {/* Orbs */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <div className="orb orb-blue"   style={{ width: 500, height: 500, top: '-100px',  left: '-100px', opacity: 0.15, animationDuration: '22s' }} />
          <div className="orb orb-purple" style={{ width: 400, height: 400, bottom: '-50px', right: '5%',   opacity: 0.12, animationDuration: '28s', animationDelay: '-10s' }} />
          <div className="orb orb-cyan"   style={{ width: 250, height: 250, top: '40%',     left: '40%',   opacity: 0.08, animationDuration: '16s', animationDelay: '-5s' }} />
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16 slide-in-up">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1e40af, #6366f1)', boxShadow: '0 0 24px rgba(99,102,241,0.5)' }}>
              <span className="text-xl">⛏</span>
            </div>
            <div>
              <p className="font-bold text-lg leading-tight" style={{ color: 'var(--text-primary)' }}>
                Intelli<span className="gradient-text">Mine</span> Copilot
              </p>
              <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--text-muted)' }}>
                Enterprise AI Platform
              </p>
            </div>
          </div>

          {/* Hero text */}
          <div className="slide-in-up delay-1">
            <h1 className="text-5xl font-bold leading-tight mb-6" style={{ color: 'var(--text-primary)' }}>
              AI-Powered
              <br />
              <span className="gradient-text">Mining Intelligence</span>
              <br />
              for CCL
            </h1>
            <p className="text-base leading-relaxed max-w-md" style={{ color: 'var(--text-secondary)' }}>
              Real-time operations, predictive maintenance, AI document search and workforce management — unified in one enterprise platform.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-8 slide-in-up delay-2">
            {FEATURES.map(f => (
              <div key={f.label} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
                style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}>
                <span style={{ color: 'var(--blue-light)' }}>{f.icon}</span>
                <div>
                  <p className="font-semibold text-xs leading-none" style={{ color: 'var(--text-primary)' }}>{f.label}</p>
                  <p className="text-[10px] leading-none mt-0.5" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats bottom */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="h-px mb-6" style={{ background: 'linear-gradient(90deg, rgba(59,130,246,0.4), transparent)' }} />
          <div className="flex gap-8 slide-in-up delay-3">
            {STATS.map(s => (
              <div key={s.label}>
                <p className="text-2xl font-bold gradient-text">{s.value}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-[10.5px] mt-6" style={{ color: 'var(--text-dim)' }}>
            A Coal India Limited Subsidiary · Dhanbad, Jharkhand
          </p>
        </div>
      </div>

      {/* RIGHT PANEL — Login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10" style={{ position: 'relative' }}>
        {/* Subtle right panel gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(59,130,246,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="w-full max-w-md scale-in" style={{ position: 'relative', zIndex: 1 }}>

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1e40af, #6366f1)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
              <span className="text-lg">⛏</span>
            </div>
            <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
              Intelli<span className="gradient-text">Mine</span> Copilot
            </p>
          </div>

          <div className="glass-card p-8" style={{ border: '1px solid rgba(59,130,246,0.18)' }}>
            {/* Header */}
            <div className="mb-7">
              <h2 className="text-[22px] font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {step === 'role' ? 'Select your role' : `Welcome, ${selected?.avatar}`}
              </h2>
              <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                {step === 'role'
                  ? 'Choose your role to continue to IntelliMine'
                  : `Signing in as ${selected?.label} · ${selected?.desc}`}
              </p>
            </div>

            {/* STEP 1 — Role selector */}
            {step === 'role' && (
              <div className="space-y-2 fade-in">
                {ROLES.map((role, i) => (
                  <button
                    key={role.id}
                    onClick={() => pickRole(role)}
                    className="w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] slide-in-up glass-card-interactive"
                    style={{
                      animationDelay: `${i * 0.07}s`,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border)',
                    }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: 'rgba(59,130,246,0.1)' }}>
                      {role.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[13.5px] leading-tight" style={{ color: 'var(--text-primary)' }}>
                        {role.label}
                      </p>
                      <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {role.desc}
                      </p>
                    </div>
                    <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  </button>
                ))}
              </div>
            )}

            {/* STEP 2 — Credentials */}
            {step === 'creds' && selected && (
              <form onSubmit={handleLogin} className="space-y-4 fade-in">
                {/* Selected role pill */}
                <div className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selected.avatar}</span>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{selected.label}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{selected.email}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setStep('role')}
                    className="text-xs px-2 py-1 rounded-lg transition-colors hover:bg-white/5"
                    style={{ color: 'var(--blue-light)', border: '1px solid rgba(59,130,246,0.2)' }}>
                    Change
                  </button>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>Email</label>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="input"
                    placeholder="email@ccl.gov.in"
                    autoComplete="email"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password} onChange={e => setPassword(e.target.value)}
                      className="input pr-10"
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: 'var(--text-muted)' }}>
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                    Demo: credentials are pre-filled ✓
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-xl text-xs pop-in"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--red-light)' }}>
                    <span className="text-sm mt-0.5">⚠️</span> {error}
                  </div>
                )}

                {/* Submit */}
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-[14px] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: loading ? 'rgba(59,130,246,0.5)' : 'linear-gradient(135deg, #1e40af, #6366f1)',
                    color: '#fff',
                    boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
                  }}>
                  {loading ? (
                    <>
                      <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Sign In to IntelliMine →
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <p className="text-center text-[10.5px] mt-6" style={{ color: 'var(--text-dim)' }}>
            IntelliMine Copilot v2.4.1 · Central Coalfields Limited<br/>
            © 2025 Coal India Limited. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
