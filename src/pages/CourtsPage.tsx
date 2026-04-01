import CourtCard from '../components/CourtCard';
import { courts } from '../data/mockData';
import { MapPin } from 'lucide-react';

export default function CourtsPage() {
  return (
    <div className="sketch-page min-h-[calc(100dvh-4.5rem)] w-full text-black">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Залы Кишинёва</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-neutral-700 sm:text-base">
            <MapPin size={16} strokeWidth={2.2} />
            Все бадминтонные площадки города
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {courts.map(court => (
            <CourtCard key={court.id} court={court} />
          ))}
        </div>
      </div>
    </div>
  );
}
