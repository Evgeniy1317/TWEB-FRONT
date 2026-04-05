import type { Product } from '../types';

const PROFILE_LISTINGS_STORAGE_KEY = 'profile-listings';

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadProfileListings(): Product[] {
  if (!canUseStorage()) return [];

  const raw = window.localStorage.getItem(PROFILE_LISTINGS_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Product[]) : [];
  } catch {
    return [];
  }
}

export function saveProfileListings(listings: Product[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(PROFILE_LISTINGS_STORAGE_KEY, JSON.stringify(listings));
}

export function getProfileListingById(id: number): Product | undefined {
  return loadProfileListings().find(product => product.id === id);
}

export function deleteProfileListingById(id: number) {
  const nextListings = loadProfileListings().filter(product => product.id !== id);
  saveProfileListings(nextListings);
  return nextListings;
}
