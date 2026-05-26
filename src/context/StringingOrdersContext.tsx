import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { StringingOrder } from '../types';
import { stringingService } from '../services/api';
import { stringingOrdersSeed } from '../data/mockData';
import { useAuth } from './AuthContext';

interface StringingOrdersContextValue {
  orders: StringingOrder[];
  loading: boolean;
  addOrder: (input: {
    racketModel: string;
    tension: string;
    stringTypeLabel: string;
    totalLei: number;
    clientUserId: number;
    clientName: string;
  }) => Promise<StringingOrder>;
  updateStatus: (id: number, status: StringingOrder['status']) => Promise<StringingOrder>;
  refresh: () => Promise<void>;
}

const StringingOrdersContext = createContext<StringingOrdersContextValue | null>(null);

export function StringingOrdersProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<StringingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const canManageOrders = user?.role === 'admin' || user?.role === 'manager';

  const refresh = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const isTestMode = typeof window !== 'undefined' && localStorage.getItem('smash_test_mode') === '1';
      if (isTestMode) {
        setOrders(canManageOrders ? [...stringingOrdersSeed] : stringingOrdersSeed.filter(order => order.clientUserId === user.id));
        return;
      }

      const res = canManageOrders ? await stringingService.getOrders() : await stringingService.getMyOrders();
      setOrders(res.data);
    } finally {
      setLoading(false);
    }
  }, [canManageOrders, isAuthenticated, user]);

  useEffect(() => {
    // В реальных условиях всегда грузим с сервера.
    void refresh().catch(() => {
      setOrders([]);
      setLoading(false);
    });
  }, [refresh]);

  const addOrder = useCallback(
    async (input: {
      racketModel: string;
      tension: string;
      stringTypeLabel: string;
      totalLei: number;
      clientUserId: number;
      clientName: string;
    }) => {
      // В тест-режиме добавление делаем локально, чтобы можно было смотреть UI без БД.
      const isTestMode = typeof window !== 'undefined' && localStorage.getItem('smash_test_mode') === '1';
      if (isTestMode) {
        let created: StringingOrder | undefined;
        setOrders(prev => {
          const nextId = prev.length ? Math.max(...prev.map(o => o.id)) + 1 : 1;
          created = {
            id: nextId,
            racketModel: input.racketModel.trim(),
            tension: input.tension.trim(),
            stringType: input.stringTypeLabel,
            status: 'handover',
            createdAt: new Date().toISOString().slice(0, 10),
            clientUserId: input.clientUserId,
            clientName: input.clientName,
            totalLei: input.totalLei,
          };
          return created ? [created, ...prev] : prev;
        });
        // setState async, но для UI достаточно самого created.
        if (!created) throw new Error('Test addOrder failed');
        return Promise.resolve(created);
      }

      const created = await stringingService.createOrder({
        racketModel: input.racketModel.trim(),
        tension: input.tension.trim(),
        stringType: input.stringTypeLabel,
        totalLei: input.totalLei,
      });
      await refresh();
      return created.data;
    },
    [refresh],
  );

  const updateStatus = useCallback(
    async (id: number, status: StringingOrder['status']) => {
      // В тест-режиме смена статуса делаем локально.
      const isTestMode = typeof window !== 'undefined' && localStorage.getItem('smash_test_mode') === '1';
      if (isTestMode) {
        let updated: StringingOrder | undefined;
        setOrders(prev => {
          updated = prev.find(o => o.id === id)
            ? { ...prev.find(o => o.id === id)!, status }
            : undefined;
          if (!updated) return prev;
          return prev.map(o => (o.id === id ? updated! : o));
        });
        if (!updated) throw new Error('Test updateStatus: order not found');
        return Promise.resolve(updated);
      }

      const updated = await stringingService.updateStatus(id, status);
      await refresh();
      return updated.data;
    },
    [refresh],
  );

  const value = useMemo(
    () => ({ orders, loading, addOrder, updateStatus, refresh }),
    [orders, loading, addOrder, updateStatus, refresh],
  );

  return (
    <StringingOrdersContext.Provider value={value}>
      {children}
    </StringingOrdersContext.Provider>
  );
}

export function useStringingOrders() {
  const ctx = useContext(StringingOrdersContext);
  if (!ctx) throw new Error('useStringingOrders must be used within StringingOrdersProvider');
  return ctx;
}
