'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Animated mesh background — fixed behind everything */}
      <div className="bg-mesh" aria-hidden="true" />
      <div className="fixed inset-0 bg-grid opacity-100 pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true" />

      {/* Floating ambient orbs */}
      <div aria-hidden="true" className="pointer-events-none" style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
        <div className="orb orb-blue"  style={{ width: 600, height: 600, top: '-200px', left: '10%', animationDuration: '20s' }} />
        <div className="orb orb-purple" style={{ width: 500, height: 500, bottom: '-150px', right: '5%', animationDuration: '25s', animationDelay: '-8s' }} />
        <div className="orb orb-cyan"  style={{ width: 300, height: 300, top: '40%', left: '50%', animationDuration: '18s', animationDelay: '-4s', opacity: 0.06 }} />
      </div>

      {/* Sidebar */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Sidebar />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ position: 'relative', zIndex: 5 }}>
        <TopBar />
        <main className="flex-1 overflow-y-auto" style={{ padding: '24px', scrollbarWidth: 'thin' }}>
          <div className="fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
