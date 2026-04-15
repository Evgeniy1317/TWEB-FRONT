import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { publicUrl } from '../lib/publicUrl';
import { useAuth } from '../context/AuthContext';
import { useStringingOrders } from '../context/StringingOrdersContext';
import StatusTracker from '../components/StatusTracker';
import type { StringingOrderStatus } from '../types';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Instagram,
  Phone,
  Play,
  PlusCircle,
  Send,
  User,
  X,
} from 'lucide-react';

/** Струны в наличии: цена перетяжки с выбранной струной */
const STRING_IN_STOCK = [
  { id: 'stock-150', name: 'Струна в наличии — вариант 1', priceLei: 150 },
  { id: 'stock-200', name: 'Струна в наличии — вариант 2', priceLei: 200 },
] as const;

/** Подставьте свои ссылки мастера */
const MASTER_SOCIAL = {
  telegram: 'https://t.me/anzorcik228',
  instagram: 'https://www.instagram.com/anzor_sturza/',
  /** Публичный чат или viber:// — замените на свой */
  viber: 'https://chats.viber.com/anzor_sturza',
} as const;

const categorySelectedShadowClass = 'shadow-[3px_3px_0_0_#00E676]';

const TENSION_PRESETS = [9, 10, 10.5, 11, 11.5, 12] as const;

function formatTensionKgDisplay(value: string): string {
  return value.trim() === '' ? '—' : value.replace(/\./g, ',');
}

function isValidTensionKg(value: string): boolean {
  const n = Number.parseFloat(value.replace(',', '.'));
  if (Number.isNaN(n)) return false;
  return n >= 8 && n <= 35;
}

interface OrderForm {
  racketModel: string;
  tension: string;
  stringType: string;
}

const STRINGING_HERO_IMG = publicUrl('media/images/original-7aa6660ec4e2a8199a342ced2a016ac5.webp');

/** Портрет мастера: положите файл в public/media/images/ (например stringing-master.webp) */
const STRINGING_MASTER_IMG = publicUrl('media/images/5368680524567746267.jpg');

const STRINGING_VIDEO_SRC = publicUrl('media/videos/IMG_0198.mp4');

const STRINGING_STATUS_LABEL: Record<StringingOrderStatus, string> = {
  handover: 'В передаче',
  in_progress: 'Получена, в работе',
  ready: 'Готово',
};

const STRINGING_FAQ = [
  {
    q: 'Сколько времени занимает перетяжка?',
    short: 'Срок',
    a: 'Обычно 1–2 дня — точный срок уточняйте при записи.',
  },
  {
    q: 'Можно принести свои струны?',
    short: 'Свои струны',
    a: 'Да, обсудите с мастером заранее в сообщении.',
  },
  {
    q: 'Как передать и забрать ракетку?',
    short: 'Передача',
    a: 'Время и место передачи согласовываются с мастером по телефону или в мессенджере.',
  },
] as const;

/** Короткие пункты под контактами — заполняют середину колонки без пустоты */
const MASTER_HIGHLIGHTS = [
  'Электронный станок и точный натяг',
  'Подбор струн под ваш стиль игры',
  'Запись по телефону или в Telegram',
] as const;

