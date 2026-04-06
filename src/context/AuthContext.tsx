import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { AppUser } from '../types';
import { mockUser } from '../data/mockData';

const AUTH_STORAGE_KEY = 'smashmarket-auth-user-v1';

function loadStoredUser(): AppUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<AppUser>;
    if (!p || typeof p.id !== 'number' || typeof p.email !== 'string') return null;
    return {
      ...mockUser,
      ...p,
      name: typeof p.name === 'string' && p.name.trim() ? p.name : mockUser.name,
      contacts: Array.isArray(p.contacts) ? p.contacts : [],
      favorites: Array.isArray(p.favorites) ? p.favorites : mockUser.favorites,
      avatar: p.avatar ?? null,
    };
  } catch {
    return null;
  }
}

function persistUser(user: AppUser | null) {
  if (typeof window === 'undefined') return;
  try {
    if (user === null) localStorage.removeItem(AUTH_STORAGE_KEY);
    else localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch {
    /* quota / private mode */
  }
}

interface AuthContextValue {
  user: AppUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, overrides?: Partial<Pick<AppUser, 'name'>>) => boolean;
  logout: () => void;
  updateProfile: (updates: Pick<AppUser, 'name' | 'email' | 'phone' | 'contacts'>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(() => loadStoredUser());

  const login = useCallback((_email: string, _password: string, overrides?: Partial<Pick<AppUser, 'name'>>) => {
    const email = _email.trim() || mockUser.email;
    const stored = loadStoredUser();
    const sameAccount = stored !== null && stored.email === email;
    const base: AppUser = sameAccount ? stored : mockUser;
    const name =
      overrides?.name !== undefined && String(overrides.name).trim().length > 0
        ? String(overrides.name).trim()
        : base.name?.trim()
          ? base.name
          : mockUser.name;
    const next: AppUser = {
      ...base,
      email,
      name,
    };
    setUser(next);
    persistUser(next);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    persistUser(null);
  }, []);

  const updateProfile = useCallback((updates: Pick<AppUser, 'name' | 'email' | 'phone' | 'contacts'>) => {
    setUser(prev => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      persistUser(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      logout,
      updateProfile,
    }),
    [user, login, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
