import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { StringingOrder } from '../types';
import { stringingService } from '../services/api';
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
      const res = canManageOrders ? await stringingService.getOrders() : await stringingService.getMyOrders();
      setOrders(res.data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [canManageOrders, isAuthenticated, user]);

  useEffect(() => {
    void refresh();
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
