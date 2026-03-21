import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingBag,
  Wrench,
  MapPin,
  Trophy,
  User,
  Menu,
  X,
  LogIn,
  type LucideIcon,
} from 'lucide-react';

interface NavLink {
  to: string;
  label: string;
  icon: LucideIcon;
}

const navLinks: NavLink[] = [
  { to: '/market', label: 'Барахолка', icon: ShoppingBag },
  { to: '/stringing', label: 'Перетяжка', icon: Wrench },
  { to: '/courts', label: 'Залы', icon: MapPin },
  { to: '/tournaments', label: 'Турниры', icon: Trophy },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 glass shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <span className="text-white font-black text-sm">SH</span>
            </div>
            <span className="text-xl font-bold text-dark hidden sm:block">
              Smash<span className="text-primary">Hub</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all
                    ${isActive
                      ? 'bg-primary/10 text-primary-dark'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={isAuthenticated ? '/profile' : '/login'}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all
                ${isAuthenticated
                  ? 'bg-primary/10 text-primary-dark hover:bg-primary/20'
                  : 'bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg'
                }`}
            >
              {isAuthenticated ? <User size={16} /> : <LogIn size={16} />}
              <span className="hidden sm:inline">
                {isAuthenticated ? 'Профиль' : 'Войти'}
              </span>
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                    ${isActive
                      ? 'bg-primary/10 text-primary-dark'
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
