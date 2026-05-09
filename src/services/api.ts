import axios, { type InternalAxiosRequestConfig } from 'axios';
import type { Product, StringingOrder, Court, Tournament } from '../types';
import { products as mockProductsSeed } from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('smashhub_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const productService = {
  getAll: async (): Promise<{ data: Product[] }> => {
    const isTestMode = localStorage.getItem('smash_test_mode') === '1';
    if (isTestMode) {
      return { data: readProducts() };
    }
    return api.get<Product[]>('/products');
  },
  getById: async (id: number): Promise<{ data: Product }> => {
    const isTestMode = localStorage.getItem('smash_test_mode') === '1';
    if (isTestMode) {
      const list = readProducts();
      const found = list.find(p => p.id === id);
      if (!found) throw new Error('Product not found (test mode)');
      return { data: found };
    }
    return api.get<Product>(`/products/${id}`);
  },
  create: async (data: Omit<Product, 'id'>): Promise<{ data: Product }> => {
    const isTestMode = localStorage.getItem('smash_test_mode') === '1';
    if (isTestMode) {
      const list = readProducts();
      const nextId = list.length ? Math.max(...list.map(p => p.id)) + 1 : 1;
      const created: Product = { id: nextId, ...data };
      writeProducts([created, ...list]);
      return { data: created };
    }
    return api.post<Product>('/products', data);
  },
  update: async (id: number, data: Partial<Omit<Product, 'id'>>): Promise<{ data: Product }> => {
    const isTestMode = localStorage.getItem('smash_test_mode') === '1';
    if (isTestMode) {
      const list = readProducts();
      const idx = list.findIndex(p => p.id === id);
      if (idx < 0) throw new Error('Product not found (test mode)');
      const updated: Product = { ...list[idx], ...data, id };
      const next = list.map(p => (p.id === id ? updated : p));
      writeProducts(next);
      return { data: updated };
    }
    return api.patch<Product>(`/products/${id}`, data);
  },
  delete: async (id: number): Promise<void> => {
    const isTestMode = localStorage.getItem('smash_test_mode') === '1';
    if (isTestMode) {
      const list = readProducts();
      const next = list.filter(p => p.id !== id);
      writeProducts(next);
      // На всякий случай также помечаем как удалённый для фильтра в ленте.
      try {
        const raw = localStorage.getItem('smash_deleted_products_v1');
        const parsed = raw ? JSON.parse(raw) : [];
        const ids = Array.isArray(parsed) ? parsed.map((x: unknown) => Number(x)).filter((n: number) => Number.isFinite(n)) : [];
        if (!ids.includes(id)) localStorage.setItem('smash_deleted_products_v1', JSON.stringify([...ids, id]));
      } catch {
        /* ignore */
      }
      return;
    }
    await api.delete(`/products/${id}`);
  },
};

const PRODUCTS_TEST_STORAGE_KEY = 'smash_products_v1';

function readProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_TEST_STORAGE_KEY);
    if (!raw) {
      // Seed из mockData, чтобы можно было тестировать редактирование сразу.
      writeProducts([...mockProductsSeed]);
      return [...mockProductsSeed];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [...mockProductsSeed];
    return parsed as Product[];
  } catch {
    return [...mockProductsSeed];
  }
}

function writeProducts(next: Product[]) {
  try {
    localStorage.setItem(PRODUCTS_TEST_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore storage quota errors
  }
}

export const stringingService = {
  getOrders: () => api.get<StringingOrder[]>('/stringing'),
  createOrder: (data: Omit<StringingOrder, 'id' | 'status' | 'createdAt'>) =>
    api.post<StringingOrder>('/stringing', data),
  updateStatus: (id: number, status: StringingOrder['status']) =>
    api.patch<StringingOrder>(`/stringing/${id}`, { status }),
};

export const courtService = {
  getAll: () => api.get<Court[]>('/courts'),
};

export const tournamentService = {
  getAll: () => api.get<Tournament[]>('/tournaments'),
};

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  name: string;
}

export const authService = {
  login: (credentials: LoginCredentials) => api.post('/auth/login', credentials),
  register: (data: RegisterData) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: { name?: string; email?: string; phone?: string; contacts?: unknown }) =>
    api.patch('/auth/profile', data),
};

export default api;
