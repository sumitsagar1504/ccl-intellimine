import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth/context';

export const metadata: Metadata = {
  title: 'IntelliMine Copilot — AI Operating System for Coal Mining',
  description: 'Enterprise AI platform for Central Coalfields Limited (CCL) — production intelligence, equipment health monitoring, document AI, and predictive analytics for coal mining operations.',
  keywords: ['coal mining', 'CCL', 'AI', 'mining operations', 'equipment monitoring', 'safety management'],
  openGraph: {
    title: 'IntelliMine Copilot',
    description: 'AI Operating System for Coal Mining Organizations',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
