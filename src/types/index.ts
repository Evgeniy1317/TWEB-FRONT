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
/** Для обуви, одежды, носков */
export type ProductGender = 'mens' | 'womens' | 'unisex';
export type OrderStatus = 'received' | 'in_progress' | 'ready';

export interface Product {
  id: number;
  title: string;
  price: number;
  category: ProductCategory;
  condition: ProductCondition;
  image: string;
  description: string;
  /** Пол — для фильтров в категориях обувь / одежда / носки */
  gender?: ProductGender;
  /** Размер (EU для обуви, S–XL для одежды, диапазон для носков) */
  sizeLabel?: string;
  /** Дополнительные фото (не больше 6); главное фото — всегда `image` */
  extraImages?: string[];
  /** Цвет товара — один вариант, задаёт продавец */
  colorLabel?: string;
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
  favorites: number[];
  avatar: string | null;
}
