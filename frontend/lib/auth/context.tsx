'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'mine_manager' | 'safety_officer' | 'maintenance_engineer' | 'hr';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  mine?: string;
  avatar: string;
  permissions: string[];
}

const roleUsers: Record<UserRole, User> = {
  admin: {
    id: 'USR-001',
    name: 'S.K. Agrawal',
    email: 'sk.agrawal@ccl.gov.in',
    role: 'admin',
    roleLabel: 'System Administrator',
    avatar: 'SA',
    permissions: ['*'],
  },
  mine_manager: {
    id: 'USR-002',
    name: 'Ramesh Kumar Singh',
    email: 'ramesh.singh@ccl.gov.in',
    role: 'mine_manager',
    roleLabel: 'Mine Manager',
    mine: 'Rajrappa',
    avatar: 'RS',
    permissions: ['dashboard', 'production', 'employees', 'approvals', 'reports', 'copilot'],
  },
  safety_officer: {
    id: 'USR-003',
    name: 'Priya Sharma',
    email: 'priya.sharma@ccl.gov.in',
    role: 'safety_officer',
    roleLabel: 'Safety Officer',
    mine: 'Rajrappa',
    avatar: 'PS',
    permissions: ['safety', 'incidents', 'training', 'documents', 'copilot'],
  },
  maintenance_engineer: {
    id: 'USR-004',
    name: 'Suresh Pandey',
    email: 'suresh.pandey@ccl.gov.in',
    role: 'maintenance_engineer',
    roleLabel: 'Maintenance Engineer',
    mine: 'Rajrappa',
    avatar: 'SP',
    permissions: ['equipment', 'analytics', 'reports', 'copilot'],
  },
  hr: {
    id: 'USR-005',
    name: 'Deepika Oraon',
    email: 'deepika.oraon@ccl.gov.in',
    role: 'hr',
    roleLabel: 'HR Manager',
    avatar: 'DO',
    permissions: ['employees', 'attendance', 'training', 'reports'],
  },
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('intellimine_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
  }, []);

  const login = async (role: UserRole, _password: string): Promise<boolean> => {
    // Demo: any password works
    const u = roleUsers[role];
    setUser(u);
    localStorage.setItem('intellimine_user', JSON.stringify(u));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('intellimine_user');
  };

  const switchRole = (role: UserRole) => {
    const u = roleUsers[role];
    setUser(u);
    localStorage.setItem('intellimine_user', JSON.stringify(u));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
