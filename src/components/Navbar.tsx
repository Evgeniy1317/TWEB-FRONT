import { useState, useEffect, useRef, type MouseEvent } from 'react';
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
  UserPlus,
  Globe,
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

const languages = [
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
  { code: 'ro', label: 'Română' },
] as const;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<string>('ru');
  /** Только /market: прячем шапку при скролле вниз, показываем при скролле вверх */
  const [marketNavHidden, setMarketNavHidden] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const marketScrollLastY = useRef(0);
  const mobileOpenRef = useRef(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isMarket = location.pathname === '/market' || location.pathname.startsWith('/market/');
  const barVisible = !isHome || scrolled;

  mobileOpenRef.current = mobileOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setScrolled(window.scrollY > 10);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMarket) {
      setMarketNavHidden(false);
      marketScrollLastY.current = window.scrollY;
      return;
    }
    marketScrollLastY.current = window.scrollY;
    const onScroll = () => {
      if (mobileOpenRef.current) return;
      const y = window.scrollY;
      const prev = marketScrollLastY.current;
      const delta = y - prev;
      marketScrollLastY.current = y;
      if (y < 56) {
        setMarketNavHidden(false);
        return;
      }
      if (delta > 6) setMarketNavHidden(true);
      else if (delta < -6) setMarketNavHidden(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMarket]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLangChange = (code: string) => {
    setCurrentLang(code);
    setLangOpen(false);
    // TODO: интеграция i18n
  };

  const handleLogoClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === '/') {
      e.preventDefault();
      setMobileOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
        isMarket && marketNavHidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div
        className={`absolute inset-0 glass-dark pointer-events-none transition-opacity duration-150 ease-out ${
          barVisible ? 'opacity-100 shadow-lg' : 'opacity-0'
        }`}
      />
      <div className="relative px-4 sm:px-6">
        <div className="flex items-center h-[72px]">
          {/* Left — logo */}
          <div className="flex-1 flex items-center">
            <Link to="/" onClick={handleLogoClick} className="flex items-center gap-0.5 group">
              <img
                src="/media/images/background-removed.png"
                alt="SmashMarket"
                className="w-11 h-11 object-contain group-hover:scale-110 transition-transform"
              />
              <span className="text-2xl font-bold text-white hidden sm:block tracking-tight">
                Smash<span className="text-primary">Market</span>
              </span>
            </Link>
          </div>

          {/* Center — nav + lang */}
          <div className="hidden md:flex items-center bg-white/[0.06] rounded-none px-2 py-2">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2.5 px-6 py-2.5 rounded-none text-[15px] font-medium transition-all
                    ${isActive
                      ? 'bg-white/15 text-white'
                      : 'text-white hover:bg-white/10'
                    }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}

            <div className="w-px h-5 bg-white/15 mx-2" />

            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-none text-[15px] font-medium text-white hover:bg-white/10 transition-all"
              >
                <Globe size={18} />
                <span className="uppercase text-sm tracking-wider">{currentLang}</span>
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-4 w-40 rounded-none glass-dark shadow-xl overflow-hidden border border-white/10">
                  {languages.map(({ code, label }) => (
                    <button
                      key={code}
                      onClick={() => handleLangChange(code)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        currentLang === code
                          ? 'bg-primary/20 text-primary font-medium'
                          : 'text-white/90 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right — auth */}
          <div className="flex-1 flex items-center justify-end gap-3">
            <Link
              to={isAuthenticated ? '/profile' : '/login'}
              className="flex items-center gap-2 px-6 py-2.5 rounded-none text-[15px] font-medium text-white hover:bg-white/10 transition-all"
            >
              {isAuthenticated ? <User size={18} /> : <LogIn size={18} />}
              <span className="hidden sm:inline">
                {isAuthenticated ? 'Профиль' : 'Войти'}
              </span>
            </Link>

            {!isAuthenticated && (
              <Link
                to="/register"
                className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-none text-[15px] font-medium border border-primary/55 bg-transparent text-primary hover:bg-primary/10 hover:border-primary transition-all"
              >
                <UserPlus size={18} />
                Регистрация
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-none text-white hover:bg-white/10 transition-colors"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass-dark border-t border-white/5">
          <div className="max-w-[1440px] mx-auto px-8 py-4 space-y-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-none text-sm font-medium transition-all
                    ${isActive
                      ? 'bg-white/15 text-white'
                      : 'text-white hover:bg-white/10'
                    }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
            {!isAuthenticated && (
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-none text-sm font-medium border border-primary/55 bg-transparent text-primary hover:bg-primary/10 hover:border-primary transition-all"
              >
                <UserPlus size={18} />
                Регистрация
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
