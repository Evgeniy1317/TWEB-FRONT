import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, LayoutGrid, Search, X } from 'lucide-react';
import FleaMarketListingCard from '../components/FleaMarketListingCard';
import MarketFiltersPanel, {
  type MarketConditionFilter,
  type MarketSortOption,
} from '../components/MarketFiltersPanel';
import { products } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useProfileListings } from '../context/ProfileListingsContext';
import { useCart } from '../context/CartContext';
import type { Product, ProductFit } from '../types';
import { categoryHasFitField, normalizeProductFit } from '../utils/productCategoryFields';
import { publicUrl } from '../lib/publicUrl';

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

/** 3px offset: тёмно-зелёная тень при выборе / открытой панели (обводка остаётся чёрной) */
const categorySelectedShadowClass = 'shadow-[3px_3px_0_0_#00E676]';

const IMG = (name: string) => publicUrl(`media/images/${name}`);

/** undraw empty cart — имя файла со пробелом и скобками */
const MARKET_EMPTY_ILLU = publicUrl(`media/images/${encodeURIComponent('undraw_empty-cart_574u (1).svg')}`);

function MarketListingsEmpty({ hint }: { hint: 'filters' | 'search' }) {
  return (
    <div className="relative overflow-hidden border-2 border-black bg-white sketch-shadow rounded-md">
      <div className="px-6 py-10 sm:px-10 sm:py-14">
        <div className="mx-auto flex max-w-lg flex-col items-center text-center">
          <div className="mb-6 flex w-full justify-center sm:mb-8">
            <img
              src={MARKET_EMPTY_ILLU}
              alt=""
              className="h-36 w-auto max-w-[min(100%,280px)] object-contain sm:h-44"
              width={280}
              height={220}
              decoding="async"
              draggable={false}
            />
          </div>
          <h3 className="font-black tracking-tight text-gray-900 text-xl sm:text-2xl">
            Ничего не найдено
          </h3>
          <div className="mx-auto mt-4 h-0.5 w-14 bg-primary" aria-hidden />
          <p className="mt-5 max-w-md text-pretty text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
            {hint === 'filters'
              ? 'Измените фильтры или запрос в поиске'
              : 'Измените запрос в поиске'}
          </p>
        </div>
      </div>
    </div>
  );
}

/** Шесть карточек категорий; «Все категории» — отдельный блок справа */
const CATEGORY_RIBBON: RibbonItem[] = [
  { id: 'rackets', label: 'Ракетки', thumb: IMG('200x200_raketki.jpg') },
  { id: 'shuttlecocks', label: 'Воланы', thumb: IMG('2991.1000_200.jpg') },
  { id: 'strings', label: 'Струны для перетяжки', thumb: IMG('200x200_struna.jpg') },
  { id: 'shoes', label: 'Обувь', thumb: IMG('200x200_krossovki.jpg') },
  { id: 'clothing', label: 'Одежда', thumb: IMG('200x200_odejda.jpg') },
  { id: 'bags', label: 'Сумки и чехлы', thumb: IMG('bag01.jpg') },
];

/** Раскрываемая сетка «все категории» (отдельно от горизонтальной ленты) */
const CATEGORY_PICKER_GRID: RibbonItem[] = [
  { id: 'grips', label: 'Обмотки', thumb: IMG('200x200_obmotki.jpg') },
  { id: 'knee_braces', label: 'Тейпы и бандажи', thumb: IMG('200x200_tape.jpg') },
  { id: 'socks', label: 'Носки', thumb: IMG('6714360812.jpg') },
  { id: 'nets_stands', label: 'Сетки и стойки', thumb: IMG('orig.webp') },
  { id: 'court_inventory', label: 'Инвентарь для зала', thumb: IMG('stanki_pushki200.jpg') },
  { id: 'accessories', label: 'Аксессуары', thumb: IMG('200x200_aksessuari.jpg') },
  { id: 'other', label: 'Другое', thumb: IMG('category-other.svg') },
];

