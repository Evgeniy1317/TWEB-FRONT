import type { Product, Court, Tournament, StringingOrder, AppUser } from '../types';
import { publicUrl } from '../lib/publicUrl';

/** Те же файлы, что превью категорий на странице барахолки (`MarketPage`). */
const M = (file: string) => publicUrl(`media/images/${file}`);

/** 12 карточек — по одной на категорию (без «Другое»), картинка = иконка категории. */
const productsSeed: Product[] = [
  {
    id: 1,
    title: 'Ракетки',
    price: 1200,
    category: 'rackets',
    condition: 'new',
    image: M('200x200_raketki.jpg'),
    colorLabel: '—',
    description: 'Категория «Ракетки».',
  },
  {
    id: 2,
    title: 'Воланы',
    price: 350,
    category: 'shuttlecocks',
    condition: 'new',
    image: M('2991.1000_200.jpg'),
    colorLabel: '—',
    description: 'Категория «Воланы».',
  },
  {
    id: 3,
    title: 'Струны для перетяжки',
    price: 250,
    category: 'strings',
    condition: 'new',
    image: M('200x200_struna.jpg'),
    colorLabel: '—',
    description: 'Категория «Струны для перетяжки».',
  },
  {
    id: 4,
    title: 'Обувь',
    price: 1800,
    category: 'shoes',
    condition: 'new',
    image: M('200x200_krossovki.jpg'),
    colorLabel: '—',
    description: 'Категория «Обувь».',
    fit: 'unisex',
  },
  {
    id: 5,
    title: 'Одежда',
    price: 450,
    category: 'clothing',
    condition: 'new',
    image: M('200x200_odejda.jpg'),
    colorLabel: '—',
    description: 'Категория «Одежда».',
    fit: 'unisex',
  },
  {
    id: 6,
    title: 'Сумки и чехлы',
    price: 650,
    category: 'bags',
    condition: 'new',
    image: M('bag01.jpg'),
    colorLabel: '—',
    description: 'Категория «Сумки и чехлы».',
    fit: 'unisex',
  },
  {
    id: 7,
    title: 'Обмотки',
    price: 150,
    category: 'grips',
    condition: 'new',
    image: M('200x200_obmotki.jpg'),
    colorLabel: '—',
    description: 'Категория «Обмотки».',
  },
  {
    id: 8,
    title: 'Тейпы и бандажи',
    price: 200,
    category: 'knee_braces',
    condition: 'new',
    image: M('200x200_tape.jpg'),
    colorLabel: '—',
    description: 'Категория «Тейпы и бандажи».',
    fit: 'unisex',
  },
  {
    id: 9,
    title: 'Носки',
    price: 120,
    category: 'socks',
    condition: 'new',
    image: M('6714360812.jpg'),
    colorLabel: '—',
    description: 'Категория «Носки».',
  },
  {
    id: 10,
    title: 'Сетки и стойки',
    price: 900,
    category: 'nets_stands',
    condition: 'new',
    image: M('orig.webp'),
    colorLabel: '—',
    description: 'Категория «Сетки и стойки».',
  },
  {
    id: 11,
    title: 'Инвентарь для зала',
    price: 400,
    category: 'court_inventory',
    condition: 'new',
    image: M('stanki_pushki200.jpg'),
    colorLabel: '—',
    description: 'Категория «Инвентарь для зала».',
  },
  {
    id: 12,
    title: 'Аксессуары',
    price: 180,
    category: 'accessories',
    condition: 'new',
    image: M('200x200_aksessuari.jpg'),
    colorLabel: '—',
    description: 'Категория «Аксессуары».',
  },
];

export const products: Product[] = productsSeed.map(p => ({
  ...p,
  extraImages: [],
}));

export type MarketSellerSocialLink = {
  label: string;
  href: string;
};

export type MarketSellerContact = {
  name: string;
  /** Телефон для отображения и tel:-ссылки */
  phone?: string;
  links: MarketSellerSocialLink[];
};

const DEFAULT_MARKET_SELLER: MarketSellerContact = {
  name: 'Продавец TWEB',
  phone: '+373 69 000 111',
  links: [
    { label: 'Telegram', href: 'https://t.me/' },
    { label: 'Instagram', href: 'https://www.instagram.com/' },
    { label: 'Viber', href: 'https://www.viber.com/' },
    { label: 'Facebook', href: 'https://www.facebook.com/' },
    { label: 'WhatsApp', href: 'https://wa.me/37369000111' },
  ],
};

