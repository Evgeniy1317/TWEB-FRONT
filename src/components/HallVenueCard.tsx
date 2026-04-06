import { MapPin } from 'lucide-react';
import type { HallVenue } from '../types';

interface HallVenueCardProps {
  venue: HallVenue;
}

export default function HallVenueCard({ venue }: HallVenueCardProps) {
  return (
    <article className="overflow-hidden rounded-[1.35rem] border-2 border-black bg-white text-black sketch-shadow">
      <div className="relative h-52 w-full overflow-hidden border-b-2 border-black bg-neutral-200 sm:h-56">
        <img
          src={venue.coverSrc}
          alt=""
          className="h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-black bg-white p-1">
            <img
              src={venue.logoSrc}
              alt=""
              className="max-h-full max-w-full object-contain object-center"
              width={120}
              height={120}
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            <h3 className="text-xl font-black leading-tight tracking-tight sm:text-2xl">{venue.name}</h3>

            <a
              href={venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full min-h-[2.75rem] items-center justify-center gap-2 border-2 border-black bg-primary px-4 py-2.5 text-sm font-black uppercase tracking-wide text-black sketch-shadow-sm transition-transform hover:-translate-y-0.5 hover:opacity-95 sm:w-auto sm:min-w-[12rem]"
            >
              <MapPin size={18} strokeWidth={2.2} aria-hidden />
              Геолокация
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
