import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Product } from '../types';

export interface CartLine {
  id: number;
  title: string;
  price: number;
}

const STORAGE_KEY = 'flea-market-cart-v1';

function loadFromStorage(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const p = JSON.parse(raw) as unknown;
    if (!Array.isArray(p)) return [];
    return p.filter(
      (x): x is CartLine =>
        x !== null &&
        typeof x === 'object' &&
        typeof (x as CartLine).id === 'number' &&
        typeof (x as CartLine).title === 'string' &&
        typeof (x as CartLine).price === 'number',
    );
  } catch {
    return [];
  }
}

interface CartContextValue {
  items: CartLine[];
  count: number;
  isInCart: (id: number) => boolean;
  toggleProduct: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>(() =>
    typeof window !== 'undefined' ? loadFromStorage() : [],
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota */
    }
  }, [items]);

  const isInCart = useCallback((id: number) => items.some(i => i.id === id), [items]);

  const toggleProduct = useCallback((product: Product) => {
    setItems(prev => {
      const exists = prev.some(i => i.id === product.id);
      if (exists) return prev.filter(i => i.id !== product.id);
      return [...prev, { id: product.id, title: product.title, price: product.price }];
    });
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      isInCart,
      toggleProduct,
      removeFromCart,
      clearCart,
    }),
    [items, isInCart, toggleProduct, removeFromCart, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
