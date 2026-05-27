import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CartLine, Product } from '../types';
import { cartService } from '../services/api';
import { useAuth } from './AuthContext';

interface CartContextValue {
  items: CartLine[];
  count: number;
  loading: boolean;
  isInCart: (id: number) => boolean;
  refresh: () => Promise<void>;
  toggleProduct: (product: Product) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartLine[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await cartService.getItems();
      setItems(res.data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void refresh();
  }, [refresh, user?.id]);

  const isInCart = useCallback((id: number) => items.some(i => i.id === id), [items]);

  const toggleProduct = useCallback(
    async (product: Product) => {
      if (!isAuthenticated) return;

      const exists = items.some(i => i.id === product.id);
      if (exists) {
        try {
          await cartService.removeItem(product.id);
          setItems(prev => prev.filter(i => i.id !== product.id));
        } catch {
          await refresh();
        }
        return;
      }

      try {
        const res = await cartService.addItem(product.id);
        setItems(prev => {
          if (prev.some(i => i.id === res.data.id)) return prev;
          return [res.data, ...prev];
        });
      } catch {
        await refresh();
      }
    },
    [isAuthenticated, items, refresh],
  );

  const removeFromCart = useCallback(
    async (id: number) => {
      if (!isAuthenticated) return;
      try {
        await cartService.removeItem(id);
        setItems(prev => prev.filter(i => i.id !== id));
      } catch {
        await refresh();
      }
    },
    [isAuthenticated, refresh],
  );

  const clearCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      await cartService.clear();
      setItems([]);
    } catch {
      await refresh();
    }
  }, [isAuthenticated, refresh]);

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      loading,
      isInCart,
      refresh,
      toggleProduct,
      removeFromCart,
      clearCart,
    }),
    [items, loading, isInCart, refresh, toggleProduct, removeFromCart, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
