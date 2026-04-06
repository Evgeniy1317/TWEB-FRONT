import type { ProductCategory, ProductFit } from '../types';

/** Размер: обувь, одежда, носки */
export function categoryHasSizeField(c: ProductCategory): boolean {
  return c === 'shoes' || c === 'clothing' || c === 'socks';
}

/** Мужское/женское/унисекс: обувь, одежда, носки, сумки, бандажи */
export function categoryHasFitField(c: ProductCategory): boolean {
  return c === 'shoes' || c === 'clothing' || c === 'socks' || c === 'bags' || c === 'knee_braces';
}

export const SIZE_OPTIONS_BY_CATEGORY: Record<'shoes' | 'clothing' | 'socks', string[]> = {
  shoes: ['39', '40', '41', '42', '43', '44', '45'],
  clothing: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  socks: ['35-38', '39-42', '43-46'],
};

export const FIT_FORM_OPTIONS: { value: ProductFit; label: string }[] = [
  { value: 'mens', label: 'Мужское' },
  { value: 'womens', label: 'Женское' },
  { value: 'unisex', label: 'Универсальное' },
];

/** Легаси-значения и отсутствие поля трактуем как универсальное */
export function normalizeProductFit(value: unknown): ProductFit {
  if (value === 'mens' || value === 'womens' || value === 'unisex') return value;
  return 'unisex';
}

export function fitLabel(fit: ProductFit | undefined): string {
  const f = normalizeProductFit(fit);
  return FIT_FORM_OPTIONS.find(o => o.value === f)?.label ?? 'Универсальное';
}
