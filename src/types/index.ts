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

/** Мужское / женское / универсальное — для категорий одежды, обуви и т.п. */
export type ProductFit = 'mens' | 'womens' | 'unisex';
export type OrderStatus = 'received' | 'in_progress' | 'ready';

export interface Product {
  id: number;
  title: string;
  price: number;
  category: ProductCategory;
  condition: ProductCondition;
  image: string;
  description: string;
  /** Размер (EU для обуви, S–XL для одежды, диапазон для носков) */
  sizeLabel?: string;
  /** Дополнительные фото (не больше 6); главное фото — всегда `image` */
  extraImages?: string[];
  /** Цвет товара — один вариант, задаёт продавец */
  colorLabel?: string;
  /** Для кого (только для подходящих категорий: обувь, одежда, сумки и т.д.) */
  fit?: ProductFit;
  /** Телефон из профиля на момент публикации */
  sellerPhone?: string;
  /** Соцсети из профиля на момент публикации */
  sellerContacts?: SellerContactSnapshot[];
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

/** Зал / площадка: название, лого и фото в UI, координаты — в ссылке карт */
export interface HallVenue {
  id: string;
  name: string;
  mapsUrl: string;
  logoSrc: string;
  /** Верх карточки: заполняет рамку через object-cover */
  coverSrc: string;
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

export type UserContactPlatform = 'telegram' | 'instagram' | 'viber' | 'facebook' | 'whatsapp';

export interface SellerContactSnapshot {
  platform: UserContactPlatform;
  value: string;
}

export interface UserContact {
  id: string;
  platform: UserContactPlatform;
  value: string;
}

export interface AppUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  contacts: UserContact[];
  favorites: number[];
  avatar: string | null;
}
