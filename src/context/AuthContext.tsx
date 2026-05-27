import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AppUser } from '../types';
import { authService } from '../services/api';

const AUTH_STORAGE_KEY = 'smashmarket-auth-user-v1';
const TOKEN_STORAGE_KEY = 'smashhub_token';

function loadStoredUser(): AppUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<AppUser>;
    if (!p || typeof p.id !== 'number' || typeof p.email !== 'string') return null;
    return normalizeUser({
      id: p.id,
      email: p.email,
      name: typeof p.name === 'string' && p.name.trim() ? p.name : 'Пользователь',
      phone: p.phone,
      contacts: Array.isArray(p.contacts) ? p.contacts : [],
      avatar: p.avatar ?? null,
      role: p.role,
    });
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

function normalizeUser(user: AppUser): AppUser {
  return {
    ...user,
    phone: user.phone ?? '',
    contacts: Array.isArray(user.contacts) ? user.contacts : [],
    avatar: user.avatar ?? null,
  };
}

type ProfileContactPayload = {
  platform: AppUser['contacts'][number]['platform'];
  value: string;
};

type ProfileUpdatePayload = Pick<AppUser, 'name' | 'email' | 'phone'> & {
  contacts: ProfileContactPayload[];
};

interface AuthContextValue {
  user: AppUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { name: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Pick<AppUser, 'name' | 'email' | 'phone' | 'contacts'>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(() => loadStoredUser());

  useEffect(() => {
    let cancelled = false;
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;
    if (!token) return;
    (async () => {
      try {
        const profile = await authService.getProfile();
        if (cancelled) return;
        const next = normalizeUser(profile.data as AppUser);
        setUser(next);
        persistUser(next);
      } catch {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        persistUser(null);
        setUser(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const credentials = { email: email.trim(), password };
    const res = await authService.login(credentials);

    const token = res.data?.token;
    const userFromApi = res.data?.user;
    if (typeof token !== 'string' || token.trim().length === 0 || !userFromApi) {
      throw new Error('Invalid auth response');
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    const next = normalizeUser(userFromApi as AppUser);

    setUser(next);
    persistUser(next);
    return true;
  }, []);

  const register = useCallback(
    async (data: { name: string; email: string; password: string }) => {
      await authService.register({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
      });

      return login(data.email, data.password);
    },
    [login],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
    persistUser(null);
  }, []);

  const updateProfile = useCallback(async (updates: Pick<AppUser, 'name' | 'email' | 'phone' | 'contacts'>) => {
    const payload: ProfileUpdatePayload = {
      name: updates.name,
      email: updates.email,
      phone: updates.phone,
      contacts: updates.contacts.map(contact => ({
        platform: contact.platform,
        value: contact.value,
      })),
    };

    const res = await authService.updateProfile(payload);
    const next = normalizeUser(res.data as AppUser);
    setUser(next);
    persistUser(next);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, login, register, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
