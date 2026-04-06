import type { MarketSellerContact } from '../data/mockData';
import type { Product } from '../types';
import { buildContactHrefFromSnapshot, CONTACT_PLATFORM_LABEL } from './contactLinks';

/** Контакты продавца для карточки барахолки (пользовательские объявления). */
export function marketSellerFromProduct(product: Product): MarketSellerContact {
  const links = (product.sellerContacts ?? []).map(c => ({
    label: CONTACT_PLATFORM_LABEL[c.platform],
    href: buildContactHrefFromSnapshot(c),
  }));
  return {
    name: 'Продавец',
    phone: product.sellerPhone,
    links,
  };
}
