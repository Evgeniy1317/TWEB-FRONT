import axios, { type InternalAxiosRequestConfig } from 'axios';
import type { Product, StringingOrder, Court, Tournament } from '../types';

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
  getAll: () => api.get<Product[]>('/products'),
  getById: (id: number) => api.get<Product>(`/products/${id}`),
  create: (data: Omit<Product, 'id'>) => api.post<Product>('/products', data),
};

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
};

export default api;
