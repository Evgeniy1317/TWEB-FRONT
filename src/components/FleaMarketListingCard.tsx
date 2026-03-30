import { Link } from 'react-router-dom';
import type { Product } from '../types';

const CART_ICON_SRC = '/media/images/free-icon-shopping-cart-of-checkered-design-34627.png';

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

interface FleaMarketListingCardProps {
  product: Product;
  inCart: boolean;
  onToggleCart: (id: number) => void;
}

export default function FleaMarketListingCard({
  product,
  inCart,
  onToggleCart,
}: FleaMarketListingCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-none border border-gray-300 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.title}
          className="absolute inset-0 h-full w-full object-cover select-none"
          width={400}
          height={400}
          decoding="async"
          draggable={false}
          loading="lazy"
        />
        <button
          type="button"
          onClick={() => onToggleCart(product.id)}
          className={`absolute right-2 top-2 z-[1] flex h-10 w-10 items-center justify-center rounded-full border shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 ${
            inCart
              ? 'border-primary bg-primary'
              : 'border-gray-200/90 bg-white/95 hover:bg-white'
          }`}
          aria-label={inCart ? 'Убрать из корзины' : 'В корзину'}
          aria-pressed={inCart}
        >
          <img
            src={CART_ICON_SRC}
            alt=""
            width={64}
            height={64}
            decoding="async"
            draggable={false}
            className="relative z-[1] h-[22px] w-[22px] max-w-none object-contain object-center select-none pointer-events-none"
            aria-hidden
          />
        </button>
      </div>

      <div className="flex flex-col gap-1 border-t border-gray-200 p-3 sm:p-3.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
          {categoryLabel[product.category]}
        </p>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900">{product.title}</h3>
        <div className="flex min-w-0 items-center justify-between gap-2 pt-0.5">
          <p className="min-w-0 truncate text-base font-bold tabular-nums text-gray-900 sm:text-lg">
            {product.price.toLocaleString('ro-MD')} MDL
          </p>
          <Link
            to={`/market/listing/${product.id}`}
            className="shrink-0 rounded-md border-2 border-black bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide sketch-shadow-sm transition hover:bg-neutral-100 sm:px-3 sm:text-[11px]"
          >
            Подробнее
          </Link>
        </div>
      </div>
    </article>
  );
}
