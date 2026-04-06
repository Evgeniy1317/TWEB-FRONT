import type { Product } from '../types';
import { categoryHasFitField, categoryHasSizeField, fitLabel } from './productCategoryFields';

/** Главное фото + до 7 дополнительных (как в форме объявления) */
export function buildListingGalleryUrls(product: Product): string[] {
  const extra = (product.extraImages ?? []).slice(0, 7);
  return [product.image, ...extra];
}

const categoryLabel: Record<Product['category'], string> = {
  rackets: 'Ракетки',
  shoes: 'Обувь',
  shuttlecocks: 'Воланы',
  strings: 'Струны для перетяжки',
  bags: 'Сумки и чехлы',
  clothing: 'Одежда',
  accessories: 'Аксессуары',
  grips: 'Обмотки',
  knee_braces: 'Тейпы и бандажи',
  socks: 'Носки',
  nets_stands: 'Сетки и стойки',
  court_inventory: 'Инвентарь для зала',
  other: 'Другое',
};

const conditionLabel: Record<Product['condition'], string> = {
  new: 'Новое',
  used: 'Б/у',
};

export function buildListingSpecLines(product: Product): { label: string; value: string }[] {
  const lines: { label: string; value: string }[] = [
    { label: 'Категория', value: categoryLabel[product.category] },
    { label: 'Состояние', value: conditionLabel[product.condition] },
    { label: 'Цвет', value: product.colorLabel ?? '—' },
  ];
  if (categoryHasSizeField(product.category) && product.sizeLabel) {
    lines.push({ label: 'Размер', value: product.sizeLabel });
  }
  if (categoryHasFitField(product.category)) {
    lines.push({ label: 'Для кого', value: fitLabel(product.fit) });
  }
  return lines;
}