export default function StringingPage() {
  const { user, isAuthenticated } = useAuth();
  const { orders: allStringingOrders, addOrder } = useStringingOrders();
  const [activeTab, setActiveTab] = useState<'order' | 'history'>('order');
  const [form, setForm] = useState<OrderForm>({
    racketModel: '',
    tension: '11.5',
    stringType: STRING_IN_STOCK[0].id,
  });
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [pendingOrderDraft, setPendingOrderDraft] = useState<{
    racketModel: string;
    tension: string;
    stringTypeLabel: string;
    totalLei: number;
  } | null>(null);
  const [tensionCustomOpen, setTensionCustomOpen] = useState(false);
  const [customTensionDraft, setCustomTensionDraft] = useState('');
  const [masterPhotoError, setMasterPhotoError] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoPlayClick = () => {
    setVideoStarted(true);
    void videoRef.current?.play();
  };

  /** Показать кадр превью вместо чёрного экрана до воспроизведения */
  useEffect(() => {
    const v = videoRef.current;
    if (!v || videoStarted) return;
    const showFrame = () => {
      try {
        v.currentTime = 0.05;
      } catch {
        /* ignore */
      }
    };
    v.addEventListener('loadeddata', showFrame);
    if (v.readyState >= 2) showFrame();
    return () => v.removeEventListener('loadeddata', showFrame);
  }, [videoStarted]);

  const selectedString = STRING_IN_STOCK.find(s => s.id === form.stringType);
  const totalLei = selectedString?.priceLei ?? 0;

  useEffect(() => {
    if (!contactModalOpen && !tensionCustomOpen && !successModalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [contactModalOpen, tensionCustomOpen, successModalOpen]);

  const tensionIsPreset = TENSION_PRESETS.some(p => String(p) === form.tension);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValidTensionKg(form.tension)) return;
    const sel = STRING_IN_STOCK.find(s => s.id === form.stringType);
    setPendingOrderDraft({
      racketModel: form.racketModel,
      tension: form.tension,
      stringTypeLabel: sel ? `${sel.name} — ${sel.priceLei} lei` : form.stringType,
      totalLei: sel?.priceLei ?? 0,
    });
    setContactModalOpen(true);
  };

  const confirmSaveOrderFromModal = () => {
    if (!user || !pendingOrderDraft) return;
    addOrder({
      ...pendingOrderDraft,
      clientUserId: user.id,
      clientName: user.name,
    });
    setContactModalOpen(false);
    setSuccessModalOpen(true);
    setActiveTab('history');
    setForm({ racketModel: '', tension: '11.5', stringType: STRING_IN_STOCK[0].id });
    setPendingOrderDraft(null);
  };

  const sortedAllOrders = [...allStringingOrders].sort((a, b) => b.id - a.id);

  const applyCustomTension = () => {
    const normalized = customTensionDraft.trim().replace(',', '.');
    if (!isValidTensionKg(normalized)) return;
    setForm(f => ({ ...f, tension: normalized }));
    setTensionCustomOpen(false);
  };

  const openTensionCustom = () => {
    setCustomTensionDraft(form.tension.replace('.', ','));
    setTensionCustomOpen(true);
  };

  return (
    <div className="sketch-page min-h-[calc(100dvh-4.5rem)] w-full">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        {/* Hero */}
        <header className="grid grid-cols-1 gap-4 border-2 border-black bg-white p-4 sketch-shadow sm:gap-5 sm:p-5 md:grid-cols-[minmax(0,180px)_1fr] md:items-center md:gap-6 md:p-6 lg:grid-cols-[minmax(0,200px)_1fr] rounded-md">
          <div className="relative aspect-square w-full max-w-[180px] shrink-0 overflow-hidden mx-auto min-h-0 min-w-0 md:mx-0 md:max-w-none md:w-full md:self-center">
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
          <div className="flex min-w-0 flex-col justify-center md:min-h-0 md:self-center">
            <h1 className="font-black tracking-tight text-gray-900 text-2xl sm:text-3xl md:text-4xl">
              Перетяжка ракеток
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
              Натяжка на электронном станке, учёт ваших пожеланий по натягу и струнам. Оформите заказ ниже — список заказов и
              статус перетяжки смотрите в личном профиле.
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
              Все заказы
            </button>
          </div>

          <div className="mt-5">
            {activeTab === 'order' && (
              <div className="border-2 border-black bg-white p-4 sketch-shadow sm:p-5 rounded-md">
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
                    <p className="mb-2 text-xs text-neutral-600">
                      Сейчас:{' '}
                      <span className="font-black tabular-nums text-gray-900">{formatTensionKgDisplay(form.tension)}</span>{' '}
                      кг
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {TENSION_PRESETS.map(p => {
                        const v = String(p);
                        const active = form.tension === v;
                        return (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setForm(f => ({ ...f, tension: v }))}
                            className={`min-w-[2.75rem] border-2 border-black px-2.5 py-2 text-sm font-black tabular-nums transition-transform hover:-translate-y-0.5 ${
                              active ? `bg-primary text-black ${categorySelectedShadowClass}` : 'bg-white text-gray-900 sketch-shadow-sm'
                            }`}
                          >
                            {String(p).replace('.', ',')}
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={openTensionCustom}
                        className={`border-2 border-black px-2.5 py-2 text-xs font-black uppercase leading-tight transition-transform hover:-translate-y-0.5 sm:text-sm ${
                          !tensionIsPreset
                            ? `bg-primary text-black ${categorySelectedShadowClass}`
                            : 'bg-white text-gray-900 sketch-shadow-sm'
                        }`}
                      >
                        Своё
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-neutral-600">
                      Тип струны (в наличии)
                    </label>
                    <select
                      required
                      value={form.stringType}
                      onChange={e => setForm({ ...form, stringType: e.target.value })}
                      className="sketch-input w-full border-2 border-black bg-white px-3 py-2.5 text-sm font-medium text-gray-900"
                    >
                      {STRING_IN_STOCK.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} — {s.priceLei} lei
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-black bg-neutral-50 px-3 py-3 text-sm font-black text-gray-900">
                    <span className="uppercase tracking-wide">Итого</span>
                    <span
                      className="inline-flex min-w-[6.5rem] items-center justify-center rounded-lg border-2 border-primary bg-primary/20 px-4 py-2 text-base font-black tabular-nums text-black shadow-[3px_3px_0_0_#00C853]"
                      aria-live="polite"
                    >
                      {totalLei} lei
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 border-2 border-black bg-primary py-3 font-black uppercase tracking-wide text-black sketch-shadow-sm transition-transform hover:-translate-y-0.5"
                  >
                    <Send size={18} strokeWidth={2.5} />
                    Оформить заказ
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="border-2 border-black bg-white p-4 sketch-shadow sm:p-5 rounded-md">
                  <h3 className="font-black text-lg text-gray-900 sm:text-xl">Все заказы</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                    Общий список заявок на перетяжку, которые мастер принял в работу. В профиле во вкладке «Мои заказы»
                    отображаются только ваши заказы — с теми же этапами, что и в этом списке.
                  </p>
                  <Link
                    to="/profile?tab=orders"
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 border-2 border-black bg-white px-4 py-2.5 text-xs font-black uppercase tracking-wide text-black sketch-shadow-sm transition-transform hover:-translate-y-0.5 sm:w-auto"
                  >
                    Мои заказы в профиле
                    <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                  </Link>
                </div>

                {sortedAllOrders.length === 0 ? (
                  <p className="border-2 border-black bg-neutral-50 p-4 text-sm text-neutral-700">Пока нет заказов.</p>
                ) : (
                  sortedAllOrders.map(order => {
                    const mine = isAuthenticated && user?.id === order.clientUserId;
                    return (
                      <article
                        key={order.id}
                        className={`border-2 border-black bg-white p-4 sketch-shadow sm:p-5 rounded-md ${
                          mine ? 'ring-2 ring-primary ring-offset-2' : ''
                        }`}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <p className="text-xs font-black uppercase tracking-wide text-neutral-500">
                              Заказ #{order.id}
                              {mine ? ' · ваш' : ''}
                            </p>
                            <h4 className="mt-1 font-black text-base text-gray-900 sm:text-lg">{order.racketModel}</h4>
                            <p className="mt-1 text-sm text-neutral-600">
                              {(mine ? order.clientName ?? 'Вы' : 'Клиент') +
                                ' · ' +
                                order.stringType +
                                ' · ' +
                                formatTensionKgDisplay(order.tension) +
                                ' кг · ' +
                                order.createdAt +
                                (order.totalLei != null ? ` · ${order.totalLei} lei` : '')}
                            </p>
                          </div>
                          <div className="shrink-0 sm:pt-1">
                            <p className="text-[10px] font-black uppercase tracking-wide text-neutral-500">Статус</p>
                            <p
                              className={`mt-1 inline-block border-2 border-black px-2.5 py-1.5 text-xs font-black ${
                                order.status === 'handover'
                                  ? 'bg-[#E6EDA5] text-black'
                                  : order.status === 'ready'
                                    ? 'bg-primary/30 text-black'
                                    : 'bg-neutral-100 text-black'
                              }`}
                            >
                              {STRINGING_STATUS_LABEL[order.status]}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 border-t-2 border-neutral-200 pt-4">
                          <p className="mb-2 text-[10px] font-black uppercase tracking-wide text-neutral-500">
                            Дорожка статуса
                          </p>
                          <StatusTracker status={order.status} />
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </section>

        {/* Одна рамка без общей тени (тень убрана с блока — портрет мастера только с обводкой) */}
        <section className="mt-14 sm:mt-16" aria-labelledby="stringing-video-master-heading">
          <h2 id="stringing-video-master-heading" className="sr-only">
            Видео, мастер и вопросы
          </h2>
          <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-md border-2 border-black bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-stretch">
              <div className="relative border-b-2 border-black bg-black lg:border-b-0 lg:border-r-2">
                <div className="relative mx-auto aspect-[9/16] w-full max-w-[min(100%,22rem)] lg:mx-0 lg:w-[22rem] lg:max-w-none">
                  <video
                    ref={videoRef}
                    className="absolute inset-0 h-full w-full object-contain"
                    src={STRINGING_VIDEO_SRC}
                    preload="auto"
                    playsInline
                    controls={videoStarted}
                    onPlay={() => setVideoStarted(true)}
                  />
                  {!videoStarted && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={handleVideoPlayClick}
                        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-black/35 text-white backdrop-blur-[2px] transition-transform hover:-translate-y-0.5 hover:bg-black/45 sm:h-16 sm:w-16"
                        aria-label="Воспроизвести видео"
                      >
                        <Play className="ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex h-full min-h-0 min-w-0 flex-col">
                <div className="flex h-full min-h-0 flex-col gap-0 p-2.5 sm:p-3">
                  {/* Мобильный: фото слева, имя и описание справа; десктоп: та же сетка + кнопки ниже на всю ширину */}
                  <div className="flex shrink-0 flex-row items-start gap-2.5 sm:gap-3">
                    <div className="relative w-[7.25rem] shrink-0 sm:w-[12rem]">
                      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md border-2 border-black bg-neutral-100 shadow-none">
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
                            <span>Не удалось загрузить фото мастера</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="min-h-0 min-w-0 flex-1 text-left">
                      <p className="font-black text-lg leading-tight text-gray-900 sm:text-2xl">
                        Anzor Sturza
                      </p>
                      <p className="mt-1.5 text-[13px] leading-snug text-neutral-700 sm:mt-2 sm:text-[15px] sm:leading-relaxed">
                        Работает на электронном станке, подбирает натяжение струн и тип струны под ваш стиль игры. Принимает
                        ракетки по записи, консультирует по струнам и уходу за кадром.
                      </p>
                    </div>
                  </div>
                  <ul className="mt-3 grid shrink-0 grid-cols-1 gap-1.5 sm:grid-cols-2 sm:gap-2">
                    <li className="min-w-0">
                      <a
                        href="tel:+37360678358"
                        className="inline-flex h-full min-h-[2.75rem] w-full items-center justify-center gap-2 border-2 border-black bg-primary px-3 py-2.5 text-center text-[11px] font-black uppercase leading-tight tracking-wide text-black sketch-shadow-sm transition-transform hover:-translate-y-0.5 sm:text-xs"
                      >
                        <Phone className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
                        0606 78 358
                      </a>
                    </li>
                    <li className="min-w-0">
                      <a
                        href={MASTER_SOCIAL.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-full min-h-[2.75rem] w-full items-center justify-center gap-2 border-2 border-black bg-primary px-2 py-2.5 text-center text-[10px] font-black uppercase leading-tight tracking-wide text-black sketch-shadow-sm transition-transform hover:-translate-y-0.5 sm:px-3 sm:text-[11px]"
                      >
                        <Send className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
                        <span className="leading-tight">Написать в Telegram</span>
                      </a>
                    </li>
                  </ul>
                  <ul
                    className="mt-3 shrink-0 space-y-1.5 border-2 border-black bg-neutral-50 px-2.5 py-2 text-[11px] font-semibold leading-snug text-neutral-800 sm:text-xs"
                    aria-label="Преимущества"
                  >
                    {MASTER_HIGHLIGHTS.map(line => (
                      <li key={line} className="flex gap-2">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-black" strokeWidth={2.5} aria-hidden />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                  <div
                    className="mt-3 flex min-h-0 flex-1 flex-col border-t-2 border-black pt-2"
                    aria-label="Частые вопросы"
                  >
                    <p className="w-full shrink-0 text-center text-xs font-black uppercase tracking-[0.14em] text-neutral-800 sm:text-sm">
                      Частые вопросы
                    </p>
                    <div className="mt-1.5 grid shrink-0 grid-cols-3 gap-1.5 sm:gap-2">
                      {STRINGING_FAQ.map((item, index) => {
                        const open = openFaqIndex === index;
                        return (
                          <button
                            key={item.q}
                            type="button"
                            title={item.q}
                            onClick={() => setOpenFaqIndex(open ? null : index)}
                            className={`sketch-input flex min-h-[3.25rem] flex-col items-center justify-center gap-1 border-2 border-black px-1.5 py-1.5 text-center transition-colors sm:min-h-[3.5rem] sm:px-2 ${
                              open ? 'bg-primary/40' : 'bg-white hover:bg-neutral-50'
                            }`}
                            aria-expanded={open}
                            aria-label={item.q}
                          >
                            <span className="line-clamp-2 text-[10px] font-black leading-tight text-gray-900 sm:text-xs">
                              {item.short}
                            </span>
                            <ChevronDown
                              className={`h-4 w-4 shrink-0 text-black transition-transform sm:h-[1.125rem] sm:w-[1.125rem] ${open ? 'rotate-180' : ''}`}
                              strokeWidth={2.5}
                              aria-hidden
                            />
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-1.5 flex min-h-0 flex-1 flex-col border-2 border-black bg-neutral-50">
                      {openFaqIndex !== null ? (
                        <div className="flex min-h-0 flex-1 flex-col justify-center gap-3 px-3 py-4 text-center sm:gap-3.5 sm:px-4 sm:py-5">
                          <span className="text-sm font-black leading-snug text-gray-900 sm:text-base">
                            {STRINGING_FAQ[openFaqIndex].q}
                          </span>
                          <span className="text-sm leading-relaxed text-neutral-800 sm:text-[15px] sm:leading-relaxed">
                            {STRINGING_FAQ[openFaqIndex].a}
                          </span>
                        </div>
                      ) : (
                        <div className="flex min-h-[2.5rem] flex-1 items-center justify-center bg-neutral-50" aria-hidden />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {tensionCustomOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tension-custom-title"
          onClick={() => setTensionCustomOpen(false)}
        >
          <div
            className="relative w-full max-w-xs border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000] sm:p-5"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setTensionCustomOpen(false)}
              className="absolute right-2 top-2 rounded border-2 border-transparent p-1 text-black hover:border-black"
              aria-label="Закрыть"
            >
              <X className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <h3 id="tension-custom-title" className="pr-7 font-black text-sm text-gray-900 sm:text-base">
              Своё натяжение (кг)
            </h3>
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={customTensionDraft}
              onChange={e => setCustomTensionDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  applyCustomTension();
                }
              }}
              className="sketch-input mt-3 w-full border-2 border-black bg-white px-3 py-2.5 text-sm font-bold tabular-nums text-gray-900"
              placeholder="11,5"
            />
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setTensionCustomOpen(false)}
                className="flex-1 border-2 border-black bg-white py-2 text-xs font-black uppercase text-gray-800"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={applyCustomTension}
                disabled={!isValidTensionKg(customTensionDraft.trim().replace(',', '.'))}
                className="flex-1 border-2 border-black bg-primary py-2 text-xs font-black uppercase text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {contactModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="stringing-contact-modal-title"
          onClick={() => {
            setContactModalOpen(false);
            setPendingOrderDraft(null);
          }}
        >
          <div
            className="relative w-full max-w-sm border-2 border-black bg-white p-5 shadow-[4px_4px_0_0_#000] sm:p-6"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                setContactModalOpen(false);
                setPendingOrderDraft(null);
              }}
              className="absolute right-2 top-2 rounded border-2 border-transparent p-1 text-black hover:border-black"
              aria-label="Закрыть"
            >
              <X className="h-5 w-5" strokeWidth={2.5} />
            </button>
            <h3 id="stringing-contact-modal-title" className="pr-8 font-black text-base text-gray-900 sm:text-lg">
              Свяжитесь с мастером
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">
              Чтобы передать ракетку на перетяжку, напишите мастеру — договоритесь о времени и передаче ракетки.
            </p>
            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-neutral-500">Контакты</p>
            <ul className="mt-2 space-y-2">
              <li>
                <a
                  href={MASTER_SOCIAL.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border-2 border-black bg-white px-3 py-2 text-sm font-bold text-gray-900 shadow-[2px_2px_0_0_#000] transition-transform hover:-translate-y-0.5"
                >
                  <Send className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
                  Telegram
                </a>
              </li>
              <li>
                <a
                  href={MASTER_SOCIAL.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border-2 border-black bg-white px-3 py-2 text-sm font-bold text-gray-900 shadow-[2px_2px_0_0_#000] transition-transform hover:-translate-y-0.5"
                >
                  <Instagram className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={MASTER_SOCIAL.viber}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border-2 border-black bg-white px-3 py-2 text-sm font-bold text-gray-900 shadow-[2px_2px_0_0_#000] transition-transform hover:-translate-y-0.5"
                >
                  <Phone className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
                  Viber
                </a>
              </li>
            </ul>

            <div className="mt-5 border-t-2 border-neutral-200 pt-4">
              <p className="text-xs font-bold leading-relaxed text-neutral-700">
                После связи с мастером нажмите «Сохранить в профиль» — заказ появится во вкладке «Все заказы» на этой
                странице и в профиле во вкладке «Мои заказы».
              </p>
              {!isAuthenticated ? (
                <p className="mt-3 text-sm text-neutral-800">
                  <Link
                    to="/login"
                    state={{ from: '/stringing' }}
                    className="font-black underline decoration-2 underline-offset-2"
                  >
                    Войдите
                  </Link>
                  , чтобы сохранить заказ в профиль.
                </p>
              ) : null}
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setContactModalOpen(false);
                    setPendingOrderDraft(null);
                  }}
                  className="flex-1 border-2 border-black bg-white py-2.5 text-xs font-black uppercase text-gray-800"
                >
                  Закрыть
                </button>
                <button
                  type="button"
                  disabled={!user || !pendingOrderDraft}
                  onClick={confirmSaveOrderFromModal}
                  className="flex-1 border-2 border-black bg-primary py-2.5 text-xs font-black uppercase text-black disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Сохранить в профиль
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {successModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="stringing-success-modal-title"
          onClick={() => setSuccessModalOpen(false)}
        >
          <div
            className="relative w-full max-w-sm border-2 border-black bg-white p-5 shadow-[4px_4px_0_0_#000] sm:p-6"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSuccessModalOpen(false)}
              className="absolute right-2 top-2 rounded border-2 border-transparent p-1 text-black hover:border-black"
              aria-label="Закрыть"
            >
              <X className="h-5 w-5" strokeWidth={2.5} />
            </button>
            <div className="flex items-start gap-3 pr-8">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-black bg-primary shadow-[2px_2px_0_0_#000]">
                <CheckCircle2 className="h-6 w-6 text-black" strokeWidth={2.5} aria-hidden />
              </div>
              <div>
                <h3 id="stringing-success-modal-title" className="font-black text-base text-gray-900 sm:text-lg">
                  Заказ добавлен
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                  Заказ появился в профиле во вкладке «Мои заказы» и в списке «Все заказы» на этой странице. Первый этап
                  — «В передаче»: ожидается передача ракетки мастеру; дальнейшие этапы обновит мастер по мере работы.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-neutral-700">
                  Когда ракетка будет готова к выдаче, на указанную в профиле электронную почту придёт письмо с
                  напоминанием забрать заказ.
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setSuccessModalOpen(false)}
                className="flex-1 border-2 border-black bg-white py-2.5 text-xs font-black uppercase text-gray-800"
              >
                Понятно
              </button>
              <Link
                to="/profile?tab=orders"
                onClick={() => setSuccessModalOpen(false)}
                className="flex flex-1 items-center justify-center gap-2 border-2 border-black bg-primary py-2.5 text-center text-xs font-black uppercase text-black"
              >
                В профиль
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
