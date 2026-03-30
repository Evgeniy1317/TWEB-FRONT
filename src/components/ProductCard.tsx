import { Heart } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
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

export default function ProductCard({ product, isFavorite, onToggleFavorite }: ProductCardProps) {
  return (
    <article className="group bg-white border-2 border-black rounded-md overflow-hidden sketch-shadow transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000]">
      <div className="relative aspect-square overflow-hidden bg-white border-b-2 border-black">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover grayscale contrast-[1.05] group-hover:grayscale-0 transition-[filter] duration-300"
        />
        <button
          type="button"
          onClick={() => onToggleFavorite(product.id)}
          className="absolute top-2 right-2 w-9 h-9 border-2 border-black bg-white sketch-shadow-sm flex items-center justify-center rounded-sm hover:bg-neutral-100 transition-colors"
          aria-label={isFavorite ? 'Убрать из избранного' : 'В избранное'}
        >
          <Heart
            size={18}
            strokeWidth={2}
            className={isFavorite ? 'text-black fill-black' : 'text-black'}
          />
        </button>
        {product.condition === 'used' && (
          <span className="absolute top-2 left-2 px-2 py-0.5 border-2 border-black bg-white text-[10px] font-bold uppercase tracking-wide">
            Б/У
          </span>
        )}
        {product.condition === 'new' && (
          <span className="absolute top-2 left-2 px-2 py-0.5 border-2 border-black bg-black text-white text-[10px] font-bold uppercase tracking-wide">
            Новое
          </span>
        )}
      </div>

      <div className="p-3 sm:p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1 border-b border-dashed border-black/20 pb-1 inline-block">
          {categoryLabel[product.category]}
        </p>
        <h3 className="font-bold text-sm leading-snug mb-2 line-clamp-2">{product.title}</h3>
        <p className="text-xs text-neutral-600 mb-3 line-clamp-2 border-l-2 border-black pl-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-base font-black tabular-nums">{product.price} MDL</span>
          <button
            type="button"
            className="px-3 py-1.5 text-xs font-bold border-2 border-black bg-white sketch-shadow-sm rounded-sm hover:bg-black hover:text-white transition-colors"
          >
            Подробнее
          </button>
        </div>
      </div>
    </article>
  );
}
