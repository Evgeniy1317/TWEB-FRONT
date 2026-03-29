import { useMemo, useState, type FormEvent } from 'react';
import { ChevronDown, LayoutGrid, Search } from 'lucide-react';
import FleaMarketListingCard from '../components/FleaMarketListingCard';
import { products } from '../data/mockData';

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

type RibbonItem = {
  id: string;
  label: string;
  thumb: string;
};

/** Шесть карточек категорий; «Все категории» — отдельный блок справа */
const CATEGORY_RIBBON: RibbonItem[] = [
  {
    id: 'rackets',
    label: 'Ракетки',
    thumb: 'https://picsum.photos/seed/smash-cat-rackets/480/360',
  },
  {
    id: 'shuttlecocks',
    label: 'Воланы',
    thumb: 'https://picsum.photos/seed/smash-cat-shuttle/480/360',
  },
  {
    id: 'strings',
    label: 'Струны для перетяжки',
    thumb: 'https://picsum.photos/seed/smash-cat-strings/480/360',
  },
  {
    id: 'shoes',
    label: 'Обувь',
    thumb: 'https://picsum.photos/seed/smash-cat-shoes/480/360',
  },
  {
    id: 'clothing',
    label: 'Одежда',
    thumb: 'https://picsum.photos/seed/smash-cat-clothing/480/360',
  },
  {
    id: 'bags',
    label: 'Сумки и чехлы',
    thumb: 'https://picsum.photos/seed/smash-cat-bags/480/360',
  },
];

export default function MarketPage() {
  const [search, setSearch] = useState('');
  const [selectedRibbonId, setSelectedRibbonId] = useState<string>('all');
  const [cartProductIds, setCartProductIds] = useState<number[]>([]);

  const shuffledProducts = useMemo(() => shuffle([...products]), []);

  const visibleListings = useMemo(() => {
    let list =
      selectedRibbonId === 'all'
        ? shuffledProducts
        : shuffledProducts.filter(p => p.category === selectedRibbonId);
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      p =>
        p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );
  }, [shuffledProducts, search, selectedRibbonId]);

  const toggleCartItem = (id: number) => {
    setCartProductIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const onSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="sketch-page min-h-[calc(100dvh-4.5rem)] w-full text-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:gap-3">
          {/* Верх: кнопка + поиск — ширина как у ленты ниже */}
          <form onSubmit={onSearchSubmit} className="flex w-full flex-col gap-3 sm:flex-row sm:items-stretch">
            <button
              type="button"
              className="flex shrink-0 items-center justify-center gap-2 border-2 border-black bg-white px-4 py-3 text-xs font-bold uppercase tracking-wide sketch-shadow-sm transition-colors hover:bg-neutral-100 sm:w-[11rem] sm:rounded-md"
            >
              <LayoutGrid size={18} strokeWidth={2.5} className="shrink-0" />
              <span className="whitespace-nowrap">Все категории</span>
            </button>

            <div className="flex min-h-[3rem] min-w-0 flex-1 border-2 border-black bg-white sketch-shadow rounded-md overflow-hidden">
              <div className="flex shrink-0 items-center justify-center border-r-2 border-black bg-neutral-100 px-3">
                <Search size={18} strokeWidth={2.5} className="text-black" />
              </div>
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Найти в объявлениях"
                className="sketch-input min-w-0 flex-1 border-0 bg-white px-3 py-3 text-sm placeholder:text-neutral-400 focus:ring-0"
              />
              <button
                type="submit"
                className="shrink-0 border-l-2 border-black bg-white px-4 py-3 text-sm font-bold text-blue-700 hover:bg-neutral-50 sm:px-6"
              >
                Найти
              </button>
            </div>
          </form>

          {/* Только карточки в ленте; «Все категории» — вне flex-ряда (absolute), не тянет высоту ленты */}
          <div className="relative w-full overflow-visible pb-1 sm:pb-0">
            <div className="flex w-full gap-2 overflow-x-auto pb-1 [scrollbar-width:thin] sm:gap-2.5 sm:overflow-visible sm:pb-0">
              {CATEGORY_RIBBON.map(cat => {
                const active = selectedRibbonId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedRibbonId(cat.id)}
                    className={`group flex min-w-[4.75rem] shrink-0 flex-col overflow-hidden rounded-xl border-2 bg-white shadow-sm transition-transform sm:min-w-0 sm:flex-1 ${
                      active ? 'border-primary' : 'border-black hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="relative aspect-[4/3] min-h-[4.25rem] w-full sm:min-h-[5rem]">
                      <img
                        src={cat.thumb}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover select-none"
                        width={480}
                        height={360}
                        decoding="async"
                        draggable={false}
                      />
                    </div>
                    <div
                      className={`flex items-center justify-center gap-1 border-t-2 border-dashed px-1.5 py-2 sm:px-2 sm:py-2.5 ${
                        active
                          ? 'border-primary/45 bg-primary'
                          : 'border-black/30 bg-white'
                      }`}
                    >
                      <span
                        className={`text-center text-[9px] font-bold leading-tight sm:text-[10px] ${
                          active ? 'text-gray-900' : 'text-black'
                        }`}
                      >
                        {cat.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setSelectedRibbonId('all')}
              aria-label="Все категории"
              className="absolute left-full top-0 bottom-0 z-[2] ml-0.5 flex w-[4.75rem] flex-col items-center justify-center gap-2 rounded-l-none rounded-r-xl border-2 border-dashed border-black bg-white px-2 text-center shadow-sm hover:bg-neutral-50 sm:ml-1 sm:w-[5.25rem] sm:px-2.5"
            >
              <span className="text-[8px] font-bold leading-tight sm:text-[9px]">Все категории</span>
              <ChevronDown size={18} strokeWidth={2.5} className="shrink-0 text-black" aria-hidden />
            </button>
          </div>
        </div>

        <div className="mb-4 border-b-2 border-black pb-3">
          <h2 className="text-xl font-black tracking-tight sm:text-2xl">Рекомендованные</h2>
        </div>

        {visibleListings.length === 0 ? (
          <div className="border-2 border-black bg-white sketch-shadow rounded-md p-10 text-center">
            <p className="font-black text-lg">Ничего не найдено</p>
            <p className="mt-2 text-sm text-neutral-600">Измените запрос в поиске</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleListings.map(product => (
              <FleaMarketListingCard
                key={product.id}
                product={product}
                inCart={cartProductIds.includes(product.id)}
                onToggleCart={toggleCartItem}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
