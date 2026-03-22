import CourtCard from '../components/CourtCard';
import { courts } from '../data/mockData';
import { MapPin } from 'lucide-react';

export default function CourtsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-dark mb-2">Залы Кишинёва</h1>
        <p className="text-gray-500 flex items-center gap-1.5">
          <MapPin size={16} />
          Все бадминтонные площадки города
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {courts.map(court => (
          <CourtCard key={court.id} court={court} />
        ))}
      </div>
    </div>
  );
}
