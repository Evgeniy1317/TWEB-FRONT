import { LayoutGrid, SlidersHorizontal } from 'lucide-react';
import type { ProductFit } from '../types';
import { FIT_FORM_OPTIONS, SIZE_OPTIONS_BY_CATEGORY } from '../utils/productCategoryFields';

export type MarketConditionFilter = 'all' | 'new' | 'used';
export type MarketSortOption = 'default' | 'price_asc' | 'price_desc';

type ApparelCategory = 'shoes' | 'clothing' | 'socks';

type MarketFiltersPanelProps = {
  priceMin: string;
  priceMax: string;
  onPriceMinChange: (v: string) => void;
  onPriceMaxChange: (v: string) => void;
  condition: MarketConditionFilter;
  onConditionChange: (v: MarketConditionFilter) => void;
  sortBy: MarketSortOption;
  onSortChange: (v: MarketSortOption) => void;
  onQuickRange: (min: number, max: number | null) => void;
  onReset: () => void;
  /** Показать объявления по всем категориям */
  onShowAllCategories: () => void;
  /** Подсветка «Все категории», когда выбран полный каталог */
  allCategoriesActive?: boolean;
  /** Показать размер (обувь, одежда, носки) */
  apparelFilterCategory?: ApparelCategory | null;
  sizeFilter: string;
  onSizeFilterChange: (v: string) => void;
  /** Фильтр «для кого» (обувь, одежда, носки, сумки, бандажи; на «все категории» — по полю fit у подходящих товаров) */
  showFitFilter?: boolean;
  fitFilter: ProductFit | '';
  onFitFilterChange: (v: ProductFit | '') => void;
};

const sortOptions: { id: MarketSortOption; label: string }[] = [
  { id: 'default', label: 'Как есть' },
  { id: 'price_asc', label: 'Сначала дешевле' },
  { id: 'price_desc', label: 'Сначала дороже' },
];

const conditionOptions: { id: MarketConditionFilter; label: string }[] = [
  { id: 'all', label: 'Любое' },
  { id: 'new', label: 'Новое' },
  { id: 'used', label: 'Б/у' },
];

