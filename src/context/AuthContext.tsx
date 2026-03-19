import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AppUser } from '../types';
import { mockUser } from '../data/mockData';

interface AuthContextValue {
  user: AppUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  toggleRole: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (_email: string, _password: string): boolean => {
    setUser(mockUser);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const toggleRole = () => {
    if (!user) return;
    setUser(prev =>
      prev ? { ...prev, role: prev.role === 'user' ? 'master' : 'user' } : prev
    );
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, toggleRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
