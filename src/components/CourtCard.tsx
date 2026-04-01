import { Clock3, MapPin, Phone, UserRound } from 'lucide-react';
import type { Court } from '../types';

interface CourtCardProps {
  court: Court;
}

function splitHours(hours: string) {
  const parts = hours.split(',').map(part => part.trim()).filter(Boolean);

  if (parts.length >= 2) {
    return parts.map(part => {
      const [label, value] = part.split(': ');
      return { label, value: value ?? '' };
    });
  }

  return [{ label: 'График', value: hours }];
}

export default function CourtCard({ court }: CourtCardProps) {
  const courtLabel = court.courts === 1 ? 'корт' : court.courts < 5 ? 'корта' : 'кортов';
  const hoursRows = splitHours(court.hours);

  return (
    <article className="overflow-hidden rounded-[1.35rem] border-2 border-black bg-white text-black sketch-shadow">
      <div className="relative h-64 overflow-hidden border-b-2 border-black bg-neutral-200">
        <img src={court.image} alt={court.name} className="h-full w-full object-cover" />
        <span className="absolute right-3 top-3 border-2 border-black bg-primary px-3 py-1 text-xs font-black text-black shadow-[2px_2px_0_0_#000]">
          {court.courts} {courtLabel}
        </span>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        <div>
          <h3 className="text-2xl font-black tracking-tight">{court.name}</h3>
        </div>

        <div className="space-y-3 text-[15px] leading-7 text-neutral-800">
          <div className="flex items-start gap-3">
            <MapPin size={18} strokeWidth={2.1} className="mt-1 shrink-0 text-black" />
            <span>{court.address}</span>
          </div>

          <div className="flex items-start gap-3">
            <UserRound size={18} strokeWidth={2.1} className="mt-1 shrink-0 text-black" />
            <div>
              <p>{court.coach}</p>
              <p className="text-neutral-600">{court.coachPhone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone size={18} strokeWidth={2.1} className="mt-1 shrink-0 text-black" />
            <a href={`tel:${court.phone}`} className="hover:underline">
              {court.phone}
            </a>
          </div>

        </div>

        <div className="border-t-2 border-black pt-4">
          <div className="mb-3 flex items-center gap-2">
            <Clock3 size={17} strokeWidth={2.1} className="shrink-0 text-black" />
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-neutral-500">
              Расписание
            </p>
          </div>

          <div className="space-y-2 text-sm sm:text-[15px]">
            {hoursRows.map(row => (
              <div key={`${court.id}-${row.label}`} className="grid grid-cols-[5.2rem_1fr] gap-3">
                <span className="font-bold text-neutral-700">{row.label}</span>
                <span className="text-neutral-900">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
