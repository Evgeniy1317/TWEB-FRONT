import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Wrench,
  MapPin,
  Trophy,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
  to: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: ShoppingBag,
    title: 'Барахолка',
    desc: 'Покупайте и продавайте ракетки, воланы и экипировку',
    to: '/market',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Wrench,
    title: 'Перетяжка',
    desc: 'Профессиональная перетяжка ракеток с отслеживанием',
    to: '/stringing',
    color: 'bg-cyan-50 text-cyan-600',
  },
  {
    icon: MapPin,
    title: 'Залы',
    desc: 'Все бадминтонные залы Кишинёва в одном месте',
    to: '/courts',
    color: 'bg-violet-50 text-violet-600',
  },
  {
    icon: Trophy,
    title: 'Турниры',
    desc: 'Календарь соревнований и регистрация',
    to: '/tournaments',
    color: 'bg-amber-50 text-amber-600',
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero — full viewport */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-dark overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.1] mb-6">
            Твоя лучшая игра начинается
            <br />
            <span className="text-primary">с правильной экипировки</span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Крупнейшая бадминтон-барахолка Кишинева: покупай, продавай, побеждай.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/market"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <ShoppingBag size={20} />
              Перейти в маркет
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/stringing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all backdrop-blur-md border border-white/20"
            >
              <Wrench size={20} />
              Заказать перетяжку
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-3">
            Всё для бадминтона
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Четыре раздела — одна платформа. Выбирай то, что нужно.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc, to, color }) => (
            <Link
              key={to}
              to={to}
              className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-hover block"
            >
              <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon size={22} />
              </div>
              <h3 className="font-bold text-dark text-lg mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{desc}</p>
              <span className="inline-flex items-center gap-1 text-primary-dark text-sm font-semibold group-hover:gap-2 transition-all">
                Перейти <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="bg-dark rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Присоединяйся к SmashHub
            </h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Стань частью бадминтонного сообщества Кишинёва уже сегодня
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition-all shadow-lg"
            >
              Зарегистрироваться
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
