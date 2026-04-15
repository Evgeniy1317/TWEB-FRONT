import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { StringingOrder } from '../types';
import { stringingOrdersSeed } from '../data/mockData';

function nextId(orders: StringingOrder[]): number {
  return orders.reduce((m, o) => Math.max(m, o.id), 0) + 1;
}

interface StringingOrdersContextValue {
  orders: StringingOrder[];
  addOrder: (input: {
    racketModel: string;
    tension: string;
    stringTypeLabel: string;
    totalLei: number;
    clientUserId: number;
    clientName: string;
  }) => StringingOrder;
}

const StringingOrdersContext = createContext<StringingOrdersContextValue | null>(null);

export function StringingOrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<StringingOrder[]>(() => [...stringingOrdersSeed]);

  const addOrder = useCallback(
    (input: {
      racketModel: string;
      tension: string;
      stringTypeLabel: string;
      totalLei: number;
      clientUserId: number;
      clientName: string;
    }): StringingOrder => {
      let out: StringingOrder | undefined;
      setOrders(prev => {
        const created: StringingOrder = {
          id: nextId(prev),
          racketModel: input.racketModel.trim(),
          tension: input.tension.trim(),
          stringType: input.stringTypeLabel,
          status: 'handover',
          createdAt: new Date().toISOString().slice(0, 10),
          clientUserId: input.clientUserId,
          clientName: input.clientName,
          totalLei: input.totalLei,
        };
        out = created;
        return [...prev, created];
      });
      if (!out) throw new Error('addOrder failed');
      return out;
    },
    []
  );

  const value = useMemo(() => ({ orders, addOrder }), [orders, addOrder]);

  return <StringingOrdersContext.Provider value={value}>{children}</StringingOrdersContext.Provider>;
}

export function useStringingOrders() {
  const ctx = useContext(StringingOrdersContext);
  if (!ctx) throw new Error('useStringingOrders must be used within StringingOrdersProvider');
  return ctx;
}
