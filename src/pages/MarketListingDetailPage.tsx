import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getMarketSellerForProduct, products } from '../data/mockData';
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
  used: 'Б/у',
};

function telHref(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) return `tel:${cleaned}`;
  if (cleaned.length > 0) return `tel:+${cleaned}`;
  return 'tel:';
}

/** Плоский цвет кнопки под соцсеть */
function socialLinkClass(label: string): string {
  const s = label.toLowerCase();
  const base =
    'inline-flex border-2 border-black px-2.5 py-1 text-[11px] font-bold text-white shadow-[2px_2px_0_0_#000] hover:brightness-110';
  if (s.includes('telegram')) return `${base} bg-[#229ED9]`;
  if (s.includes('instagram')) return `${base} bg-[#E4405F]`;
  if (s.includes('viber')) return `${base} bg-[#7360F2]`;
  if (s.includes('facebook')) return `${base} bg-[#1877F2]`;
  if (s.includes('whatsapp')) return `${base} bg-[#25D366]`;
  return `${base} bg-neutral-600`;
}

/** Главное фото + до 6 дополнительных */
function buildGalleryUrls(product: Product): string[] {
  const extra = (product.extraImages ?? []).slice(0, 6);
  return [product.image, ...extra];
}

function buildSpecLines(product: Product): { label: string; value: string }[] {
  const lines: { label: string; value: string }[] = [
    { label: 'Категория', value: categoryLabel[product.category] },
    { label: 'Состояние', value: conditionLabel[product.condition] },
    { label: 'Цвет', value: product.colorLabel ?? '—' },
  ];
  if (product.gender) {
    const g =
      product.gender === 'mens'
        ? 'Мужское'
        : product.gender === 'womens'
          ? 'Женское'
          : 'Для всех';
    lines.push({ label: 'Пол', value: g });
  }
  if (product.sizeLabel) {
    lines.push({ label: 'Размер', value: product.sizeLabel });
  }
  return lines;
}

