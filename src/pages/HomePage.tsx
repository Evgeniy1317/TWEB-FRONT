import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Wrench,
  MapPin,
  Trophy,
  ArrowRight,
  UserPlus,
  Search,
  Star,
  Calendar,
  ImageIcon,
  CheckCircle,
} from 'lucide-react';

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

            <p className="text-base sm:text-lg text-white/50 mb-14 leading-relaxed font-light font-sans">
              Крупнейшая бадминтон-барахолка Кишинёва: покупай, продавай, побеждай!
            </p>

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

      {/* --- MARKETPLACE --- */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[100px] -translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <ShoppingBag size={16} />
                Барахолка
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-dark leading-tight mb-6">
                Продавай и покупай всё для бадминтона
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                Ракетки, воланы, кроссовки, сумки, струны и любая экипировка — всё в одном месте.
                Зарегистрируйтесь, войдите в личный кабинет и выставляйте свои товары на продажу
                или находите то, что нужно вам, по лучшим ценам от других игроков Кишинёва.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  'Создайте аккаунт за 30 секунд',
                  'Выставляйте товары с фото и описанием',
                  'Покупайте напрямую у других игроков',
                ].map((text) => (
                  <div key={text} className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-primary shrink-0" />
                    <span className="text-gray-600">{text}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/market"
                className="group inline-flex items-center gap-2 text-primary font-heading font-semibold text-lg hover:gap-3 transition-all"
              >
                Открыть маркет
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-[2rem] blur-2xl" />
              <div className="relative grid grid-cols-2 gap-4">
                <ImagePlaceholder label="Ракетка" className="col-span-2 h-56 rounded-2xl" />
                <ImagePlaceholder label="Воланы" className="h-40 rounded-2xl" />
                <ImagePlaceholder label="Кроссовки" className="h-40 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- RESTRINGING --- */}
      <section className="relative py-24 lg:py-32 bg-dark overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-accent/[0.06] rounded-full blur-[120px] -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-primary/[0.04] rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute -inset-4 bg-gradient-to-tl from-primary/10 via-transparent to-accent/5 rounded-[2rem] blur-2xl" />
              <div className="relative">
                <ImagePlaceholder label="Перетяжка ракетки" className="h-80 rounded-2xl" />
                <div className="absolute -bottom-6 -right-6 bg-dark-light border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-white/70 text-sm">Статус заказа</span>
                  </div>
                  <span className="text-white font-heading font-semibold">Ракетка готова к выдаче</span>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/15 text-accent text-sm font-medium mb-6">
                <Wrench size={16} />
                Перетяжка
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-white leading-tight mb-6">
                Порвалась струна? Не проблема
              </h2>
              <p className="text-white/50 text-lg leading-relaxed mb-8">
                Оформите заказ на перетяжку ракетки прямо на сайте. Выберите мастера, тип струн
                и натяжение — отслеживайте статус в реальном времени. Качественная перетяжка
                от проверенных специалистов Кишинёва с гарантией.
              </p>

              <div className="grid grid-cols-3 gap-6 mb-10">
                {[
                  { num: '24ч', text: 'Среднее время' },
                  { num: '150+', text: 'Заказов' },
                  { num: '4.9', text: 'Рейтинг' },
                ].map(({ num, text }) => (
                  <div key={text}>
                    <div className="font-display text-2xl font-bold text-primary mb-1">{num}</div>
                    <div className="text-white/40 text-sm">{text}</div>
                  </div>
                ))}
              </div>

              <Link
                to="/stringing"
                className="group inline-flex items-center gap-2 text-accent font-heading font-semibold text-lg hover:gap-3 transition-all"
              >
                Заказать перетяжку
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- COURTS --- */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-violet-500/[0.03] rounded-full blur-[120px]" />

        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 text-violet-600 text-sm font-medium mb-6">
              <MapPin size={16} />
              Залы
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-dark leading-tight mb-6">
              Все залы Кишинёва на одной карте
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Хотите начать заниматься бадминтоном или ищете новое место для тренировок?
              Здесь собраны все спортивные залы Кишинёва с расписанием, ценами и отзывами.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Название зала', address: 'ул. Примерная, 1', time: 'Пн–Пт 08:00–22:00' },
              { name: 'Название зала', address: 'ул. Примерная, 2', time: 'Пн–Сб 09:00–21:00' },
              { name: 'Название зала', address: 'ул. Примерная, 3', time: 'Ежедневно 07:00–23:00' },
            ].map((court, i) => (
              <div key={i} className="group relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <ImagePlaceholder label={`Фото зала ${i + 1}`} className="h-48 w-full" />
                <div className="p-6">
                  <h3 className="font-heading font-semibold text-dark text-lg mb-2">{court.name}</h3>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <MapPin size={14} />
                    {court.address}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                    <Calendar size={14} />
                    {court.time}
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={14} className={j < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                    ))}
                    <span className="text-gray-400 text-xs ml-1">4.0</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/courts"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-dark text-white font-heading font-semibold hover:bg-dark-light transition-all"
            >
              <Search size={18} />
              Посмотреть все залы
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- TOURNAMENTS --- */}
      <section className="relative py-24 lg:py-32 bg-dark overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/[0.04] rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 text-amber-400 text-sm font-medium mb-6">
                <Trophy size={16} />
                Турниры
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-white leading-tight mb-6">
                Соревнуйся и побеждай
              </h2>
              <p className="text-white/50 text-lg leading-relaxed mb-10">
                Для любителей и профессионалов — календарь ближайших турниров Кишинёва.
                Смотрите даты, формат и место проведения. Записывайтесь онлайн и следите
                за результатами прямо на платформе.
              </p>

              <Link
                to="/tournaments"
                className="group inline-flex items-center gap-2 text-amber-400 font-heading font-semibold text-lg hover:gap-3 transition-all"
              >
                Все турниры
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="space-y-4">
              {[
                { title: 'Весенний Кубок Кишинёва', date: '15 апреля 2026', type: 'Одиночный', status: 'Регистрация открыта' },
                { title: 'SmashHub Open', date: '3 мая 2026', type: 'Парный', status: 'Скоро' },
                { title: 'Летний Чемпионат', date: '20 июня 2026', type: 'Смешанный', status: 'Скоро' },
              ].map((t, i) => (
                <div key={i} className="group relative bg-white/[0.04] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.07] hover:border-primary/20 transition-all duration-300 cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-heading font-semibold text-white text-lg mb-2">{t.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-white/40 text-sm">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          {t.date}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span>{t.type}</span>
                      </div>
                    </div>
                    <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium ${
                      i === 0
                        ? 'bg-primary/15 text-primary'
                        : 'bg-white/[0.06] text-white/40'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/[0.04] rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 sm:px-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <UserPlus size={16} />
            Присоединяйся
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-dark leading-tight mb-6">
            Стань частью бадминтонного
            <br />
            <span className="text-primary">сообщества Кишинёва</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto mb-12">
            Создайте аккаунт, выставляйте и покупайте экипировку, заказывайте перетяжку,
            находите залы и участвуйте в турнирах — всё бесплатно на одной платформе
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-primary text-dark font-heading font-semibold text-lg hover:bg-primary-dark hover:text-white transition-all hover:-translate-y-0.5"
            >
              <UserPlus size={20} />
              Зарегистрироваться
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/market"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 text-dark font-heading font-semibold text-lg border border-dark/15 hover:border-dark/40 transition-all"
            >
              <Search size={20} />
              Посмотреть маркет
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
