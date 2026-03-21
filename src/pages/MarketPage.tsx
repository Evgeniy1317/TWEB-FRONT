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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-dark mb-2">Барахолка</h1>
        <p className="text-gray-500">Экипировка от бадминтонистов для бадминтонистов</p>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all
            ${showFilters || activeFilters > 0
              ? 'bg-primary/10 border-primary/30 text-primary-dark'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
        >
          <SlidersHorizontal size={16} />
          <span className="hidden sm:inline">Фильтры</span>
          {activeFilters > 0 && (
            <span className="w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
              {activeFilters}
            </span>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside
          className={`lg:w-64 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}
        >
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-dark">Фильтры</h3>
              {activeFilters > 0 && (
                <button
                  onClick={() => { setCategory('all'); setCondition('all'); }}
                  className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                >
                  <X size={12} /> Сбросить
                </button>
              )}
            </div>

            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Категория
              </p>
              <div className="space-y-1">
                {categories.map(c => (
                  <button
                    key={c.value}
                    onClick={() => setCategory(c.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all
                      ${category === c.value
                        ? 'bg-primary/10 text-primary-dark font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Состояние
              </p>
              <div className="space-y-1">
                {conditions.map(c => (
                  <button
                    key={c.value}
                    onClick={() => setCondition(c.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all
                      ${condition === c.value
                        ? 'bg-primary/10 text-primary-dark font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <p className="text-sm text-gray-400 mb-4">
            {filtered.length} {filtered.length === 1 ? 'товар' : 'товаров'}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">Ничего не найдено</p>
              <p className="text-gray-300 text-sm mt-1">Попробуйте изменить фильтры</p>
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
  );
}
