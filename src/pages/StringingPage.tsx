import { useState, type FormEvent } from 'react';
import {
  ChevronDown,
  ClipboardList,
  Mail,
  MessageCircle,
  Phone,
  Play,
  PlusCircle,
  Send,
  User,
} from 'lucide-react';
import StatusTracker from '../components/StatusTracker';
import { stringingOrders as initialOrders } from '../data/mockData';
import type { StringingOrder } from '../types';

const stringTypes = ['BG65', 'BG80', 'BG80 Power', 'Nanogy 98', 'Nanogy 99', 'NBG95'] as const;

const categorySelectedShadowClass = 'shadow-[3px_3px_0_0_#00E676]';

interface OrderForm {
  racketModel: string;
  tension: string;
  stringType: string;
}

const STRINGING_HERO_IMG = '/media/images/original-7aa6660ec4e2a8199a342ced2a016ac5.webp';

/** Портрет мастера: положите файл в public/media/images/ (например stringing-master.webp) */
const STRINGING_MASTER_IMG = '/media/images/stringing-master.webp';

const FAQ_ITEMS = [
  {
    q: 'Сколько ждать готовую ракетку?',
    a: 'Обычно 1–3 рабочих дня в зависимости от загрузки и сложности. Точный срок согласуем при приёме.',
  },
  {
    q: 'Можно со своими струнами?',
    a: 'Да, приносите свои струны — перетяжка только на станке. Уточните при записи, чтобы мы зарезервировали слот.',
  },
  {
    q: 'Как подобрать натяж?',
    a: 'Ориентируемся на уровень игры, ракетку и пожелания. Если не уверены — подскажем по опыту и таблицам производителя.',
  },
  {
    q: 'Гарантия на работу?',
    a: 'Проверяем узлы и натяж после работы. При дефекте перетяжки — разберём и поправим по гарантийным условиям сервиса.',
  },
] as const;

