import { Fragment, useState, useEffect, useRef, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
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
  Trash2,
  type LucideIcon,
} from 'lucide-react';
import { publicUrl } from '../lib/publicUrl';

const CART_ICON_SRC = publicUrl('media/images/free-icon-shopping-cart-of-checkered-design-34627.png');

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
  const [scrolled, setScrolled] = useState(false);
  /** Только /market: прячем шапку при скролле вниз, показываем при скролле вверх */
  const [marketNavHidden, setMarketNavHidden] = useState(false);
  const cartWrapRef = useRef<HTMLDivElement>(null);
  const marketScrollLastY = useRef(0);
  const mobileOpenRef = useRef(false);
  const { isAuthenticated } = useAuth();
  const { items, count, removeFromCart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isMarket = location.pathname === '/market' || location.pathname.startsWith('/market/');
  const barVisible = !isHome || scrolled;
  /** Главная у самого верха: без сплошной подложки шапки и без «пилюли» у ссылок */
  const homeAtTop = isHome && !scrolled;

  mobileOpenRef.current = mobileOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setScrolled(window.scrollY > 8);
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
      if (cartWrapRef.current && !cartWrapRef.current.contains(e.target as Node)) {
        setCartOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    setCartOpen(false);
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

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
        className={`absolute inset-0 bg-dark pointer-events-none transition-opacity duration-200 ease-out border-b border-white/[0.06] ${
          barVisible ? 'opacity-100 shadow-lg shadow-black/40' : 'opacity-0 border-transparent shadow-none'
        }`}
      />
      <div className="relative px-4 sm:px-6">
        <div className="flex items-center h-[72px]">
          {/* Left — logo */}
          <div className="flex-1 flex items-center">
            <Link to="/" onClick={handleLogoClick} className="flex items-center gap-0.5 group">
              <img
                src={publicUrl('media/images/background-removed.png')}
                alt="SmashMarket"
                className="w-11 h-11 object-contain group-hover:scale-110 transition-transform"
              />
              <span className="text-2xl font-bold text-white hidden sm:block tracking-tight">
                Smash<span className="text-primary">Market</span>
              </span>
            </Link>
          </div>

          {/* Center — nav */}
          <div
            className={`hidden md:flex items-center gap-2.5 rounded-none px-2.5 py-2 transition-[background-color,border-color,box-shadow] duration-200 ${
              homeAtTop
                ? 'border-transparent bg-transparent'
                : 'border border-white/10 bg-dark-light'
            }`}
          >
            {navLinks.map(({ to, label, icon: Icon }, index) => {
              const isActive = location.pathname === to;
              return (
                <Fragment key={to}>
                  {index > 0 && (
                    <div
                      className="h-5 w-px shrink-0 bg-white/20"
                      aria-hidden
                    />
                  )}
                  <Link
                    to={to}
                    className="group flex items-center gap-2 rounded-sm px-6 py-2 text-[15px] font-medium transition-colors duration-150 hover:bg-transparent"
                  >
                    <Icon
                      size={18}
                      className={`shrink-0 transition-colors duration-150 ${
                        isActive
                          ? 'text-primary'
                          : 'text-white group-hover:text-primary'
                      }`}
                      aria-hidden
                    />
                    <span
                      className={
                        isActive
                          ? 'text-primary'
                          : 'text-white transition-colors duration-150 group-hover:text-primary'
                      }
                    >
                      {label}
                    </span>
                  </Link>
                </Fragment>
              );
            })}
          </div>

          {/* Right — cart (только для авторизованных) + auth */}
          <div className="flex-1 flex items-center justify-end gap-3">
            {isAuthenticated ? (
              <div ref={cartWrapRef} className="relative">
                <button
                  type="button"
                  onClick={() => setCartOpen(o => !o)}
                  className="group relative flex h-11 w-11 items-center justify-center rounded-none bg-transparent p-0 text-white transition-opacity duration-150 hover:opacity-90"
                  aria-label={count > 0 ? `Корзина, ${count} товаров` : 'Корзина'}
                  aria-expanded={cartOpen}
                  aria-haspopup="true"
                >
                  <img
                    src={CART_ICON_SRC}
                    alt=""
                    width={64}
                    height={64}
                    decoding="async"
                    draggable={false}
                    className="h-[22px] w-[22px] object-contain brightness-0 invert"
                    aria-hidden
                  />
                  {count > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-black leading-none text-black">
                      {count > 99 ? '99+' : count}
                    </span>
                  )}
                </button>
                {cartOpen && (
                  <div
                    className="absolute right-0 z-[60] mt-3 w-[min(calc(100vw-2rem),20rem)] max-h-[min(75vh,24rem)] overflow-hidden rounded-md border border-white/15 bg-[#1a1f26] shadow-xl"
                    role="dialog"
                    aria-label="Содержимое корзины"
                  >
                    {count === 0 ? (
                      <p className="px-4 py-8 text-center text-sm text-white/65">Корзина пуста</p>
                    ) : (
                      <>
                        <ul className="scrollbar-dark-minimal max-h-[min(14rem,45vh)] divide-y divide-white/10 overflow-y-auto overscroll-contain [scrollbar-gutter:stable]">
                          {items.map(line => (
                            <li key={line.id} className="flex gap-2 px-3 py-2.5">
                              <div className="min-w-0 flex-1 text-left">
                                <Link
                                  to={`/market/listing/${line.id}`}
                                  className="line-clamp-2 text-sm font-medium text-white transition-colors hover:text-primary"
                                  onClick={() => setCartOpen(false)}
                                >
                                  {line.title}
                                </Link>
                                <p className="mt-0.5 text-xs tabular-nums text-white/55">
                                  {line.price.toLocaleString('ro-MD')} MDL
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFromCart(line.id)}
                                className="shrink-0 self-start rounded p-1 text-white/45 transition-colors hover:bg-white/10 hover:text-white"
                                aria-label="Убрать из корзины"
                              >
                                <Trash2 size={16} strokeWidth={2} aria-hidden />
                              </button>
                            </li>
                          ))}
                        </ul>
                        <div className="border-t border-white/10 px-3 py-2.5">
                          <Link
                            to="/profile?tab=cart"
                            className="block w-full rounded-sm bg-primary py-2.5 text-center text-sm font-black text-black transition-opacity hover:opacity-95"
                            onClick={() => setCartOpen(false)}
                          >
                            Открыть корзину в профиле
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : null}

            {isAuthenticated ? (
              <div
                className="h-7 w-px shrink-0 bg-white/25"
                role="separator"
                aria-hidden="true"
              />
            ) : null}

            <Link
              to={isAuthenticated ? '/profile' : '/login'}
              className="group flex items-center gap-2 px-6 py-2.5 rounded-none text-[15px] font-medium transition-colors duration-150 hover:bg-transparent"
            >
              {isAuthenticated ? (
                <User
                  size={18}
                  className="shrink-0 text-white transition-colors duration-150 group-hover:text-primary"
                  aria-hidden
                />
              ) : (
                <LogIn
                  size={18}
                  className="shrink-0 text-white transition-colors duration-150 group-hover:text-primary"
                  aria-hidden
                />
              )}
              <span className="hidden sm:inline text-white transition-colors duration-150 group-hover:text-primary">
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

      {mobileOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex min-h-0 flex-col bg-[#ececec] md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Меню сайта"
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b-2 border-black/10 bg-white px-4 py-3 shadow-[0_1px_0_0_rgba(0,0,0,0.06)] pt-[max(0.75rem,env(safe-area-inset-top,0px))]">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="flex min-w-0 items-center gap-2"
              >
                <img
                  src={publicUrl('media/images/background-removed.png')}
                  alt=""
                  className="h-10 w-10 shrink-0 object-contain"
                  width={40}
                  height={40}
                  decoding="async"
                />
                <span className="truncate text-lg font-bold tracking-tight text-gray-900">
                  Smash<span className="text-primary">Market</span>
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border-2 border-black/15 bg-white text-gray-900 transition-colors hover:bg-neutral-100"
                aria-label="Закрыть меню"
              >
                <X size={22} strokeWidth={2.5} aria-hidden />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))]">
              <nav className="mx-auto flex max-w-lg flex-col gap-1" aria-label="Разделы сайта">
                {navLinks.map(({ to, label, icon: Icon }) => {
                  const isActive = location.pathname === to;
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-4 rounded-xl border-2 border-black/10 bg-white px-4 py-4 text-base font-semibold shadow-[3px_3px_0_0_rgba(0,0,0,0.08)] transition-colors ${
                        isActive
                          ? 'border-primary/40 bg-primary/10 text-gray-900'
                          : 'text-gray-900 hover:border-black/20 hover:bg-neutral-50'
                      }`}
                    >
                      <Icon
                        size={22}
                        className={`shrink-0 ${isActive ? 'text-primary' : 'text-gray-700'}`}
                        aria-hidden
                      />
                      {label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mx-auto mt-6 max-w-lg flex flex-col gap-2 border-t-2 border-dashed border-black/15 pt-5">
                <Link
                  to={isAuthenticated ? '/profile' : '/login'}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-black/15 bg-white py-3.5 text-base font-bold text-gray-900 shadow-[3px_3px_0_0_rgba(0,0,0,0.08)] hover:bg-neutral-50"
                >
                  {isAuthenticated ? <User size={20} aria-hidden /> : <LogIn size={20} aria-hidden />}
                  {isAuthenticated ? 'Профиль' : 'Войти'}
                </Link>
                {!isAuthenticated && (
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl border-2 border-primary bg-primary/10 py-3.5 text-base font-bold text-gray-900 hover:bg-primary/20"
                  >
                    <UserPlus size={20} aria-hidden />
                    Регистрация
                  </Link>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </nav>
  );
}
