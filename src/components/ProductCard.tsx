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
  accessories: 'Аксессуары',
};

export default function ProductCard({ product, isFavorite, onToggleFavorite }: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm card-hover border border-gray-100 group">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={() => onToggleFavorite(product.id)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform"
        >
          <Heart
            size={18}
            className={isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}
          />
        </button>
        {product.condition === 'used' && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-lg">
            Б/У
          </span>
        )}
        {product.condition === 'new' && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-white text-xs font-bold rounded-lg">
            Новое
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
          {categoryLabel[product.category]}
        </p>
        <h3 className="font-semibold text-dark text-sm leading-tight mb-2 line-clamp-2">
          {product.title}
        </h3>
        <p className="text-xs text-gray-500 mb-3 line-clamp-1">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary-dark">{product.price} MDL</span>
          <button className="px-3 py-1.5 bg-primary/10 text-primary-dark text-xs font-semibold rounded-lg hover:bg-primary/20 transition-colors">
            Подробнее
          </button>
        </div>
      </div>
    </div>
  );
}
