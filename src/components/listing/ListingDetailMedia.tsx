import { ChevronLeft, ChevronRight } from 'lucide-react';

type ListingDetailMediaProps = {
  galleryUrls: string[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  productTitle: string;
};

/**
 * Галерея объявления: фиксированное квадратное окно превью (aspect-square), без скачков при смене фото.
 */
export function ListingDetailMedia({
  galleryUrls,
  activeIndex,
  onActiveIndexChange,
  productTitle,
}: ListingDetailMediaProps) {
  const n = galleryUrls.length;
  const showNav = n > 1;
  const activeSrc = galleryUrls[activeIndex] ?? galleryUrls[0] ?? '';

  const goPrev = () => onActiveIndexChange((activeIndex - 1 + n) % n);
  const goNext = () => onActiveIndexChange((activeIndex + 1) % n);

  return (
    <div className="listing-detail-media flex min-h-0 w-full min-w-0 shrink-0 gap-3 sm:gap-4 lg:max-w-[min(100%,520px)] lg:min-h-0 lg:items-stretch">
      {showNav ? (
        <div className="listing-detail-media-thumbs flex shrink-0 flex-col justify-start gap-2 sm:gap-2.5 lg:min-h-0 lg:self-stretch">
          {galleryUrls.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => onActiveIndexChange(i)}
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
        className={`relative aspect-square w-full min-w-0 shrink-0 overflow-hidden rounded-md border-2 border-black bg-gray-100 lg:w-[420px] lg:max-w-[min(100%,420px)] lg:flex-none ${
          showNav ? '' : 'w-full'
        }`}
      >
        <img
          src={activeSrc}
          alt={productTitle}
          className="absolute inset-0 h-full w-full object-cover object-center"
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
  );
}
