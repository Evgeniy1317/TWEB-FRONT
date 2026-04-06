import { ExternalLink, MapPin } from 'lucide-react';

const UPCOMING_POSTER_SRC = '/media/images/5377478215317787404.jpg';

/** Кнопка «Геолокация»: карты по клубу (текст адреса в блоке — как на афише, отдельно) */
const UPCOMING_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Badminton+club+Altius+Chisinau';

/** Регистрация / страница турнира на Tournament Software */
const TOURNAMENT_SOFTWARE_URL =
  'https://www.tournamentsoftware.com/tournament/8F4F64BC-3C9F-4A69-BE42-34EE7A6DAC54';

const UPCOMING_CATEGORIES = ['OPEN', 'A', 'B', 'C', 'U15', 'U13'] as const;

/** Прошедшие турниры: только афиши, порядок слева направо / сверху вниз */
const PAST_TOURNAMENT_POSTERS = [
  '/media/images/5377478215317787407.jpg',
  '/media/images/5377478215317787409.jpg',
  '/media/images/5377478215317787408.jpg',
] as const;

export default function TournamentsPage() {
  return (
    <div className="sketch-page min-h-[calc(100dvh-4.5rem)] w-full text-black">
      <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-5 sm:py-6">
        <h1 className="mb-4 text-center text-2xl font-black tracking-tight sm:text-3xl">Турниры</h1>

        {/* Предстоящие — как логин: слева фото на всю высоту ячейки, справа текст + кнопки внизу правой колонки */}
        <section className="w-full" aria-labelledby="tournaments-upcoming-title">
          <h2
            id="tournaments-upcoming-title"
            className="mb-3 text-center text-xl font-black sm:text-2xl"
          >
            Предстоящие турниры
          </h2>
          <div className="mx-auto w-full max-w-[min(94vw,860px)] overflow-hidden rounded-md border-2 border-black bg-white text-left sketch-shadow">
            <div className="grid min-h-0 w-full grid-cols-1 overflow-hidden md:grid-cols-2 md:items-stretch md:min-h-[min(480px,58vh)]">
              <div className="relative flex min-h-[min(36vh,240px)] w-full shrink-0 items-center justify-center overflow-hidden bg-neutral-100 p-2 md:min-h-0 md:h-full md:border-r-2 md:border-black/10 md:p-3">
                <img
                  src={UPCOMING_POSTER_SRC}
                  alt="Primăvara Chișinău — международный турнир по бадминтону, май 2026"
                  className="max-h-full max-w-full object-contain object-center"
                  width={1200}
                  height={750}
                  decoding="async"
                  loading="eager"
                />
              </div>

              <div className="flex min-h-0 min-w-0 flex-col border-t-2 border-black/10 md:h-full md:border-t-0">
                <div className="flex min-h-0 flex-1 flex-col md:min-h-full">
                  <div className="w-full space-y-4 px-5 py-5 sm:space-y-5 sm:px-7 sm:py-7">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black leading-tight tracking-tight text-gray-900 sm:text-3xl">
                        Primăvara Chișinău
                      </h3>
                      <p className="text-base leading-relaxed text-neutral-700 sm:text-lg">
                        Международный турнир по бадминтону (Republica Moldova, 2026).
                      </p>
                    </div>

                    <p className="text-base font-bold tabular-nums text-neutral-800 sm:text-lg">
                      <span className="font-black uppercase tracking-wide text-neutral-500">Даты: </span>
                      01.05.2026 — 03.05.2026
                    </p>

                    <div>
                      <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-neutral-500 sm:text-[13px]">
                        Категории
                      </p>
                      <div
                        className="flex flex-wrap items-center gap-y-2"
                        role="list"
                        aria-label="Категории турнира"
                      >
                        {UPCOMING_CATEGORIES.map((cat, index) => (
                          <span key={cat} className="inline-flex items-center" role="listitem">
                            {index > 0 ? (
                              <span
                                className="mx-2 h-5 w-px shrink-0 bg-black/30 sm:mx-2.5"
                                aria-hidden
                              />
                            ) : null}
                            <span className="text-base font-black tabular-nums text-gray-900 sm:text-lg">
                              {cat}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-base font-semibold leading-snug text-neutral-800 sm:text-[17px]">
                      str. Ion Creangă 1/2, sala sportivă UPS
                    </p>
                  </div>

                  <div className="mt-auto flex w-full flex-col gap-3 border-t border-black/15 px-5 pb-5 pt-6 sm:gap-3.5 sm:px-7 sm:pb-7 sm:pt-7">
                    <a
                      href={UPCOMING_MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-[3rem] w-full flex-col items-center justify-center gap-1 border-2 border-black bg-white px-4 py-2.5 text-center text-sm font-black uppercase tracking-wide text-black sketch-shadow-sm transition-transform hover:-translate-y-0.5 sm:min-h-[3.25rem] sm:text-base"
                    >
                      <span className="inline-flex items-center gap-2">
                        <MapPin size={18} strokeWidth={2.2} aria-hidden />
                        Геолокация
                      </span>
                      <span className="w-full px-1 text-center text-[10px] font-bold normal-case leading-tight text-neutral-600 sm:text-[11px]">
                        Badminton club Altius · Chișinău
                      </span>
                    </a>
                    <a
                      href={TOURNAMENT_SOFTWARE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-[3rem] w-full items-center justify-center gap-2 border-2 border-black bg-primary px-4 py-2.5 text-sm font-black uppercase tracking-wide text-black sketch-shadow-sm transition-transform hover:-translate-y-0.5 sm:min-h-[3.25rem] sm:text-base"
                    >
                      Турнир на сайте
                      <ExternalLink size={16} strokeWidth={2.3} aria-hidden />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Разделитель */}
        <div
          className="mx-auto my-8 h-px w-full max-w-6xl bg-black/25 sm:my-10"
          role="separator"
          aria-hidden
        />

        {/* Прошедшие — три одинаковые по размеру ячейки (обложка без пустот в рамке) */}
        <section aria-labelledby="tournaments-past-title">
          <h2
            id="tournaments-past-title"
            className="mb-4 text-center text-xl font-black sm:text-2xl"
          >
            Прошедшие турниры
          </h2>
          <div className="mx-auto grid w-full grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-4 lg:gap-5">
            {PAST_TOURNAMENT_POSTERS.map((src) => (
              <div
                key={src}
                className="relative aspect-[3/4] w-full overflow-hidden rounded-sm border-2 border-black bg-neutral-100 sketch-shadow-sm"
              >
                <img
                  src={src}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  decoding="async"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
