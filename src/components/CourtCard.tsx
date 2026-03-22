import { MapPin, Clock, Phone, User } from 'lucide-react';
import type { Court } from '../types';

interface CourtCardProps {
  court: Court;
}

export default function CourtCard({ court }: CourtCardProps) {
  const courtLabel =
    court.courts === 1 ? 'корт' : court.courts < 5 ? 'корта' : 'кортов';

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm card-hover border border-gray-100">
      <div className="relative h-48 overflow-hidden">
        <img
          src={court.image}
          alt={court.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-white font-bold text-lg">{court.name}</h3>
          <p className="text-white/80 text-xs flex items-center gap-1 mt-0.5">
            <MapPin size={12} />
            {court.address}
          </p>
        </div>
        <span className="absolute top-3 right-3 px-2.5 py-1 bg-primary text-white text-xs font-bold rounded-lg">
          {court.courts} {courtLabel}
        </span>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start gap-2.5 text-sm text-gray-600">
          <Clock size={16} className="text-primary mt-0.5 shrink-0" />
          <span>{court.hours}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-gray-600">
          <Phone size={16} className="text-primary shrink-0" />
          <a href={`tel:${court.phone}`} className="hover:text-primary transition-colors">
            {court.phone}
          </a>
        </div>
        <div className="pt-3 border-t border-gray-100">
          <p className="flex items-center gap-2 text-sm">
            <User size={16} className="text-accent shrink-0" />
            <span className="font-medium text-dark">{court.coach}</span>
          </p>
          <p className="text-xs text-gray-500 ml-6 mt-0.5">{court.coachPhone}</p>
        </div>
      </div>
    </div>
  );
}
