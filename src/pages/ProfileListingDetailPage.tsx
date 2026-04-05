import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { deleteProfileListingById, getProfileListingById } from '../services/profileListings';
import type { Product } from '../types';

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

const conditionLabel: Record<Product['condition'], string> = {
  new: 'Новое',
  used: 'Б/У',
};

export default function ProfileListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const numericId = id ? Number.parseInt(id, 10) : NaN;
  const product = Number.isFinite(numericId) ? getProfileListingById(numericId) : undefined;
  const galleryUrls = useMemo(
    () => (product ? [product.image, ...(product.extraImages ?? []).slice(0, 7)] : []),
    [product],
  );
  const [activeIndex, setActiveIndex] = useState(0);

  if (!product) {
    return (
      <div className="sketch-page min-h-[calc(100dvh-4.5rem)] w-full px-4 py-10 text-gray-900 sm:px-6">
        <p className="font-black text-lg">Объявление не найдено</p>
        <Link
          to="/profile"
          className="mt-4 inline-block border-2 border-black bg-white px-4 py-2 text-sm font-bold sketch-shadow-sm hover:bg-neutral-100"
        >
          К профилю
        </Link>
      </div>
    );
  }

  const showNav = galleryUrls.length > 1;
  const activeSrc = galleryUrls[activeIndex] ?? product.image;

  const handleDelete = () => {
    deleteProfileListingById(product.id);
    navigate('/profile');
  };

  return (
    <div className="sketch-page min-h-[calc(100dvh-4.5rem)] w-full text-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Link
          to="/profile"
          className="mb-6 inline-flex items-center gap-2 border-2 border-black bg-white px-3 py-2 text-sm font-bold sketch-shadow-sm hover:bg-neutral-100"
        >
          <ArrowLeft size={18} strokeWidth={2.5} aria-hidden />
          К моим объявлениям
        </Link>

        <h1 className="mb-8 text-xl font-black tracking-tight sm:text-2xl">{product.title}</h1>

        <div className="mb-6">
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-2 border-2 border-black bg-white px-4 py-2 text-sm font-bold text-red-600 sketch-shadow-sm transition-colors hover:bg-red-50"
          >
            <Trash2 size={16} strokeWidth={2.2} />
            Удалить объявление
          </button>
        </div>

        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-x-10">
          <div className="flex min-h-0 w-full min-w-0 shrink-0 gap-3 sm:gap-4 lg:max-w-[min(100%,520px)] lg:items-stretch">
            {showNav ? (
              <div className="flex shrink-0 flex-col gap-2 sm:gap-2.5">
                {galleryUrls.map((src, index) => (
                  <button
                    key={`${src}-${index}`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-md border-2 border-black bg-white sm:h-14 sm:w-14 ${
                      activeIndex === index ? 'ring-2 ring-primary ring-offset-2 ring-offset-[#e8e8e8]' : ''
                    }`}
                    aria-label={`Фото ${index + 1} из ${galleryUrls.length}`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}

            <div className="relative min-h-[320px] min-w-0 flex-1 overflow-hidden rounded-md border-2 border-black bg-gray-100">
            <img
              src={activeSrc}
              alt={product.title}
              className="h-full w-full object-cover"
              width={900}
              height={900}
            />
              {showNav ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveIndex(index => (index - 1 + galleryUrls.length) % galleryUrls.length)
                    }
                    className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center border-2 border-black bg-white/95 text-black hover:bg-neutral-100"
                    aria-label="Предыдущее фото"
                  >
                    <ChevronLeft size={22} strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(index => (index + 1) % galleryUrls.length)}
                    className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center border-2 border-black bg-white/95 text-black hover:bg-neutral-100"
                    aria-label="Следующее фото"
                  >
                    <ChevronRight size={22} strokeWidth={2.5} />
                  </button>
                  <span className="pointer-events-none absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded border border-black bg-white/95 px-2 py-0.5 text-[10px] font-bold tabular-nums text-neutral-700">
                    {activeIndex + 1} / {galleryUrls.length}
                  </span>
                </>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="mb-2 inline-block border-b border-dashed border-black/30 pb-1 text-[10px] font-black uppercase tracking-[0.22em] text-neutral-500">
                  {categoryLabel[product.category]}
                </p>
                <h2 className="text-2xl font-black tracking-tight">{product.title}</h2>
              </div>

              <div className="inline-flex min-w-[9rem] flex-col items-center rounded-full border-2 border-black bg-white px-4 py-2 shadow-[3px_3px_0_0_#000]">
                <span className="text-[9px] font-black uppercase tracking-[0.22em] text-neutral-500">Цена</span>
                <span className="mt-0.5 text-lg font-black tabular-nums">{product.price} MDL</span>
              </div>
            </div>

            <section className="border-2 border-black bg-white p-4 sketch-shadow-sm" aria-labelledby="profile-listing-specs">
              <h2
                id="profile-listing-specs"
                className="mb-3 text-center text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600"
              >
                Основные характеристики
              </h2>

              <dl className="space-y-0 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 py-2">
                  <dt className="font-bold text-neutral-600">Категория</dt>
                  <dd className="font-semibold text-gray-900">{categoryLabel[product.category]}</dd>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 py-2">
                  <dt className="font-bold text-neutral-600">Состояние</dt>
                  <dd className="font-semibold text-gray-900">{conditionLabel[product.condition]}</dd>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 py-2">
                  <dt className="font-bold text-neutral-600">Цвет</dt>
                  <dd className="font-semibold text-gray-900">{product.colorLabel ?? '—'}</dd>
                </div>
                {product.gender ? (
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 py-2">
                    <dt className="font-bold text-neutral-600">Пол</dt>
                    <dd className="font-semibold text-gray-900">
                      {product.gender === 'mens'
                        ? 'Мужское'
                        : product.gender === 'womens'
                          ? 'Женское'
                          : 'Унисекс'}
                    </dd>
                  </div>
                ) : null}
                {product.sizeLabel ? (
                  <div className="flex flex-wrap items-center justify-between gap-4 py-2">
                    <dt className="font-bold text-neutral-600">Размер</dt>
                    <dd className="font-semibold text-gray-900">{product.sizeLabel}</dd>
                  </div>
                ) : null}
              </dl>
            </section>
          </div>
        </div>

        <section className="mt-10 rounded-md border-2 border-black bg-white p-4 sketch-shadow sm:p-6" aria-labelledby="profile-listing-desc">
          <h2
            id="profile-listing-desc"
            className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600"
          >
            Описание
          </h2>
          <p className="text-sm leading-relaxed text-neutral-800 sm:text-base">{product.description}</p>
        </section>
      </div>
    </div>
  );
}
