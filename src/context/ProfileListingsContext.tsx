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
import { productService } from '../services/api';
import { useAuth } from './AuthContext';

type ProductPayload = Omit<Product, 'id' | 'ownerId'>;

function normalizeProductPayload(product: ProductPayload): ProductPayload {
  return {
    ...product,
    title: product.title.trim(),
    description: product.description.trim(),
    image: product.image.trim(),
    colorLabel: product.colorLabel?.trim() || undefined,
    sizeLabel: product.sizeLabel?.trim() || undefined,
    sellerPhone: product.sellerPhone?.trim() || undefined,
    extraImages: product.extraImages?.map(image => image.trim()).filter(Boolean),
    sellerContacts: product.sellerContacts
      ?.map(contact => ({
        platform: contact.platform,
        value: contact.value.trim(),
      }))
      .filter(contact => contact.value.length > 0),
  };
}

type ProfileListingsContextValue = {
  listings: Product[];
  allListings: Product[];
  loading: boolean;
  refresh: () => Promise<void>;
  addListing: (product: ProductPayload) => Promise<Product>;
  updateListing: (id: number, product: ProductPayload) => Promise<Product>;
  deleteListing: (id: number) => Promise<void>;
};

const ProfileListingsContext = createContext<ProfileListingsContextValue | null>(null);

export function ProfileListingsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [allListings, setAllListings] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productService.getAll();
      setAllListings(res.data);
    } catch {
      setAllListings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh, user?.id, user?.role]);

  const listings = useMemo(() => {
    if (!user) return [];
    return allListings.filter(product => product.ownerId === user.id);
  }, [allListings, user]);

  const addListing = useCallback(
    async (product: ProductPayload) => {
      const res = await productService.create(normalizeProductPayload(product));
      await refresh();
      return res.data;
    },
    [refresh],
  );

  const updateListing = useCallback(
    async (id: number, product: ProductPayload) => {
      const res = await productService.update(id, normalizeProductPayload(product));
      await refresh();
      return res.data;
    },
    [refresh],
  );

  const deleteListing = useCallback(
    async (id: number) => {
      await productService.delete(id);
      await refresh();
    },
    [refresh],
  );

  const value = useMemo(
    () => ({ listings, allListings, loading, refresh, addListing, updateListing, deleteListing }),
    [listings, allListings, loading, refresh, addListing, updateListing, deleteListing],
  );

  return (
    <ProfileListingsContext.Provider value={value}>{children}</ProfileListingsContext.Provider>
  );
}

export function useProfileListings(): ProfileListingsContextValue {
  const ctx = useContext(ProfileListingsContext);
  if (!ctx) throw new Error('useProfileListings must be used within ProfileListingsProvider');
  return ctx;
}