const MARKET_SELLERS_BY_PRODUCT_ID: Partial<Record<number, MarketSellerContact>> = {};

export function getMarketSellerForProduct(productId: number): MarketSellerContact {
  return MARKET_SELLERS_BY_PRODUCT_ID[productId] ?? DEFAULT_MARKET_SELLER;
}

export const courts: Court[] = [
  {
    id: 1,
    name: 'Arena Badminton Club',
    address: 'ул. Алексей Матеевич, 65',
    phone: '+373 69 123 456',
    hours: 'Пн–Пт: 08:00–22:00, Сб–Вс: 09:00–20:00',
    coach: 'Игорь Петрович',
    coachPhone: '+373 69 111 222',
    courts: 4,
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&h=400&fit=crop',
  },
  {
    id: 2,
    name: 'SmashZone Chișinău',
    address: 'бул. Штефан чел Маре, 142',
    phone: '+373 69 234 567',
    hours: 'Пн–Вс: 07:00–23:00',
    coach: 'Андрей Кожухарь',
    coachPhone: '+373 69 333 444',
    courts: 6,
    image: 'https://images.unsplash.com/photo-1554290712-e640351074bd?w=600&h=400&fit=crop',
  },
  {
    id: 3,
    name: 'SportLife Center',
    address: 'ул. Каля Ешилор, 28',
    phone: '+373 69 345 678',
    hours: 'Пн–Пт: 10:00–21:00, Сб: 10:00–18:00',
    coach: 'Мария Гончар',
    coachPhone: '+373 69 555 666',
    courts: 3,
    image: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6a766?w=600&h=400&fit=crop',
  },
  {
    id: 4,
    name: 'Badminton Pro Hall',
    address: 'ул. Измаил, 92',
    phone: '+373 69 456 789',
    hours: 'Пн–Вс: 06:00–22:00',
    coach: 'Дмитрий Руснак',
    coachPhone: '+373 69 777 888',
    courts: 8,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop',
  },
];

export const tournaments: Tournament[] = [
  {
    id: 1,
    title: 'Кубок Кишинёва 2026',
    date: '2026-04-15',
    location: 'Arena Badminton Club',
    level: 'Все уровни',
    description: 'Ежегодный открытый турнир для всех желающих',
    externalUrl: 'https://example.com/tournament/1',
  },
  {
    id: 2,
    title: 'Spring Smash Open',
    date: '2026-05-03',
    location: 'SmashZone Chișinău',
    level: 'Средний / Продвинутый',
    description: 'Весенний турнир в одиночном и парном разрядах',
    externalUrl: 'https://example.com/tournament/2',
  },
  {
    id: 3,
    title: 'Новичок Challenge',
    date: '2026-05-20',
    location: 'SportLife Center',
    level: 'Начинающий',
    description: 'Турнир для тех, кто играет менее 1 года',
    externalUrl: 'https://example.com/tournament/3',
  },
  {
    id: 4,
    title: 'Moldova National Championship',
    date: '2026-06-10',
    location: 'Badminton Pro Hall',
    level: 'Профессиональный',
    description: 'Чемпионат Молдовы по бадминтону',
    externalUrl: 'https://example.com/tournament/4',
  },
  {
    id: 5,
    title: 'Summer Doubles League',
    date: '2026-07-01',
    location: 'Arena Badminton Club',
    level: 'Все уровни',
    description: 'Летняя парная лига — 8 недель игр',
    externalUrl: 'https://example.com/tournament/5',
  },
];

export const stringingOrders: StringingOrder[] = [
  {
    id: 1,
    racketModel: 'Yonex Astrox 88D',
    tension: '26',
    stringType: 'BG65',
    status: 'ready',
    createdAt: '2026-03-10',
  },
  {
    id: 2,
    racketModel: 'Li-Ning Windstorm 72',
    tension: '24',
    stringType: 'BG80',
    status: 'in_progress',
    createdAt: '2026-03-15',
  },
  {
    id: 3,
    racketModel: 'Victor DriveX 9X',
    tension: '25',
    stringType: 'Nanogy 98',
    status: 'received',
    createdAt: '2026-03-17',
  },
];

export const mockUser: AppUser = {
  id: 1,
  name: 'Алексей Морарь',
  email: 'alex.morar@example.com',
  phone: '',
  contacts: [],
  favorites: [1, 3, 5],
  avatar: null,
};