export default function MarketPage() {
  const [search, setSearch] = useState('');
  const [selectedRibbonId, setSelectedRibbonId] = useState<string>('all');
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { listings: profileListings } = useProfileListings();
  const navigate = useNavigate();
  const { isInCart, toggleProduct } = useCart();

  const handleToggleCart = useCallback(
    (product: Product) => {
      if (!isAuthenticated) {
        navigate('/login', { state: { from: '/market' } });
        return;
      }
      toggleProduct(product);
    },
    [isAuthenticated, navigate, toggleProduct],
  );
  const [filterPriceMin, setFilterPriceMin] = useState('');
  const [filterPriceMax, setFilterPriceMax] = useState('');
  const [filterCondition, setFilterCondition] = useState<MarketConditionFilter>('all');
  const [filterSort, setFilterSort] = useState<MarketSortOption>('default');
  const [filterSize, setFilterSize] = useState('');
  const [filterFit, setFilterFit] = useState<ProductFit | ''>('');

  const shuffledProducts = useMemo(
    () => shuffle([...products, ...profileListings]),
    [profileListings],
  );

  useEffect(() => {
    setFilterSize('');
    setFilterFit('');
  }, [selectedRibbonId]);

  const resetMarketFilters = useCallback(() => {
    setFilterPriceMin('');
    setFilterPriceMax('');
    setFilterCondition('all');
    setFilterSort('default');
    setFilterSize('');
    setFilterFit('');
  }, []);

  const showAllCategories = useCallback(() => {
    setSelectedRibbonId('all');
    setCategoryPickerOpen(false);
  }, []);

  const applyQuickPriceRange = useCallback((min: number, max: number | null) => {
    setFilterPriceMin(String(min));
    setFilterPriceMax(max === null ? '' : String(max));
  }, []);

  const visibleListings = useMemo(() => {
    let list =
      selectedRibbonId === 'all'
        ? shuffledProducts
        : shuffledProducts.filter(p => p.category === selectedRibbonId);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        p =>
          p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
      );
    }

    const minN = filterPriceMin.trim() === '' ? null : Number.parseInt(filterPriceMin, 10);
    const maxN = filterPriceMax.trim() === '' ? null : Number.parseInt(filterPriceMax, 10);
    if (minN !== null && !Number.isNaN(minN)) {
      list = list.filter(p => p.price >= minN);
    }
    if (maxN !== null && !Number.isNaN(maxN)) {
      list = list.filter(p => p.price <= maxN);
    }
    if (filterCondition !== 'all') {
      list = list.filter(p => p.condition === filterCondition);
    }

    const isApparelCategory =
      selectedRibbonId === 'shoes' ||
      selectedRibbonId === 'clothing' ||
      selectedRibbonId === 'socks';
    if (isApparelCategory) {
      const sizeQ = filterSize.trim();
      if (sizeQ !== '') {
        list = list.filter(p => p.sizeLabel === sizeQ);
      }
    }

    if (filterFit !== '') {
      list = list.filter(p => {
        if (!categoryHasFitField(p.category)) return false;
        return normalizeProductFit(p.fit) === filterFit;
      });
    }

    const sorted = [...list];
    if (filterSort === 'price_asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (filterSort === 'price_desc') {
      sorted.sort((a, b) => b.price - a.price);
    }
    return sorted;
  }, [
    shuffledProducts,
    search,
    selectedRibbonId,
    filterPriceMin,
    filterPriceMax,
    filterCondition,
    filterSort,
    filterSize,
    filterFit,
  ]);

  const apparelFilterCategory =
    selectedRibbonId === 'shoes' || selectedRibbonId === 'clothing' || selectedRibbonId === 'socks'
      ? (selectedRibbonId as 'shoes' | 'clothing' | 'socks')
      : null;

  const showFitFilter =
    selectedRibbonId === 'all' ||
    ['shoes', 'clothing', 'socks', 'bags', 'knee_braces'].includes(selectedRibbonId);

  const onSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  const toggleCategoryPicker = () => setCategoryPickerOpen(v => !v);

  const selectCategoryFromPicker = (id: string) => {
    setSelectedRibbonId(id);
  };

  /** Нижняя сетка категорий (без плитки «Все») */
  const allCategoriesPickerItems: RibbonItem[] = [...CATEGORY_PICKER_GRID];

  return (
    <div className="sketch-page min-h-[calc(100dvh-4.5rem)] w-full text-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-4 overflow-visible sm:gap-5">
          {/* Верх: кнопка + поиск — ширина как у ленты ниже */}
          <form onSubmit={onSearchSubmit} className="flex w-full flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-4">
            <button
              type="button"
              onClick={toggleCategoryPicker}
              aria-expanded={categoryPickerOpen}
              aria-controls="market-all-categories-panel"
              aria-label={categoryPickerOpen ? 'Закрыть список категорий' : 'Открыть все категории'}
              className={`flex shrink-0 items-center justify-center gap-2 border-2 border-black bg-white px-4 py-3 uppercase tracking-wide transition-colors hover:bg-neutral-100 sm:w-[11rem] sm:rounded-md ${
                categoryPickerOpen ? categorySelectedShadowClass : 'sketch-shadow-sm'
              }`}
            >
              {categoryPickerOpen ? (
                <X size={20} strokeWidth={2.5} className="shrink-0 text-black" aria-hidden />
              ) : (
                <LayoutGrid size={18} strokeWidth={2.5} className="shrink-0" aria-hidden />
              )}
              <span className="whitespace-nowrap text-sm font-extrabold leading-tight sm:text-[0.95rem]">
                Все категории
              </span>
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
                className="shrink-0 border-l-2 border-black bg-white px-4 py-3 text-sm font-bold text-black hover:bg-neutral-50 sm:px-6"
              >
                Найти
              </button>
            </div>
          </form>

          {/* Только карточки в ленте; «Все категории» — вне flex-ряда (absolute), не тянет высоту ленты */}
          <div className="relative w-full overflow-visible px-0.5 pb-1 sm:px-1 sm:pb-0">
            <div className="flex w-full gap-2.5 overflow-x-auto pb-1 [scrollbar-width:thin] sm:gap-3 sm:overflow-visible sm:pb-0">
              {CATEGORY_RIBBON.map(cat => {
                const active = selectedRibbonId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedRibbonId(cat.id);
                      setCategoryPickerOpen(false);
                    }}
                    className={`flex min-w-[4.75rem] shrink-0 flex-col overflow-hidden rounded-xl border-2 border-black bg-white transition-[transform,box-shadow] duration-200 sm:min-w-0 sm:flex-1 ${
                      active
                        ? `${categorySelectedShadowClass} hover:-translate-y-0.5`
                        : 'sketch-shadow-sm hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="grid aspect-[4/3] min-h-[4.25rem] w-full place-items-center overflow-hidden bg-white p-2 sm:min-h-[5rem] sm:p-2.5">
                      <img
                        src={cat.thumb}
                        alt=""
                        className="min-h-0 min-w-0 max-h-full max-w-full object-contain object-center mix-blend-multiply select-none"
                        width={480}
                        height={360}
                        decoding="async"
                        draggable={false}
                      />
                    </div>
                    <div className="flex items-center justify-center gap-1 border-t-2 border-solid border-black/30 bg-white px-1.5 py-2 sm:px-2 sm:py-2.5">
                      <span className="w-full text-center text-[9px] font-bold leading-tight text-black sm:text-[10px]">
                        {cat.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {!categoryPickerOpen && (
              <button
                type="button"
                onClick={toggleCategoryPicker}
                aria-expanded={false}
                aria-controls="market-all-categories-panel"
                aria-label="Открыть все категории"
                className="absolute left-full top-0 bottom-0 z-[2] ml-2 flex w-[4.75rem] flex-col items-center justify-center gap-2 rounded-l-none rounded-r-xl border-2 border-black bg-white px-2 text-center sketch-shadow-sm transition-opacity hover:bg-neutral-50 sm:ml-2.5 sm:w-[5.5rem] sm:px-2.5"
              >
                <span className="max-w-[4.5rem] text-center text-[10px] font-extrabold leading-snug text-black sm:max-w-none sm:text-[11px] sm:leading-tight">
                  Все категории
                </span>
                <ChevronDown size={18} strokeWidth={2.5} className="shrink-0 text-black" aria-hidden />
              </button>
            )}
          </div>

          <div
            className={`grid w-full transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
              categoryPickerOpen ? 'grid-rows-[1fr] overflow-visible' : 'grid-rows-[0fr] overflow-hidden'
            }`}
          >
            <div
              className={`min-h-0 ${categoryPickerOpen ? 'overflow-visible' : 'overflow-hidden'}`}
            >
              <div
                id="market-all-categories-panel"
                className={`mt-0 w-full px-0.5 pt-2 pb-8 transition-opacity duration-300 ease-out motion-reduce:transition-none sm:px-1 sm:pb-9 ${
                  categoryPickerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
                role="region"
                aria-hidden={!categoryPickerOpen}
                aria-label="Категории"
              >
                <div
                  className="market-category-picker-grid grid w-full gap-2 sm:gap-3"
                  style={{
                    gridTemplateColumns: `repeat(${allCategoriesPickerItems.length}, minmax(0, 1fr))`,
                  }}
                >
                    {allCategoriesPickerItems.map(cat => {
                      const active = selectedRibbonId === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => selectCategoryFromPicker(cat.id)}
                          className={`flex min-w-0 w-full flex-col overflow-hidden rounded-xl border-2 border-black bg-white transition-[transform,box-shadow] duration-200 ease-out motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                            active
                              ? `${categorySelectedShadowClass} hover:-translate-y-0.5`
                              : 'sketch-shadow-sm hover:-translate-y-0.5'
                          }`}
                        >
                          <div className="grid aspect-[4/3] min-h-[2.75rem] w-full place-items-center overflow-hidden bg-white p-2 sm:min-h-[3.25rem] sm:p-2.5">
                            <img
                              src={cat.thumb}
                              alt=""
                              className="min-h-0 min-w-0 max-h-full max-w-full object-contain object-center mix-blend-multiply select-none"
                              width={480}
                              height={360}
                              decoding="async"
                              draggable={false}
                            />
                          </div>
                          <div className="flex min-h-[1.65rem] items-center justify-center border-t-2 border-solid border-black/30 bg-white px-1 py-1.5 sm:min-h-[1.85rem] sm:px-1.5 sm:py-2">
                            <span className="line-clamp-2 w-full text-center text-[8px] font-bold leading-tight text-black sm:text-[9px]">
                              {cat.label}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,17.5rem)_1fr] lg:items-start lg:gap-8">
          <MarketFiltersPanel
            allCategoriesActive={selectedRibbonId === 'all'}
            priceMin={filterPriceMin}
            priceMax={filterPriceMax}
            onPriceMinChange={setFilterPriceMin}
            onPriceMaxChange={setFilterPriceMax}
            condition={filterCondition}
            onConditionChange={setFilterCondition}
            sortBy={filterSort}
            onSortChange={setFilterSort}
            onQuickRange={applyQuickPriceRange}
            onReset={resetMarketFilters}
            onShowAllCategories={showAllCategories}
            apparelFilterCategory={apparelFilterCategory}
            sizeFilter={filterSize}
            onSizeFilterChange={setFilterSize}
            showFitFilter={showFitFilter}
            fitFilter={filterFit}
            onFitFilterChange={setFilterFit}
          />
          <div className="min-w-0">
            <div className="mb-4 border-b-2 border-black pb-3">
              <h2 className="text-xl font-black tracking-tight sm:text-2xl">Рекомендованные</h2>
            </div>
            {visibleListings.length === 0 ? (
              <MarketListingsEmpty hint="filters" />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visibleListings.map(product => (
                  <FleaMarketListingCard
                    key={product.id}
                    product={product}
                    inCart={isAuthenticated && isInCart(product.id)}
                    cartRequiresAuth={!isAuthenticated}
                    onToggleCart={handleToggleCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
