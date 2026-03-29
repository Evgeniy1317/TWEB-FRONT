import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/mockData';

interface FilterOption {
  value: string;
  label: string;
}

const categories: FilterOption[] = [
  { value: 'all', label: 'Все' },
  { value: 'rackets', label: 'Ракетки' },
  { value: 'shoes', label: 'Обувь' },
  { value: 'shuttlecocks', label: 'Воланы' },
  { value: 'accessories', label: 'Аксессуары' },
];

const conditions: FilterOption[] = [
  { value: 'all', label: 'Все' },
  { value: 'new', label: 'Новое' },
  { value: 'used', label: 'Б/У' },
];

export default function MarketPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [condition, setCondition] = useState('all');
  const [favorites, setFavorites] = useState<number[]>([1, 3]);
  const [showFilters, setShowFilters] = useState(false);

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchCategory = category === 'all' || p.category === category;
      const matchCondition = condition === 'all' || p.condition === condition;
      const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchCondition && matchSearch;
    });
  }, [category, condition, search]);

  const activeFilters = (category !== 'all' ? 1 : 0) + (condition !== 'all' ? 1 : 0);

  const filterBtnClass = (active: boolean) =>
    `w-full text-left px-3 py-2 text-xs font-bold border-2 border-black rounded-sm transition-colors ${
      active ? 'bg-black text-white sketch-shadow-sm' : 'bg-white hover:bg-neutral-100'
    }`;

  return (
    <div className="sketch-page min-h-[calc(100dvh-4.5rem)] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8 border-2 border-black bg-white sketch-shadow rounded-md p-4 sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-2">
            Sketching Kit · маркет
          </p>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Барахолка</h1>
          <p className="text-sm text-neutral-600 mt-2 max-w-xl border-l-4 border-black pl-3">
            Экипировка от бадминтонистов для бадминтонистов
          </p>
        </header>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 flex border-2 border-black bg-white sketch-shadow rounded-md overflow-hidden">
            <div className="flex items-center justify-center px-3 border-r-2 border-black bg-neutral-100 shrink-0">
              <Search size={18} strokeWidth={2.5} className="text-black" />
            </div>
            <input
              type="search"
              placeholder="Поиск по названию..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="sketch-input flex-1 min-w-0 px-3 py-3 text-sm font-mono bg-white border-0 focus:ring-0 placeholder:text-neutral-400"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 px-5 py-3 border-2 border-black rounded-md text-xs font-bold uppercase tracking-wide sketch-shadow transition-colors sm:shrink-0 ${
              showFilters || activeFilters > 0
                ? 'bg-black text-white'
                : 'bg-white hover:bg-neutral-100'
            }`}
          >
            <SlidersHorizontal size={18} strokeWidth={2.5} />
            <span className="hidden sm:inline">Фильтры</span>
            {activeFilters > 0 && (
              <span className="min-w-[1.25rem] h-5 px-1 border-2 border-black bg-white text-black text-[10px] font-black flex items-center justify-center rounded-sm">
                {activeFilters}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside
            className={`lg:w-72 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}
          >
            <div className="border-2 border-black bg-white sketch-shadow rounded-md p-4 lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-dashed border-black">
                <h2 className="text-sm font-black uppercase tracking-wider">Фильтры</h2>
                {activeFilters > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setCategory('all');
                      setCondition('all');
                    }}
                    className="text-[10px] font-bold uppercase flex items-center gap-1 border-2 border-black px-2 py-1 rounded-sm bg-white hover:bg-neutral-100"
                  >
                    <X size={12} strokeWidth={3} /> Сброс
                  </button>
                )}
              </div>

              <div className="mb-5">
                <p className="text-[10px] font-black uppercase tracking-widest mb-2 border-l-4 border-black pl-2">
                  Категория
                </p>
                <div className="flex flex-col gap-1.5">
                  {categories.map(c => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setCategory(c.value)}
                      className={filterBtnClass(category === c.value)}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-2 border-l-4 border-black pl-2">
                  Состояние
                </p>
                <div className="flex flex-col gap-1.5">
                  {conditions.map(c => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setCondition(c.value)}
                      className={filterBtnClass(condition === c.value)}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider border-2 border-black bg-white sketch-shadow-sm px-3 py-2 rounded-sm w-fit">
              <span className="w-2 h-2 bg-black rounded-full" aria-hidden />
              {filtered.length}{' '}
              {filtered.length === 1 ? 'товар' : filtered.length < 5 ? 'товара' : 'товаров'}
            </div>

            {filtered.length === 0 ? (
              <div className="border-2 border-black bg-white sketch-shadow rounded-md p-12 text-center">
                <p className="font-black text-lg mb-2">Ничего не найдено</p>
                <p className="text-sm text-neutral-600 font-mono">
                  Попробуйте изменить фильтры или запрос
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
