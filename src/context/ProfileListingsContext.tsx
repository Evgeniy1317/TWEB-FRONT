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
import { loadProfileListings, saveProfileListings } from '../services/profileListings';

type ProfileListingsContextValue = {
  listings: Product[];
  addListing: (product: Product) => void;
  updateListing: (product: Product) => void;
  deleteListing: (id: number) => void;
};

const ProfileListingsContext = createContext<ProfileListingsContextValue | null>(null);

export function ProfileListingsProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Product[]>(() => loadProfileListings());

  useEffect(() => {
    saveProfileListings(listings);
  }, [listings]);

  const addListing = useCallback((product: Product) => {
    setListings(prev => [product, ...prev]);
  }, []);

  const updateListing = useCallback((product: Product) => {
    setListings(prev => prev.map(p => (p.id === product.id ? product : p)));
  }, []);

  const deleteListing = useCallback((id: number) => {
    setListings(prev => prev.filter(p => p.id !== id));
  }, []);

  const value = useMemo(
    () => ({ listings, addListing, updateListing, deleteListing }),
    [listings, addListing, updateListing, deleteListing],
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
