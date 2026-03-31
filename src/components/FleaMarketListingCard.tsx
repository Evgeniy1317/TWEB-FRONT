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
  const listingPath = `/market/listing/${product.id}`;
  const openLabel = `${product.title} — открыть объявление`;

  return (
    <article className="relative flex flex-col overflow-hidden rounded-none border border-gray-300 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md hover:ring-2 hover:ring-primary/40">
      <Link
        to={listingPath}
        className="absolute inset-0 z-[1]"
        aria-label={openLabel}
      />
      <div className="relative z-[2] flex flex-1 flex-col pointer-events-none">
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover select-none"
            width={400}
            height={400}
            decoding="async"
            draggable={false}
            loading="lazy"
          />
          <button
            type="button"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onToggleCart(product.id);
            }}
            className={`absolute right-2 top-2 z-[3] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 pointer-events-auto ${
              inCart
                ? 'border-primary bg-primary'
                : 'border-gray-200/90 bg-white/95'
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
          <p className="pt-0.5 text-base font-bold tabular-nums text-gray-900 sm:text-lg">
            {product.price.toLocaleString('ro-MD')} MDL
          </p>
        </div>
      </div>
    </article>
  );
}
