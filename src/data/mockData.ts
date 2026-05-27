import type { Court, Tournament } from '../types';

export type MarketSellerSocialLink = {
  label: string;
  href: string;
};

export type MarketSellerContact = {
  name: string;
  phone?: string;
  links: MarketSellerSocialLink[];
};

export const courts: Court[] = [
  {
    id: 1,
    name: 'Arena Badminton Club',
    address: 'ул. Алексей Матеевич, 65',
    phone: '+373 69 123 456',
    hours: 'Пн-Пт: 08:00-22:00, Сб-Вс: 09:00-20:00',
    coach: 'Игорь Петрович',
    coachPhone: '+373 69 111 222',
    courts: 4,
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&h=400&fit=crop',
  },
  {
    id: 2,
    name: 'SmashZone Chisinau',
    address: 'бул. Штефан чел Маре, 142',
    phone: '+373 69 234 567',
    hours: 'Пн-Вс: 07:00-23:00',
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
    hours: 'Пн-Пт: 10:00-21:00, Сб: 10:00-18:00',
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
    hours: 'Пн-Вс: 06:00-22:00',
    coach: 'Дмитрий Руснак',
    coachPhone: '+373 69 777 888',
    courts: 8,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop',
  },
];

export const tournaments: Tournament[] = [
  {
    id: 1,
    title: 'Кубок Кишинева 2026',
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
    location: 'SmashZone Chisinau',
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
    description: 'Летняя парная лига на 8 недель игр',
    externalUrl: 'https://example.com/tournament/5',
  },
];
