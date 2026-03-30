export type ProductCategory =
  | 'rackets'
  | 'shoes'
  | 'shuttlecocks'
  | 'strings'
  | 'bags'
  | 'clothing'
  | 'accessories'
  | 'grips'
  | 'knee_braces'
  | 'socks'
  | 'nets_stands'
  | 'court_inventory'
  | 'other';
export type ProductCondition = 'new' | 'used';
export type OrderStatus = 'received' | 'in_progress' | 'ready';
export type UserRole = 'user' | 'master';

export interface Product {
  id: number;
  title: string;
  price: number;
  category: ProductCategory;
  condition: ProductCondition;
  image: string;
  description: string;
}

export interface Court {
  id: number;
  name: string;
  address: string;
  phone: string;
  hours: string;
  coach: string;
  coachPhone: string;
  courts: number;
  image: string;
}

export interface Tournament {
  id: number;
  title: string;
  date: string;
  location: string;
  level: string;
  description: string;
  externalUrl: string;
}

export interface StringingOrder {
  id: number;
  racketModel: string;
  tension: string;
  stringType: string;
  status: OrderStatus;
  createdAt: string;
}

export interface AppUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  favorites: number[];
  avatar: string | null;
}