function FilterFields({
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
  condition,
  onConditionChange,
  sortBy,
  onSortChange,
  onQuickRange,
  onReset,
  onShowAllCategories,
  allCategoriesActive = false,
  apparelFilterCategory = null,
  sizeFilter,
  onSizeFilterChange,
  showFitFilter = false,
  fitFilter,
  onFitFilterChange,
}: MarketFiltersPanelProps) {
  const sizeChips = apparelFilterCategory ? SIZE_OPTIONS_BY_CATEGORY[apparelFilterCategory] : [];

  const fitChips: { id: ProductFit | ''; label: string }[] = [
    { id: '', label: 'Любой' },
    ...FIT_FORM_OPTIONS.map(o => ({ id: o.value, label: o.label })),
  ];

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">Категория</p>
        <button
          type="button"
          onClick={onShowAllCategories}
          className={`flex w-full items-center gap-2 border-2 border-black px-2.5 py-2.5 text-left text-xs font-bold transition-colors hover:bg-neutral-100 ${
            allCategoriesActive ? 'bg-primary sketch-shadow-sm' : 'bg-white'
          }`}
        >
          <LayoutGrid size={16} strokeWidth={2.5} className="shrink-0 text-black" aria-hidden />
          Все категории
        </button>
      </div>

      {apparelFilterCategory ? (
        <div className="border-t-2 border-dashed border-neutral-200 pt-5">
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">Размер</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => onSizeFilterChange('')}
              className={`border-2 border-black px-2 py-1 text-[10px] font-black uppercase tracking-wide ${
                sizeFilter === '' ? 'bg-primary sketch-shadow-sm' : 'bg-white hover:bg-neutral-100'
              }`}
            >
              Любой
            </button>
            {sizeChips.map(sz => (
              <button
                key={sz}
                type="button"
                onClick={() => onSizeFilterChange(sz)}
                className={`border-2 border-black px-2 py-1 text-[10px] font-black uppercase tracking-wide ${
                  sizeFilter === sz ? 'bg-primary sketch-shadow-sm' : 'bg-white hover:bg-neutral-100'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {showFitFilter ? (
        <div className="border-t-2 border-dashed border-neutral-200 pt-5">
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">Для кого</p>
          <div className="flex flex-wrap gap-1.5">
            {fitChips.map(chip => (
              <button
                key={chip.id === '' ? 'any' : chip.id}
                type="button"
                onClick={() => onFitFilterChange(chip.id)}
                className={`border-2 border-black px-2 py-1 text-[10px] font-black uppercase tracking-wide ${
                  fitFilter === chip.id ? 'bg-primary sketch-shadow-sm' : 'bg-white hover:bg-neutral-100'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">Сортировка</p>
        <div className="flex flex-col gap-1.5">
          {sortOptions.map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSortChange(opt.id)}
              className={`w-full border-2 border-black px-2.5 py-2 text-left text-xs font-bold transition-colors ${
                sortBy === opt.id
                  ? 'bg-primary text-black sketch-shadow-sm'
                  : 'bg-white hover:bg-neutral-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">Цена, MDL</p>
        <div className="flex gap-2">
          <label className="min-w-0 flex-1">
            <span className="sr-only">От</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="От"
              value={priceMin}
              onChange={e => onPriceMinChange(e.target.value)}
              className="input-no-spin sketch-input w-full border-2 border-black bg-white px-2 py-2 text-sm font-bold tabular-nums placeholder:font-normal placeholder:text-neutral-400"
            />
          </label>
          <label className="min-w-0 flex-1">
            <span className="sr-only">До</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="До"
              value={priceMax}
              onChange={e => onPriceMaxChange(e.target.value)}
              className="input-no-spin sketch-input w-full border-2 border-black bg-white px-2 py-2 text-sm font-bold tabular-nums placeholder:font-normal placeholder:text-neutral-400"
            />
          </label>
        </div>
        <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-neutral-500">Быстрый диапазон</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {[
            { label: 'до 500', min: 0, max: 500 },
            { label: '500–2 тыс.', min: 500, max: 2000 },
            { label: 'от 2 000', min: 2000, max: null },
          ].map(chip => (
            <button
              key={chip.label}
              type="button"
              onClick={() => onQuickRange(chip.min, chip.max)}
              className="border-2 border-black bg-white px-2 py-1 text-[10px] font-black uppercase tracking-wide hover:bg-neutral-100"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">Состояние</p>
        <div className="flex flex-col gap-1.5">
          {conditionOptions.map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onConditionChange(opt.id)}
              className={`w-full border-2 border-black px-2.5 py-2 text-left text-xs font-bold transition-colors ${
                condition === opt.id
                  ? 'bg-primary text-black sketch-shadow-sm'
                  : 'bg-white hover:bg-neutral-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="w-full border-2 border-dashed border-black bg-neutral-100 py-2.5 text-xs font-black uppercase tracking-wide text-neutral-800 hover:bg-neutral-200"
      >
        Сбросить фильтры
      </button>
    </div>
  );
}

export default function MarketFiltersPanel(props: MarketFiltersPanelProps) {
  const {
    priceMin,
    priceMax,
    onPriceMinChange,
    onPriceMaxChange,
    condition,
    onConditionChange,
    sortBy,
    onSortChange,
    onQuickRange,
    onReset,
    onShowAllCategories,
    allCategoriesActive = false,
    apparelFilterCategory = null,
    sizeFilter,
    onSizeFilterChange,
    showFitFilter = false,
    fitFilter,
    onFitFilterChange,
  } = props;

  return (
    <aside className="w-full shrink-0 border-2 border-black bg-white p-4 sketch-shadow-sm lg:w-auto">
      <div className="mb-4 flex items-center gap-2 border-b-2 border-black pb-3">
        <SlidersHorizontal size={18} strokeWidth={2.5} className="shrink-0" aria-hidden />
        <h3 className="text-sm font-black uppercase tracking-wide">Фильтры</h3>
      </div>
      <FilterFields
        priceMin={priceMin}
        priceMax={priceMax}
        onPriceMinChange={onPriceMinChange}
        onPriceMaxChange={onPriceMaxChange}
        condition={condition}
        onConditionChange={onConditionChange}
        sortBy={sortBy}
        onSortChange={onSortChange}
        onQuickRange={onQuickRange}
        onReset={onReset}
        onShowAllCategories={onShowAllCategories}
        allCategoriesActive={allCategoriesActive}
        apparelFilterCategory={apparelFilterCategory}
        sizeFilter={sizeFilter}
        onSizeFilterChange={onSizeFilterChange}
        showFitFilter={showFitFilter}
        fitFilter={fitFilter}
        onFitFilterChange={onFitFilterChange}
      />
    </aside>
  );
}