export default function StringingPage() {
  const [activeTab, setActiveTab] = useState<'order' | 'history'>('order');
  const [orders, setOrders] = useState<StringingOrder[]>(initialOrders);
  const [form, setForm] = useState<OrderForm>({ racketModel: '', tension: '', stringType: '' });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [masterPhotoError, setMasterPhotoError] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newOrder: StringingOrder = {
      id: orders.length + 1,
      ...form,
      status: 'received',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setOrders([newOrder, ...orders]);
    setForm({ racketModel: '', tension: '', stringType: '' });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setActiveTab('history');
    }, 2000);
  };

  return (
    <div className="sketch-page min-h-[calc(100dvh-4.5rem)] w-full">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        {/* Hero */}
        <header className="grid grid-cols-1 gap-4 border-2 border-black bg-white p-4 sketch-shadow sm:gap-5 sm:p-5 md:grid-cols-[minmax(0,180px)_1fr] md:items-center md:gap-5 md:p-6 lg:grid-cols-[minmax(0,200px)_1fr] rounded-md">
          <div className="relative aspect-square w-full max-w-[180px] shrink-0 overflow-hidden mx-auto min-h-0 min-w-0 md:mx-0 md:max-w-none md:w-full">
            <div className="flex h-full w-full items-center justify-center p-2 sm:p-2">
              <img
                src={STRINGING_HERO_IMG}
                alt=""
                sizes="(min-width: 1024px) 184px, (min-width: 768px) 164px, 164px"
                className="max-h-full max-w-full object-contain object-center [image-rendering:auto]"
                width={800}
                height={600}
                decoding="async"
                fetchPriority="high"
                draggable={false}
              />
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-600">Сервис</p>
            <h1 className="mt-2 font-black tracking-tight text-gray-900 text-2xl sm:text-3xl md:text-4xl">
              Перетяжка ракеток
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
              Натяжка на электронном станке, учёт ваших пожеланий по натягу и струнам. Оформите заказ ниже — статус можно
              отслеживать в разделе «Мои заказы».
            </p>
          </div>
        </header>

        {/* Заказ */}
        <section className="mt-8" aria-labelledby="stringing-order-heading">
          <h2 id="stringing-order-heading" className="sr-only">
            Оформление заказа
          </h2>
          <div className="inline-flex w-full max-w-md gap-0 border-2 border-black bg-white p-1 sketch-shadow-sm rounded-md">
            <button
              type="button"
              onClick={() => setActiveTab('order')}
              className={`flex flex-1 items-center justify-center gap-2 border-2 px-3 py-2.5 text-xs font-black uppercase tracking-wide transition-all sm:px-4 sm:text-sm ${
                activeTab === 'order'
                  ? `border-black bg-primary text-black ${categorySelectedShadowClass}`
                  : 'border-transparent bg-transparent text-neutral-600 hover:text-black'
              }`}
            >
              <PlusCircle size={16} strokeWidth={2.5} />
              Оформить заказ
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`flex flex-1 items-center justify-center gap-2 border-2 px-3 py-2.5 text-xs font-black uppercase tracking-wide transition-all sm:px-4 sm:text-sm ${
                activeTab === 'history'
                  ? `border-black bg-primary text-black ${categorySelectedShadowClass}`
                  : 'border-transparent bg-transparent text-neutral-600 hover:text-black'
              }`}
            >
              <ClipboardList size={16} strokeWidth={2.5} />
              Мои заказы
            </button>
          </div>

          <div className="mt-6">
            {activeTab === 'order' && (
              <div className="border-2 border-black bg-white p-5 sketch-shadow sm:p-8 rounded-md">
                {submitted ? (
                  <div className="py-10 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border-2 border-black bg-primary sketch-shadow-sm">
                      <Send size={26} className="text-black" strokeWidth={2.5} />
                    </div>
                    <h3 className="font-black text-lg text-gray-900">Заказ оформлен!</h3>
                    <p className="mt-2 text-sm text-neutral-600">Переходим к списку заказов...</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-neutral-600">
                        Модель ракетки
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Напр. Yonex Astrox 88D"
                        value={form.racketModel}
                        onChange={e => setForm({ ...form, racketModel: e.target.value })}
                        className="sketch-input w-full border-2 border-black bg-white px-3 py-2.5 text-sm font-medium text-gray-900 placeholder:text-neutral-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-neutral-600">
                        Натяжение (кг)
                      </label>
                      <input
                        type="number"
                        required
                        min={18}
                        max={35}
                        placeholder="24"
                        value={form.tension}
                        onChange={e => setForm({ ...form, tension: e.target.value })}
                        className="sketch-input w-full border-2 border-black bg-white px-3 py-2.5 text-sm font-medium text-gray-900 placeholder:text-neutral-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-neutral-600">
                        Тип струны
                      </label>
                      <select
                        required
                        value={form.stringType}
                        onChange={e => setForm({ ...form, stringType: e.target.value })}
                        className="sketch-input w-full border-2 border-black bg-white px-3 py-2.5 text-sm font-medium text-gray-900"
                      >
                        <option value="">Выберите тип струны</option>
                        {stringTypes.map(s => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 border-2 border-black bg-primary py-3 font-black uppercase tracking-wide text-black sketch-shadow-sm transition-transform hover:-translate-y-0.5"
                    >
                      <Send size={18} strokeWidth={2.5} />
                      Оформить заказ
                    </button>
                  </form>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="border-2 border-dashed border-black/40 bg-white/80 py-14 text-center">
                    <p className="font-bold text-neutral-500">Заказов пока нет</p>
                  </div>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="border-2 border-black bg-white p-5 sketch-shadow sm:p-6 rounded-md">
                      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                          <h3 className="font-black text-gray-900">{order.racketModel}</h3>
                          <p className="text-sm font-medium text-neutral-600">
                            {order.stringType} · {order.tension} кг · {order.createdAt}
                          </p>
                        </div>
                        <span
                          className={`inline-flex self-start border-2 border-black px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${
                            order.status === 'ready'
                              ? 'bg-primary text-black'
                              : order.status === 'in_progress'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-sky-100 text-sky-900'
                          }`}
                        >
                          {order.status === 'ready' && 'Готово'}
                          {order.status === 'in_progress' && 'В работе'}
                          {order.status === 'received' && 'Ожидает'}
                        </span>
                      </div>
                      <StatusTracker status={order.status} />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </section>

        {/* Мастер — овальное фото, описание, контакты */}
        <section className="mt-14 sm:mt-16" aria-labelledby="stringing-master-heading">
          <h2 id="stringing-master-heading" className="mb-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">
            Мастер
          </h2>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 border-2 border-black bg-white p-5 sketch-shadow sm:flex-row sm:items-start sm:gap-8 sm:p-6 md:p-7 rounded-md">
            <div className="relative shrink-0">
              <div className="relative h-44 w-36 overflow-hidden rounded-[50%] border-2 border-black bg-neutral-100 shadow-[3px_3px_0_0_#000] sm:h-48 sm:w-40">
                {!masterPhotoError ? (
                  <img
                    src={STRINGING_MASTER_IMG}
                    alt="Anzor Sturza"
                    className="h-full w-full object-cover object-center"
                    width={320}
                    height={400}
                    decoding="async"
                    onError={() => setMasterPhotoError(true)}
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-neutral-200 px-2 text-center text-[10px] font-bold uppercase leading-tight text-neutral-500">
                    <User className="h-10 w-10 opacity-60" strokeWidth={2} aria-hidden />
                    <span>Добавьте фото в&nbsp;public/media/images/stringing-master.webp</span>
                  </div>
                )}
              </div>
            </div>
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">Перетяжка</p>
              <p className="mt-1 font-black text-xl text-gray-900 sm:text-2xl">Anzor Sturza</p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
                Сертифицированный мастер по натяжке. Работает на электронном станке, подбирает натяж и струны под ваш
                стиль игры. Принимает ракетки по записи, консультирует по струнам и уходу за кадром.
              </p>
              <ul className="mt-5 space-y-2.5 text-left text-sm font-semibold text-gray-900">
                <li className="flex items-start gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-black" strokeWidth={2.5} aria-hidden />
                  <a href="tel:+70000000000" className="underline decoration-2 underline-offset-2 hover:text-primary-dark">
                    +7 (000) 000-00-00
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-black" strokeWidth={2.5} aria-hidden />
                  <a
                    href="https://t.me/anzor_sturza"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-2 underline-offset-2 hover:text-primary-dark"
                  >
                    Telegram: @anzor_sturza
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-black" strokeWidth={2.5} aria-hidden />
                  <a
                    href="mailto:anzor@example.com"
                    className="break-all underline decoration-2 underline-offset-2 hover:text-primary-dark"
                  >
                    anzor@example.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Видео — широкий низкий блок */}
        <section className="mt-10 sm:mt-12" aria-labelledby="stringing-video-heading">
          <h2 id="stringing-video-heading" className="mb-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">
            Видео процесса
          </h2>
          <div className="mx-auto w-full max-w-6xl">
            <div
              className="relative h-36 w-full overflow-hidden rounded-md border-2 border-black bg-neutral-800 sketch-shadow sm:h-44 md:h-48"
              aria-label="Место для видео перетяжки"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-900" aria-hidden />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
                <button
                  type="button"
                  disabled
                  className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-white/10 text-white opacity-90 sm:h-14 sm:w-14"
                  aria-hidden
                >
                  <Play className="ml-0.5 h-6 w-6 fill-current sm:h-7 sm:w-7" />
                </button>
                <p className="text-center text-[11px] font-bold uppercase tracking-wider text-white/70">
                  Скоро — ролик со станка
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ под видео: в строку, заголовок строки — только номер */}
        <section className="mt-10 sm:mt-12" aria-labelledby="stringing-faq-heading">
          <h2 id="stringing-faq-heading" className="mb-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">
            Частые вопросы
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openFaq === index;
              const num = String(index + 1).padStart(2, '0');
              return (
                <div
                  key={num}
                  className={`flex min-h-0 flex-col border-2 border-black bg-white transition-shadow rounded-md ${
                    isOpen ? categorySelectedShadowClass : 'sketch-shadow-sm'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left sm:px-4 sm:py-3.5"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    id={`faq-trigger-${index}`}
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-black bg-neutral-100 font-black tabular-nums text-gray-900 sm:h-11 sm:w-11"
                      aria-hidden
                    >
                      {num}
                    </span>
                    <span className="sr-only">{item.q}</span>
                    <ChevronDown
                      size={20}
                      strokeWidth={2.5}
                      className={`ml-auto shrink-0 text-black transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden
                    />
                  </button>
                  <div
                    id={`faq-panel-${index}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${index}`}
                    className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t-2 border-black px-3 pb-3 pt-0 sm:px-4 sm:pb-4">
                        <p className="mb-2 text-xs font-black leading-snug text-gray-900">{item.q}</p>
                        <p className="text-[13px] leading-relaxed text-neutral-700">{item.a}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
