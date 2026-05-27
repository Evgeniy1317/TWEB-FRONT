import axios, { type InternalAxiosRequestConfig } from 'axios';
import type { CartLine, Product, StringingOrder } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7237/api';
const TOKEN_STORAGE_KEY = 'smashhub_token';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const productService = {
  getAll: () => api.get<Product[]>('/products'),
  getById: (id: number) => api.get<Product>(`/products/${id}`),
  create: (data: Omit<Product, 'id'>) => api.post<Product>('/products', data),
  update: (id: number, data: Partial<Omit<Product, 'id'>>) =>
    api.put<Product>(`/products/${id}`, data),
  delete: async (id: number) => {
    await api.delete(`/products/${id}`);
  },
};

export const stringingService = {
  getOrders: () => api.get<StringingOrder[]>('/stringing'),
  getMyOrders: () => api.get<StringingOrder[]>('/stringing/my'),
  createOrder: (data: {
    racketModel: string;
    tension: string;
    stringType: string;
    totalLei: number;
  }) =>
    api.post<StringingOrder>('/stringing', data),
  updateStatus: (id: number, status: StringingOrder['status']) =>
    api.put<StringingOrder>(`/stringing/${id}`, status),
};

export const cartService = {
  getItems: () => api.get<CartLine[]>('/cart'),
  addItem: (productId: number) => api.post<CartLine>(`/cart/${productId}`),
  removeItem: (productId: number) => api.delete(`/cart/${productId}`),
  clear: () => api.delete('/cart'),
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
  updateProfile: (data: {
    name?: string;
    email?: string;
    phone?: string;
    contacts?: Array<{ platform: string; value: string }>;
  }) =>
    api.patch('/auth/profile', data),
};

export default api;
