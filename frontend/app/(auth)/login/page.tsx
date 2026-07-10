'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/lib/auth/context';

const roles: { value: UserRole; label: string; desc: string; icon: string }[] = [
  { value: 'admin', label: 'System Administrator', desc: 'Full system access', icon: '🛡️' },
  { value: 'mine_manager', label: 'Mine Manager', desc: 'Rajrappa Mine', icon: '⛏️' },
  { value: 'safety_officer', label: 'Safety Officer', desc: 'Safety & Compliance', icon: '⚠️' },
  { value: 'maintenance_engineer', label: 'Maintenance Engineer', desc: 'Equipment & HEMM', icon: '🔧' },
  { value: 'hr', label: 'HR Manager', desc: 'People & Training', icon: '👥' },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('mine_manager');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) { setError('Please enter your password'); return; }
    setLoading(true);
    setError('');
    const ok = await login(selectedRole, password);
    if (ok) {
      router.push('/dashboard');
    } else {
      setError('Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dots" style={{ background: 'var(--color-bg-primary)' }}>
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #1e40af, transparent)' }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-15 blur-3xl" style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl" style={{ background: 'radial-gradient(circle, #2563eb, transparent)' }} />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 glow-blue" style={{ background: 'linear-gradient(135deg, #1e40af, #3b82f6)' }}>
            <span className="text-4xl">⛏️</span>
          </div>
          <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
            Intelli<span className="gradient-text-blue">Mine</span>
          </h1>
          <p className="text-sm font-medium tracking-widest uppercase" style={{ color: 'var(--color-text-secondary)' }}>
            AI Operating System · CCL
          </p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 pulse-green" />
            <span className="text-xs" style={{ color: 'var(--color-green)' }}>All systems operational</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8 glow-blue slide-in-up">
          <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--color-text-primary)' }}>
            Sign in to your account
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Role Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                Select Role
              </label>
              <div className="space-y-2">
                {roles.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setSelectedRole(r.value)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 text-left"
                    style={{
                      background: selectedRole === r.value ? 'rgba(37, 99, 235, 0.15)' : 'rgba(255,255,255,0.02)',
                      borderColor: selectedRole === r.value ? 'var(--color-blue)' : 'var(--color-border)',
                      color: selectedRole === r.value ? 'var(--color-blue-bright)' : 'var(--color-text-secondary)',
                    }}
                  >
                    <span className="text-lg">{r.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{r.label}</p>
                      <p className="text-xs opacity-70">{r.desc}</p>
                    </div>
                    {selectedRole === r.value && (
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--color-blue)' }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter any password for demo"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--color-blue)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--color-border)'; }}
              />
              {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 relative overflow-hidden"
              style={{
                background: loading ? 'rgba(37,99,235,0.5)' : 'linear-gradient(135deg, #1e40af, #3b82f6)',
                color: '#fff',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(59,130,246,0.4)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Authenticating...
                </span>
              ) : (
                'Sign In →'
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-xs text-center" style={{ color: 'var(--color-text-muted)' }}>
              🔒 Secured with JWT · Role-Based Access Control
            </p>
            <p className="text-xs text-center mt-1" style={{ color: 'var(--color-text-muted)' }}>
              IntelliMine Copilot v2.4.1 · Central Coalfields Limited
            </p>
          </div>
        </div>

        {/* Demo Note */}
        <div className="mt-4 text-center">
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Demo mode — select any role and enter any password
          </p>
        </div>
      </div>
    </div>
  );
}