export default function MarketListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const numericId = id ? Number.parseInt(id, 10) : NaN;
  const product = Number.isFinite(numericId) ? products.find(p => p.id === numericId) : undefined;

  const galleryUrls = useMemo(() => (product ? buildGalleryUrls(product) : []), [product]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [contactsOpen, setContactsOpen] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
  }, [numericId]);

  const n = galleryUrls.length;
  const showNav = n > 1;

  const goPrev = () => {
    setActiveIndex(i => (i - 1 + n) % n);
  };
  const goNext = () => {
    setActiveIndex(i => (i + 1) % n);
  };

  if (!product) {
    return (
      <div className="sketch-page min-h-[calc(100dvh-4.5rem)] w-full px-4 py-10 text-gray-900 sm:px-6">
        <p className="font-black text-lg">Объявление не найдено</p>
        <Link
          to="/market"
          className="mt-4 inline-block border-2 border-black bg-white px-4 py-2 text-sm font-bold sketch-shadow-sm hover:bg-neutral-100"
        >
          К барахолке
        </Link>
      </div>
    );
  }

  const specLines = buildSpecLines(product);
  const seller = getMarketSellerForProduct(product.id);
  const activeSrc = galleryUrls[activeIndex] ?? product.image;

  return (
    <div className="sketch-page min-h-[calc(100dvh-4.5rem)] w-full text-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Link
          to="/market"
          className="mb-6 inline-flex items-center gap-2 border-2 border-black bg-white px-3 py-2 text-sm font-bold sketch-shadow-sm hover:bg-neutral-100"
        >
          <ArrowLeft size={18} strokeWidth={2.5} aria-hidden />
          К списку
        </Link>

        <h1 className="mb-8 text-xl font-black tracking-tight sm:text-2xl">{product.title}</h1>

        {/* lg: grid даёт ячейке справа явную высоту строки — тогда mt-auto у характеристик реально прижимает блок к низу фото */}
        <div className="flex flex-col gap-8 lg:grid lg:min-h-0 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-stretch lg:gap-x-10 lg:gap-y-0">
          {/* Галерея */}
          <div className="flex min-h-0 w-full min-w-0 shrink-0 gap-3 sm:gap-4 lg:max-w-[min(100%,520px)] lg:min-h-0 lg:items-stretch">
            {showNav ? (
              <div className="flex shrink-0 flex-col justify-start gap-2 sm:gap-2.5 lg:min-h-0 lg:self-stretch">
                {galleryUrls.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-md border-2 border-black bg-white sm:h-14 sm:w-14 ${
                      activeIndex === i ? 'ring-2 ring-primary ring-offset-2 ring-offset-[#e8e8e8]' : ''
                    }`}
                    aria-label={`Фото ${i + 1} из ${n}`}
                    aria-current={activeIndex === i}
                  >
                    <img
                      src={src}
                      alt=""
                      className="h-full w-full object-cover"
                      width={56}
                      height={56}
                      decoding="async"
                      draggable={false}
                    />
                  </button>
                ))}
              </div>
            ) : null}

            <div
              className={`relative min-h-[280px] min-w-0 flex-1 overflow-hidden rounded-md border-2 border-black bg-gray-100 sm:min-h-[360px] lg:h-full lg:min-h-0 lg:w-[min(100%,420px)] ${showNav ? '' : 'w-full'}`}
            >
              <img
                src={activeSrc}
                alt={product.title}
                className="h-full w-full object-cover"
                width={800}
                height={800}
                decoding="async"
                draggable={false}
              />
              {showNav ? (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center border-2 border-black bg-white/95 text-black hover:bg-neutral-100"
                    aria-label="Предыдущее фото"
                  >
                    <ChevronLeft size={22} strokeWidth={2.5} aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center border-2 border-black bg-white/95 text-black hover:bg-neutral-100"
                    aria-label="Следующее фото"
                  >
                    <ChevronRight size={22} strokeWidth={2.5} aria-hidden />
                  </button>
                  <span className="pointer-events-none absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded border border-black bg-white/95 px-2 py-0.5 text-[10px] font-bold tabular-nums text-neutral-700">
                    {activeIndex + 1} / {n}
                  </span>
                </>
              ) : null}
            </div>
          </div>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:min-h-0 lg:h-full lg:w-full lg:min-w-0">
            <div className="flex shrink-0 flex-col gap-3">
            <div className="flex w-full min-w-0 shrink-0 flex-wrap items-center gap-x-2 gap-y-2 sm:gap-x-3">
              <div className="inline-flex max-w-[13rem] min-w-0 flex-col items-center rounded-full border-2 border-black bg-white px-4 py-2 shadow-[3px_3px_0_0_#000] ring-1 ring-inset ring-black/[0.06] sm:px-5 sm:py-2.5">
                <span className="text-[9px] font-black uppercase tracking-[0.22em] text-neutral-500">Цена</span>
                <span className="mt-0.5 text-center text-base font-black tabular-nums leading-none tracking-tight text-gray-900 sm:text-lg">
                  {product.price.toLocaleString('ro-MD')} MDL
                </span>
              </div>

              <button
                type="button"
                onClick={() => setContactsOpen(o => !o)}
                aria-expanded={contactsOpen}
                className="ml-auto shrink-0 border-2 border-black bg-primary px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-black shadow-[2px_2px_0_0_#000] hover:bg-[#00C853] sm:px-3.5 sm:py-2 sm:text-xs"
              >
                {contactsOpen ? 'Скрыть контакты' : 'Показать контакты продавца'}
              </button>
            </div>

            {/* Фиксированная зона: пусто до открытия, блок характеристик ниже не сдвигается */}
            <div className="h-[7rem] w-full shrink-0">
              {contactsOpen ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 overflow-y-auto border-2 border-black bg-white px-3 py-2.5 sketch-shadow-sm sm:gap-2.5 sm:px-4">
                  <span className="sr-only">Контакты продавца {seller.name}</span>
                  {seller.phone ? (
                    <div className="flex w-full shrink-0 items-center gap-2">
                      <div className="h-px min-w-0 flex-1 border-t border-dashed border-neutral-600" aria-hidden />
                      <a
                        href={telHref(seller.phone)}
                        className="shrink-0 text-sm font-black tabular-nums text-gray-900 underline decoration-2 underline-offset-2 hover:text-primary"
                      >
                        {seller.phone}
                      </a>
                      <div className="h-px min-w-0 flex-1 border-t border-dashed border-neutral-600" aria-hidden />
                    </div>
                  ) : null}
                  {seller.links.length > 0 ? (
                    <div className="flex w-full flex-wrap items-center justify-center gap-2">
                      {seller.links.map(link => (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={socialLinkClass(link.label)}
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
            </div>

            <section
              className="mt-auto flex w-full shrink-0 flex-col border-2 border-black bg-white p-4 sketch-shadow-sm"
              aria-labelledby="listing-specs"
            >
              <h2
                id="listing-specs"
                className="mb-2.5 shrink-0 text-center text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600"
              >
                Основные характеристики
              </h2>

              <dl className="w-full space-y-0 text-sm">
                {specLines.map(row => (
                  <div
                    key={row.label}
                    className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-neutral-200 py-2 text-left last:border-b-0"
                  >
                    <dt className="font-bold text-neutral-600">{row.label}</dt>
                    <dd className="text-right font-semibold text-gray-900">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </div>

        <section
          className="mt-10 border-2 border-black bg-white p-4 sm:p-6 sketch-shadow rounded-md"
          aria-labelledby="listing-desc"
        >
          <h2 id="listing-desc" className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">
            Описание
          </h2>
          <p className="text-sm leading-relaxed text-neutral-800 sm:text-base">{product.description}</p>
        </section>
      </div>
    </div>
  );
}
