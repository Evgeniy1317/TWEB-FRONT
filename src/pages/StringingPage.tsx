import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
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

const STRINGING_HERO_IMG = '/media/images/original-7aa6660ec4e2a8199a342ced2a016ac5.webp';

/** Портрет мастера: положите файл в public/media/images/ (например stringing-master.webp) */
const STRINGING_MASTER_IMG = '/media/images/5368680524567746267.jpg';

const STRINGING_VIDEO_SRC = '/media/videos/IMG_0198.mp4';

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
  const [activeTab, setActiveTab] = useState<'order' | 'history'>('order');
  const [form, setForm] = useState<OrderForm>({
    racketModel: '',
    tension: '11.5',
    stringType: STRING_IN_STOCK[0].id,
  });
  const [contactModalOpen, setContactModalOpen] = useState(false);
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
    if (!contactModalOpen && !tensionCustomOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [contactModalOpen, tensionCustomOpen]);

  const tensionIsPreset = TENSION_PRESETS.some(p => String(p) === form.tension);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValidTensionKg(form.tension)) return;
    setContactModalOpen(true);
  };

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
              Мои заказы
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
              <div className="border-2 border-black bg-white p-5 sketch-shadow sm:p-6 sm:pr-7 rounded-md">
                <div className="flex items-start gap-4 sm:gap-5">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center self-start border-2 border-black shadow-[2px_2px_0_0_#000] sm:h-[3.25rem] sm:w-[3.25rem]"
                    style={{ backgroundColor: '#E6EDA5' }}
                    aria-hidden
                  >
                    <ClipboardList className="h-6 w-6 text-black" strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <h3 className="font-black text-lg leading-tight text-gray-900 sm:text-xl">Мои заказы и статус</h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                      Смотрите список и статус перетяжки в личном профиле.
                    </p>
                    <Link
                      to="/profile"
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 border-2 border-black bg-primary px-5 py-3 text-sm font-black uppercase tracking-wide text-black sketch-shadow-sm transition-transform hover:-translate-y-0.5 sm:w-auto"
                    >
                      Перейти в профиль
                      <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                    </Link>
                  </div>
                </div>
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
                  <div className="flex shrink-0 flex-col items-start gap-2 sm:flex-row sm:items-stretch sm:gap-3">
                    <div className="relative w-[10.5rem] shrink-0 self-start sm:w-[12rem]">
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
                    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 text-left sm:h-full sm:justify-between sm:gap-0">
                      <div className="shrink-0">
                        <p className="font-black text-xl leading-tight text-gray-900 sm:text-2xl">Anzor Sturza</p>
                        <p className="mt-1 text-sm leading-snug text-neutral-700 sm:text-[15px] sm:leading-relaxed">
                          Работает на электронном станке, подбирает натяжение струн и тип струны под ваш стиль игры. Принимает
                          ракетки по записи, консультирует по струнам и уходу за кадром.
                        </p>
                      </div>
                      <ul className="grid shrink-0 grid-cols-1 gap-1.5 sm:grid-cols-2 sm:gap-2">
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
                    </div>
                  </div>
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
          onClick={() => setContactModalOpen(false)}
        >
          <div
            className="relative w-full max-w-sm border-2 border-black bg-white p-5 shadow-[4px_4px_0_0_#000] sm:p-6"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setContactModalOpen(false)}
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
          </div>
        </div>
      )}
    </div>
  );
}
