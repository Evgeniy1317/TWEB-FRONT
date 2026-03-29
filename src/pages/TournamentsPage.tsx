import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { tournaments } from '../data/mockData';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getLevelColor(level: string): string {
  if (level.includes('Начинающий')) return 'bg-emerald-50 text-emerald-700';
  if (level.includes('Профессиональный')) return 'bg-red-50 text-red-600';
  if (level.includes('Средний')) return 'bg-amber-50 text-amber-700';
  return 'bg-blue-50 text-blue-600';
}

export default function TournamentsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Турниры</h1>
        <p className="text-gray-400">Предстоящие соревнования и регистрация</p>
      </div>

      <div className="space-y-4">
        {tournaments.map(t => (
          <div
            key={t.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 card-hover"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-bold text-dark text-lg">{t.title}</h3>
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${getLevelColor(t.level)}`}>
                    {t.level}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-3">{t.description}</p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary" />
                    {formatDate(t.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-primary" />
                    {t.location}
                  </span>
                </div>
              </div>

              <a
                href={t.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-md hover:shadow-lg shrink-0 text-sm"
              >
                Регистрация
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
