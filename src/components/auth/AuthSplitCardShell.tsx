import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/** Градиент за карточкой; на md+ вокруг компактной карточки чуть больше поля по вертикали */
const shellOuter =
  'box-border flex h-dvh max-h-dvh min-h-0 overflow-hidden items-center justify-center px-3 py-3 sm:px-4 sm:py-4 ' +
  'md:py-8 ' +
  'bg-[linear-gradient(145deg,#080808_0%,#0a0a0a_22%,#0c1814_48%,#0a2219_72%,#062a1c_100%)]';

const shellInner = 'relative z-[1] flex w-full min-h-0 max-h-full justify-center overflow-hidden';

/**
 * Мобилка: высокая карточка на всю ширину колонки.
 * С md: высота calc(100dvh − 220px), ширина до ~860px (шире, чем 640px).
 */
const cardGrid =
  'flex w-full flex-col overflow-hidden border border-white/12 shadow-2xl shadow-black/40 rounded-none ' +
  'h-[calc(100dvh-1.5rem)] min-h-0 max-h-[calc(100dvh-1.5rem)] ' +
  'max-w-[min(100%,24rem)] sm:max-w-[min(100%,28rem)] ' +
  'md:grid md:grid-cols-2 md:grid-rows-1 md:items-stretch ' +
  'md:h-[calc(100dvh-220px)] md:max-h-[calc(100dvh-220px)] ' +
  'md:max-w-[min(94vw,800px)] lg:max-w-[min(94vw,860px)]';

/** Фото без отступов: заполняет ячейку (object-cover) */
const imagePane =
  'relative m-0 w-full min-w-0 shrink-0 overflow-hidden bg-black p-0 ' +
  'h-[min(28dvh,180px)] ' +
  'md:h-full md:min-h-0 md:border-r md:border-white/10';

/** Колонка формы на всю высоту строки сетки; скролл только у внутреннего блока */
const formPane =
  'relative flex min-h-0 w-full min-w-0 flex-1 flex-col border-t border-white/10 bg-[#111] text-white md:h-full md:border-t-0';

/** Колонка формы: компактные отступы, скролл только если контент реально не помещается (узкий по высоте экран) */
const formScroll =
  'flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-4 pt-10 pb-4 sm:px-5 sm:pt-10 sm:pb-4 md:px-5 md:pt-10 md:pb-4';

const contentWrap = 'mx-auto w-full min-w-0 max-w-md md:min-h-0';

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
              className="absolute inset-0 block h-full w-full object-cover object-center"
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
