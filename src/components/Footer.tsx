import { Link, useLocation } from 'react-router-dom';
import { publicUrl } from '../lib/publicUrl';

const SOCIAL = {
  telegram: 'https://t.me/qweqweqweeqwe',
  instagram: 'https://www.instagram.com/jenyaa_u/',
  facebook: 'https://www.facebook.com/share/18hT9Ranws/',
} as const;

const footerLinks = [
  { to: '/', label: 'Главная' },
  { to: '/market', label: 'Барахолка' },
  { to: '/stringing', label: 'Перетяжка' },
  { to: '/courts', label: 'Залы' },
  { to: '/tournaments', label: 'Турниры' },
] as const;

function IconTelegram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function IconFacebook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

const socialClass =
  'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.05] text-white/70 transition-colors hover:border-primary/35 hover:bg-primary/10 hover:text-primary';

const ILLUSTRATION_DEFAULT = publicUrl('media/images/undraw_message-sent_iyz6.svg');
const ILLUSTRATION_MARKET = publicUrl('media/images/undraw_social-dashboard_81sv.svg');
const ILLUSTRATION_STRINGING = publicUrl('media/images/undraw_social-expert_wfam.svg');
const ILLUSTRATION_COURTS = publicUrl('media/images/undraw_social-growth_osro.svg');
const ILLUSTRATION_HOME = publicUrl('media/images/undraw_social-notifications_zahe.svg');

function illustrationForPath(pathname: string): string {
  if (pathname === '/market' || pathname.startsWith('/market/')) return ILLUSTRATION_MARKET;
  if (pathname === '/stringing' || pathname.startsWith('/stringing/')) return ILLUSTRATION_STRINGING;
  if (pathname === '/courts' || pathname.startsWith('/courts/')) return ILLUSTRATION_COURTS;
  if (pathname === '/tournaments' || pathname.startsWith('/tournaments/')) return ILLUSTRATION_DEFAULT;
  if (pathname === '/') return ILLUSTRATION_HOME;
  return ILLUSTRATION_DEFAULT;
}

export default function Footer() {
  const { pathname } = useLocation();
  const illustrationSrc = illustrationForPath(pathname);

  return (
    <footer className="mt-auto border-t border-white/[0.08] bg-[#0e1117]">
      <div className="mx-auto flex max-w-6xl flex-col items-stretch gap-6 px-6 py-8 sm:px-10 sm:py-9 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:py-10">
        <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-center lg:gap-6">
          <Link
            to="/"
            className="group flex w-fit shrink-0 items-center gap-2.5"
          >
            <img
              src={publicUrl('media/images/background-removed.png')}
              alt="SmashMarket"
              className="h-10 w-10 object-contain opacity-95 transition-opacity group-hover:opacity-100"
              width={40}
              height={40}
              decoding="async"
            />
            <span className="text-[17px] font-semibold tracking-tight text-white/95 sm:text-lg">
              Smash<span className="text-primary">Market</span>
            </span>
          </Link>

          <div
            className="h-px w-full max-w-[14rem] shrink-0 bg-white/20 lg:hidden"
            aria-hidden
          />

          <div
            className="hidden h-10 w-px shrink-0 bg-white/25 lg:block"
            role="separator"
            aria-hidden
          />

          <nav
            className="flex flex-wrap items-center justify-center gap-y-2 text-[14px] lg:text-[15px]"
            aria-label="Навигация в подвале"
          >
            {footerLinks.map(({ to, label }, index) => (
              <span key={to} className="inline-flex items-center">
                {index > 0 ? (
                  <span
                    className="mx-2.5 h-4 w-px shrink-0 bg-white/25 sm:mx-3.5"
                    aria-hidden
                  />
                ) : null}
                <Link to={to} className="text-white/60 transition-colors hover:text-primary">
                  {label}
                </Link>
              </span>
            ))}
          </nav>
        </div>

        <div className="flex items-center justify-center gap-5 lg:shrink-0 lg:justify-end">
          <img
            src={illustrationSrc}
            alt=""
            className="h-20 w-auto object-contain opacity-[0.88] sm:h-24 lg:h-[6.5rem]"
            width={160}
            height={160}
            loading="lazy"
            decoding="async"
          />
          <div className="flex flex-col items-center gap-2.5 border-l border-white/[0.1] pl-5">
            <p className="text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 sm:text-[11px]">
              Контакты
            </p>
            <div className="flex items-center gap-2" aria-label="Соцсети">
              <a
                href={SOCIAL.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className={socialClass}
                aria-label="Telegram"
              >
                <IconTelegram className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={socialClass}
                aria-label="Instagram"
              >
                <IconInstagram className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={socialClass}
                aria-label="Facebook"
              >
                <IconFacebook className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
