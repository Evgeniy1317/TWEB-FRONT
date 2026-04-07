import { Link } from 'react-router-dom';
import { ShoppingBag, Wrench, ArrowRight, ImageIcon } from 'lucide-react';

function ImagePlaceholder({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-dark/5 to-dark/10 flex items-center justify-center ${className}`}>
      <div className="text-center text-dark/20">
        <ImageIcon size={40} className="mx-auto mb-2" />
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
    </div>
  );
}

const homeShowcaseImages = {
  heroDesign: `/media/images/${encodeURIComponent('Hero (2).png')}`,
  productCardBanner: `/media/images/${encodeURIComponent('Free Product Card.png')}`,
  macbook: `/media/images/${encodeURIComponent('MacBook Air (2022).png')}`,
  iphoneHand: `/media/images/${encodeURIComponent('Hand and iPhone 16 Pro.png')}`,
  iphoneAir: `/media/images/${encodeURIComponent('Free iPhone Air.png')}`,
} as const;

function StepBadge({ n }: { n: number }) {
  return (
    <span
      className="mb-4 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary/10 font-display text-lg font-bold text-primary"
      aria-hidden
    >
      {n}
    </span>
  );
}

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative min-h-screen -mt-[72px] pt-[72px] flex items-center bg-dark overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            className="absolute inset-0 h-full w-full object-cover pointer-events-none"
            src="/media/videos/IMG_3744.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-dark/55"
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/40 via-transparent to-dark/70 pointer-events-none" />
        </div>

        <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16">
          <div className="max-w-[900px]">
            <h1 className="font-distressed text-left text-[2rem] sm:text-[2.5rem] lg:text-[3.25rem] xl:text-[4rem] font-normal text-white leading-[1.15] mb-8">
              <span className="whitespace-nowrap">Твоя лучшая игра</span>
              <br />
              начинается
              <span className="text-primary"> с&nbsp;правильной</span>
              <br />
              <span className="text-primary">экипировки</span>
            </h1>

            <div className="mb-14 max-w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <p className="font-tagline w-max min-w-0 text-sm text-white whitespace-nowrap leading-tight tracking-wide [text-shadow:0_1px_2px_rgba(0,0,0,0.85),0_0_24px_rgba(0,0,0,0.35)] sm:text-base md:text-lg lg:text-xl">
                Крупнейшая бадминтон-барахолка Кишинёва: покупай, продавай, побеждай!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              <Link
                to="/market"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-12 py-5 bg-primary text-dark font-heading font-semibold text-lg tracking-wide hover:bg-primary-dark hover:text-white transition-all hover:-translate-y-0.5"
              >
                <ShoppingBag size={22} />
                Перейти в маркет
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/stringing"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-12 py-5 text-white font-heading font-semibold text-lg tracking-wide border border-white/20 hover:border-primary hover:text-primary transition-all"
              >
                <Wrench size={22} />
                Заказать перетяжку
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Витрина: один прямоугольный блок без скруглений, шапка и фото внутри рамки */}
      <section className="bg-black pt-16 pb-14 sm:pt-24 sm:pb-20 lg:pt-28 lg:pb-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-0 flex-col overflow-hidden border-2 border-white/20 bg-neutral-950 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.7)]">
            <div className="flex shrink-0 min-w-0 flex-wrap items-center justify-between gap-3 border-b border-white/15 bg-neutral-950 px-3 py-3 sm:gap-4 sm:px-5 sm:py-4 lg:px-6 lg:py-5">
              <Link
                to="/"
                className="flex min-w-0 max-w-full items-center gap-2 text-white transition-opacity hover:opacity-90 sm:gap-2.5"
              >
                <img
                  src="/media/images/background-removed.png"
                  alt=""
                  className="h-8 w-8 shrink-0 object-contain sm:h-10 sm:w-10"
                  width={40}
                  height={40}
                  decoding="async"
                />
                <span className="min-w-0 break-words text-base font-bold tracking-tight sm:text-xl lg:text-2xl">
                  Smash<span className="text-primary">Market</span>
                </span>
              </Link>
              <div className="flex min-w-0 flex-shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
                <Link
                  to="/market"
                  className="inline-flex items-center gap-1.5 bg-primary px-3 py-2 font-heading text-xs font-semibold text-dark transition-transform hover:-translate-y-0.5 sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm lg:text-base"
                >
                  В маркет
                  <ArrowRight size={16} className="shrink-0 sm:h-[18px] sm:w-[18px]" aria-hidden />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 border-2 border-white/30 bg-transparent px-3 py-2 font-heading text-xs font-semibold text-white transition-colors hover:border-primary hover:text-primary sm:px-5 sm:py-2.5 sm:text-sm lg:text-base"
                >
                  Создать аккаунт
                </Link>
              </div>
            </div>
            <div className="relative min-h-[min(48vh,420px)] w-full overflow-hidden sm:min-h-[min(54vh,520px)] lg:min-h-[min(58vh,680px)]">
              <img
                src={homeShowcaseImages.heroDesign}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-center"
                width={1600}
                height={1200}
                decoding="async"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Чередование блоков: снимок, текст, снимок */}
      <section className="bg-black py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <header className="mx-auto mb-16 max-w-2xl text-center lg:mb-20">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Как это выглядит в деле</h2>
            <p className="mt-4 text-base leading-relaxed text-white/50 sm:text-lg">
              Один сервис на всех экранах: от регистрации до перетяжки и личного кабинета, интерфейс остаётся узнаваемым и удобным.
            </p>
          </header>

          <div className="flex flex-col gap-20 lg:gap-28">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="order-1 lg:order-1">
                <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.75)]">
                  <img
                    src={homeShowcaseImages.macbook}
                    alt=""
                    className="w-full object-cover object-center"
                    width={1600}
                    height={1000}
                    decoding="async"
                    draggable={false}
                  />
                </div>
              </div>
              <div className="order-2 lg:order-2">
                <StepBadge n={1} />
                <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">Полный доступ с большого экрана</h3>
                <p className="mt-4 text-base leading-relaxed text-white/50 sm:text-lg">
                  Регистрация, настройка профиля и просмотр барахолки на широком экране: удобно сравнивать объявления и оформлять
                  заказы без спешки.
                </p>
                <Link
                  to="/register"
                  className="mt-6 inline-flex items-center gap-2 font-heading font-semibold text-primary hover:gap-3"
                >
                  Зарегистрироваться
                  <ArrowRight size={18} aria-hidden />
                </Link>
              </div>
            </div>

            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="order-2 lg:order-1">
                <StepBadge n={2} />
                <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">Сервис перетяжки под рукой</h3>
                <p className="mt-4 text-base leading-relaxed text-white/50 sm:text-lg">
                  Смотрите, как работает мастер, выбирайте натяжение и связывайтесь в один тап. Всё доступно в мобильной версии
                  до и после тренировки.
                </p>
                <Link
                  to="/stringing"
                  className="mt-6 inline-flex items-center gap-2 font-heading font-semibold text-accent hover:gap-3"
                >
                  Перетяжка ракеток
                  <ArrowRight size={18} aria-hidden />
                </Link>
              </div>
              <div className="order-1 lg:order-2">
                <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-neutral-900 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.75)]">
                  <img
                    src={homeShowcaseImages.iphoneHand}
                    alt=""
                    className="w-full object-cover object-center"
                    width={1200}
                    height={1400}
                    decoding="async"
                    draggable={false}
                  />
                </div>
              </div>
            </div>

            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="order-1 lg:order-1">
                <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-neutral-900 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.75)]">
                  <img
                    src={homeShowcaseImages.iphoneAir}
                    alt=""
                    className="w-full object-cover object-center"
                    width={1200}
                    height={1400}
                    decoding="async"
                    draggable={false}
                  />
                </div>
              </div>
              <div className="order-2 lg:order-2">
                <StepBadge n={3} />
                <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">Личный кабинет всегда с собой</h3>
                <p className="mt-4 text-base leading-relaxed text-white/50 sm:text-lg">
                  Объявления, корзина и контакты: управляйте барахолкой и заказами там, где вам удобно, без привязки к десктопу.
                </p>
                <Link
                  to="/profile"
                  className="mt-6 inline-flex items-center gap-2 font-heading font-semibold text-primary hover:gap-3"
                >
                  Открыть профиль
                  <ArrowRight size={18} aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Барахолка: только баннер и кнопки --- */}
      <section className="bg-black py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <img
            src={homeShowcaseImages.productCardBanner}
            alt=""
            className="block h-auto w-full"
            width={1600}
            height={900}
            decoding="async"
            draggable={false}
          />
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:mt-10 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
            <Link
              to="/market"
              className="group inline-flex items-center justify-center gap-2 bg-primary px-8 py-4 font-heading text-base font-semibold text-dark transition-transform hover:-translate-y-0.5"
            >
              Перейти в маркет
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" aria-hidden />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/25 px-8 py-4 font-heading text-base font-semibold text-white transition-colors hover:border-primary hover:text-primary"
            >
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
