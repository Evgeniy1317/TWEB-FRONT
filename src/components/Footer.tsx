import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-black text-xs">SM</span>
            </div>
            <span className="text-white font-bold">
              Smash<span className="text-primary">Market</span>
            </span>
          </div>

          <p className="text-sm flex items-center gap-1">
            Сделано с <Heart size={14} className="text-primary fill-primary" /> для бадминтонистов Кишинёва
          </p>

          <p className="text-xs text-gray-500">© 2026 SmashMarket</p>
        </div>
      </div>
    </footer>
  );
}
