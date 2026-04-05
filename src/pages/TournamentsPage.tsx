import { Calendar, ExternalLink, MapPin } from 'lucide-react';
import { tournaments } from '../data/mockData';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getLevelColor(level: string): string {
  if (level.includes('Начинающий')) return 'border-2 border-black bg-emerald-100 text-emerald-900';
  if (level.includes('Профессиональный')) return 'border-2 border-black bg-red-100 text-red-900';
  if (level.includes('Средний')) return 'border-2 border-black bg-amber-100 text-amber-900';
  return 'border-2 border-black bg-sky-100 text-sky-900';
}

export default function TournamentsPage() {
  return (
    <div className="sketch-page min-h-[calc(100dvh-4.5rem)] w-full text-black">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Турниры</h1>
          <p className="mt-2 text-sm text-neutral-700 sm:text-base">
            Предстоящие соревнования и регистрация
          </p>
        </div>

        <div className="space-y-5">
          {tournaments.map(t => (
            <article
              key={t.id}
              className="rounded-[1.35rem] border-2 border-black bg-white p-5 text-black sketch-shadow transition-transform hover:-translate-y-0.5 sm:p-6"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-black tracking-tight sm:text-2xl">{t.title}</h3>
                    <span
                      className={`px-2.5 py-1 text-[11px] font-black uppercase tracking-wide ${getLevelColor(t.level)}`}
                    >
                      {t.level}
                    </span>
                  </div>

                  <p className="mb-4 text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
                    {t.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-neutral-700 sm:text-[15px]">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={16} strokeWidth={2.2} className="text-black" />
                      {formatDate(t.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={16} strokeWidth={2.2} className="text-black" />
                      {t.location}
                    </span>
                  </div>
                </div>

                <a
                  href={t.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-2 border-2 border-black bg-primary px-5 py-3 text-sm font-black uppercase tracking-wide text-black sketch-shadow-sm transition-transform hover:-translate-y-0.5"
                >
                  Регистрация
                  <ExternalLink size={15} strokeWidth={2.3} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
