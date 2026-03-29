import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const shellOuter =
  'box-border flex h-dvh max-h-dvh min-h-0 overflow-hidden bg-[#0a0a0a] items-center justify-center px-3 py-4 sm:px-4 sm:py-5 md:py-3';

const shellInner = 'flex w-full min-h-0 max-h-full justify-center overflow-hidden';

/** Одна и та же высота рамки на входе и регистрации (не от контента формы) */
const cardGrid =
  'flex w-full flex-col overflow-hidden border border-white/12 shadow-2xl shadow-black/40 rounded-none ' +
  'h-[calc(100dvh-48px)] min-h-[calc(100dvh-48px)] max-h-[calc(100dvh-48px)] ' +
  'max-w-[min(100%,22rem)] sm:max-w-[min(100%,26rem)] ' +
  'md:grid md:grid-cols-2 md:grid-rows-1 md:items-stretch ' +
  'md:h-[calc(100dvh-40px)] md:min-h-[calc(100dvh-40px)] md:max-h-[calc(100dvh-40px)] ' +
  'md:max-w-[min(94vw,720px)] lg:max-w-[min(94vw,780px)]';

/** Мобилка: фиксированная высота полосы под фото, на md тянется на всю строку сетки */
const imagePane =
  'relative w-full min-w-0 shrink-0 overflow-hidden bg-black ' +
  'h-[min(36dvh,252px)] ' +
  'md:h-full md:min-h-0 md:border-r md:border-white/10';

/** Колонка формы на всю высоту строки сетки; скролл только у внутреннего блока */
const formPane =
  'relative flex min-h-0 w-full min-w-0 flex-1 flex-col border-t border-white/10 bg-[#111] text-white md:h-full md:border-t-0';

const formScroll =
  'flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-5 py-6 sm:px-6 sm:py-7 md:px-6 md:py-6 lg:px-7 lg:py-7';

const contentWrap = 'mx-auto w-full min-w-0 max-w-md pt-7 sm:pt-8 md:min-h-0 md:pt-7';

const backLinkClass =
  'absolute left-4 top-3 z-10 inline-flex max-w-[calc(100%-1.5rem)] items-center gap-1.5 text-[11px] text-white/55 transition-colors hover:text-white sm:left-5 sm:top-3.5 sm:text-xs md:left-5 md:top-3 lg:left-6 lg:top-4';

type AuthSplitCardShellProps = {
  imageSrc: string;
  imageAlt?: string;
  children: ReactNode;
};

export function AuthSplitCardShell({ imageSrc, imageAlt = '', children }: AuthSplitCardShellProps) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className={shellOuter}>
      <div className={shellInner}>
        <div className={cardGrid}>
          <div className={imagePane}>
            <img
              src={imageSrc}
              alt={imageAlt}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </div>

          <div className={formPane}>
            <Link to="/" className={backLinkClass}>
              <ArrowLeft size={14} strokeWidth={2} className="shrink-0" />
              <span className="leading-tight">Вернуться на сайт</span>
            </Link>

            <div className={formScroll}>
              <div className={contentWrap}>{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
