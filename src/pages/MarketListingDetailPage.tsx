import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, SquarePen, Trash2, X, Plus } from 'lucide-react';
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMarketSellerForProduct, products } from '../data/mockData';
import { useProfileListings } from '../context/ProfileListingsContext';
import { marketSellerFromProduct } from '../utils/marketSellerFromProduct';
import { telHref } from '../utils/contactLinks';
import { buildListingGalleryUrls } from '../utils/listingDetailSpecs';
import { ListingDetailMedia } from '../components/listing/ListingDetailMedia';
import { ListingDetailSpecsPanel } from '../components/listing/ListingDetailSpecsPanel';
import { productService } from '../services/api';
import type { Product, ProductCategory, ProductCondition, ProductFit } from '../types';
import {
  categoryHasFitField,
  categoryHasSizeField,
  FIT_FORM_OPTIONS,
  normalizeProductFit,
  SIZE_OPTIONS_BY_CATEGORY,
} from '../utils/productCategoryFields';

/** Плоский цвет кнопки под соцсеть */
function socialLinkClass(label: string): string {
  const s = label.toLowerCase();
  const base =
    'inline-flex border-2 border-black px-2.5 py-1 text-[11px] font-bold text-white shadow-[2px_2px_0_0_#000] hover:brightness-110';
  if (s.includes('telegram')) return `${base} bg-[#229ED9]`;
  if (s.includes('instagram')) return `${base} bg-[#E4405F]`;
  if (s.includes('viber')) return `${base} bg-[#7360F2]`;
  if (s.includes('facebook')) return `${base} bg-[#1877F2]`;
  if (s.includes('whatsapp')) return `${base} bg-[#25D366]`;
  return `${base} bg-neutral-600`;
}

export default function MarketListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const numericId = id ? Number.parseInt(id, 10) : NaN;
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { listings: profileListings } = useProfileListings();
  const product = Number.isFinite(numericId)
    ? profileListings.find(p => p.id === numericId) ?? products.find(p => p.id === numericId)
    : undefined;
  const canAdminEdit = Boolean(user && user.role === 'admin');

  const TEST_MODE_KEY = 'smash_test_mode';
  const DELETED_PRODUCTS_KEY = 'smash_deleted_products_v1';

  const loadDeletedIds = (): number[] => {
    try {
      const raw = localStorage.getItem(DELETED_PRODUCTS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((x: unknown) => Number(x)).filter((n: number) => Number.isFinite(n));
    } catch {
      return [];
    }
  };

  const saveDeletedIds = (ids: number[]) => {
    try {
      localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(ids));
    } catch {
      // ignore
    }
  };

  const markDeleted = (productId: number) => {
    const ids = loadDeletedIds();
    if (!ids.includes(productId)) saveDeletedIds([...ids, productId]);
  };

  const [apiProduct, setApiProduct] = useState<Product | undefined>(undefined);
  useEffect(() => {
    if (!canAdminEdit || !Number.isFinite(numericId)) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await productService.getById(numericId);
        if (cancelled) return;
        setApiProduct(res.data);
      } catch {
        if (cancelled) return;
        setApiProduct(undefined);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [canAdminEdit, numericId]);

  const effectiveProduct = apiProduct ?? product;
  const isUserListing = Boolean(
    Number.isFinite(numericId) && profileListings.some(p => p.id === numericId),
  );

  const galleryUrls = useMemo(
    () => (effectiveProduct ? buildListingGalleryUrls(effectiveProduct) : []),
    [effectiveProduct],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [contactsOpen, setContactsOpen] = useState(false);
  const [adminEditOpen, setAdminEditOpen] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [imageUploadBusy, setImageUploadBusy] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  type AdminProductFormState = {
    title: string;
    category: ProductCategory;
    condition: ProductCondition;
    price: string;
    colorLabel: string;
    description: string;
    image: string;
    imagePreviews: string[];
    sizeLabel: string;
    fit: ProductFit;
  };

  const initialAdminForm: AdminProductFormState | null = useMemo(() => {
    if (!effectiveProduct) return null;
    const previews = [effectiveProduct.image, ...(effectiveProduct.extraImages ?? [])].filter(Boolean).slice(0, 8);
    return {
      title: effectiveProduct.title,
      category: effectiveProduct.category,
      condition: effectiveProduct.condition,
      price: String(effectiveProduct.price),
      colorLabel: effectiveProduct.colorLabel ?? '',
      description: effectiveProduct.description,
      image: previews[0] ?? '',
      imagePreviews: previews,
      sizeLabel: effectiveProduct.sizeLabel ?? '',
      fit: effectiveProduct.fit ? normalizeProductFit(effectiveProduct.fit) : 'unisex',
    };
  }, [effectiveProduct]);

  const [adminForm, setAdminForm] = useState<AdminProductFormState | null>(null);
  useEffect(() => {
    if (!adminEditOpen) return;
    if (!initialAdminForm) return;
    setAdminForm(initialAdminForm);
    setAdminError('');
  }, [adminEditOpen, initialAdminForm]);

  const sanitizePriceInput = (value: string) => value.replace(/\D+/g, '');

  const handleAdminImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    if (files.some(f => f.type !== 'image/png')) {
      event.target.value = '';
      return;
    }
    setImageUploadBusy(true);
    try {
      const images = await Promise.all(
        files.map(
          file =>
            new Promise<string>(resolve => {
              const reader = new FileReader();
              reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
              reader.readAsDataURL(file);
            }),
        ),
      );
      const validImages = images.filter(Boolean);
      setAdminForm(prev => {
        if (!prev) return prev;
        const nextPreviews = [...prev.imagePreviews, ...validImages].slice(0, 8);
        return {
          ...prev,
          image: nextPreviews[0] ?? '',
          imagePreviews: nextPreviews,
        };
      });
      event.target.value = '';
    } finally {
      setImageUploadBusy(false);
    }
  };

  const handleAdminImageRemove = (indexToRemove: number) => {
    setAdminForm(prev => {
      if (!prev) return prev;
      const nextPreviews = prev.imagePreviews.filter((_, idx) => idx !== indexToRemove);
      return { ...prev, imagePreviews: nextPreviews, image: nextPreviews[0] ?? '' };
    });
  };

  useEffect(() => {
    setActiveIndex(0);
  }, [numericId]);

  if (!effectiveProduct) {
    return (
      <div className="sketch-page min-h-[calc(100dvh-4.5rem)] w-full px-4 py-10 text-gray-900 sm:px-6">
        <p className="font-black text-lg">Объявление не найдено</p>
        <Link
          to="/market"
          className="mt-4 inline-block border-2 border-black bg-white px-4 py-2 text-sm font-bold sketch-shadow-sm hover:bg-neutral-100"
        >
          К барахолке
        </Link>
      </div>
    );
  }

  const seller = isUserListing ? marketSellerFromProduct(effectiveProduct) : getMarketSellerForProduct(effectiveProduct.id);

  return (
    <div className="sketch-page min-h-[calc(100dvh-4.5rem)] w-full text-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Link
          to="/market"
          className="mb-6 inline-flex items-center gap-2 border-2 border-black bg-white px-3 py-2 text-sm font-bold sketch-shadow-sm hover:bg-neutral-100"
        >
          <ArrowLeft size={18} strokeWidth={2.5} aria-hidden />
          К списку
        </Link>

        <div className="mb-8 flex flex-wrap items-start justify-between gap-3 sm:gap-4">
          <h1 className="min-w-0 flex-1 text-xl font-black tracking-tight sm:text-2xl">{effectiveProduct.title}</h1>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            {isUserListing && isAuthenticated ? (
              <Link
                to={`/profile?edit=${effectiveProduct.id}`}
                onClick={() => {
                  try {
                    window.sessionStorage.setItem('sm-profile-edit-id', String(effectiveProduct.id));
                  } catch {
                    /* ignore */
                  }
                }}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-black bg-white text-gray-900 shadow-[2px_2px_0_0_#000] transition-colors hover:bg-primary/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label="Редактировать объявление"
                title="Редактировать объявление"
              >
                <SquarePen size={20} strokeWidth={2.2} aria-hidden />
              </Link>
            ) : null}

            {canAdminEdit ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      window.sessionStorage.setItem('sm-profile-edit-id', String(effectiveProduct.id));
                    } catch {
                      /* ignore */
                    }
                    navigate(`/profile?edit=${effectiveProduct.id}`, {
                      state: { editListingId: effectiveProduct.id, editProduct: effectiveProduct },
                    });
                  }}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-black bg-white text-gray-900 shadow-[2px_2px_0_0_#000] transition-colors hover:bg-neutral-100"
                  aria-label="Редактировать товар"
                  title="Редактировать товар"
                >
                  <SquarePen size={20} strokeWidth={2.2} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAdminError('');
                    setDeleteConfirmOpen(true);
                  }}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-red-200 bg-white text-red-600 shadow-[2px_2px_0_0_#000] transition-colors hover:bg-red-50"
                  aria-label="Удалить товар"
                  title="Удалить товар"
                >
                  <Trash2 size={20} strokeWidth={2.2} aria-hidden />
                </button>
              </>
            ) : null}
          </div>
        </div>

        {canAdminEdit && adminError ? (
          <div className="mb-6 border-2 border-black bg-amber-50 p-3 text-sm font-semibold sketch-shadow-sm">
            {adminError}
          </div>
        ) : null}

        {canAdminEdit && deleteConfirmOpen ? (
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-confirm-title"
            onClick={() => setDeleteConfirmOpen(false)}
          >
            <div
              className="relative w-full max-w-sm border-2 border-black bg-white p-5 sketch-shadow sm:p-6"
              onClick={e => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                className="absolute right-2 top-2 inline-flex h-10 w-10 items-center justify-center rounded border-2 border-black bg-white hover:bg-neutral-100"
                aria-label="Закрыть"
              >
                <X size={18} strokeWidth={2.5} aria-hidden />
              </button>

              <h2 id="delete-confirm-title" className="pr-10 text-xl font-black text-gray-900">
                Удалить товар?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700">Это действие нельзя отменить.</p>

              {adminError ? (
                <div className="mt-3 border-2 border-black bg-amber-50 p-3 text-sm font-semibold sketch-shadow-sm">
                  {adminError}
                </div>
              ) : null}

              <div className="mt-5 flex gap-3 border-t-2 border-black pt-4">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="flex-1 border-2 border-black bg-white px-3 py-2 text-xs font-black uppercase tracking-wide text-gray-900 transition-colors hover:bg-neutral-100"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      setAdminError('');
                      if (!Number.isFinite(numericId)) return;
                      const isTestMode = typeof window !== 'undefined' && localStorage.getItem('smash_test_mode') === '1';
                      if (isTestMode) {
                        // В тестовом режиме удаляем из локального хранилища и помечаем, чтобы карточка исчезла.
                        void productService.delete(numericId);
                        markDeleted(numericId);
                        navigate('/market');
                        return;
                      }
                      await productService.delete(numericId);
                      markDeleted(numericId);
                      navigate('/market');
                    } catch {
                      setAdminError('Не удалось удалить товар.');
                    } finally {
                      setDeleteConfirmOpen(false);
                    }
                  }}
                  className="flex-1 border-2 border-black bg-red-600 px-3 py-2 text-xs font-black uppercase tracking-wide text-white transition-colors hover:bg-red-700"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {canAdminEdit && adminEditOpen ? (
          <div className="mb-8 border-2 border-black bg-white p-5 sketch-shadow sm:p-6">
            <div className="mb-4 flex items-start justify-between gap-3 border-b-2 border-black pb-3">
              <div>
                <h2 className="text-2xl font-black tracking-tight">Редактирование товара</h2>
                <p className="mt-2 text-sm text-neutral-600">Изменения сохраняются на сервере.</p>
              </div>
              <button
                type="button"
                onClick={() => setAdminEditOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded border-2 border-black bg-white hover:bg-neutral-100"
                aria-label="Закрыть"
              >
                <X size={18} strokeWidth={2.5} aria-hidden />
              </button>
            </div>

            {adminError ? (
              <div className="mb-4 border-2 border-black bg-amber-50 p-3 text-sm font-semibold sketch-shadow-sm">
                {adminError}
              </div>
            ) : null}

            {adminForm ? (
              <form
                onSubmit={async (e: FormEvent) => {
                  e.preventDefault();
                  if (!adminForm || !Number.isFinite(numericId)) return;
                  try {
                    setAdminError('');
                    const payload: Partial<Omit<Product, 'id'>> = {
                      title: adminForm.title.trim(),
                      category: adminForm.category,
                      condition: adminForm.condition,
                      price: Number.parseInt(adminForm.price, 10),
                      colorLabel: adminForm.colorLabel.trim() || undefined,
                      description: adminForm.description.trim(),
                      image: adminForm.imagePreviews[0] ?? adminForm.image ?? '',
                      extraImages: adminForm.imagePreviews.length > 1 ? adminForm.imagePreviews.slice(1) : undefined,
                      sizeLabel:
                        categoryHasSizeField(adminForm.category) && adminForm.sizeLabel.trim()
                          ? adminForm.sizeLabel.trim()
                          : undefined,
                      fit: categoryHasFitField(adminForm.category) ? normalizeProductFit(adminForm.fit) : undefined,
                    };

                    await productService.update(numericId, payload);
                    const res = await productService.getById(numericId);
                    setApiProduct(res.data);
                    setAdminEditOpen(false);
                  } catch {
                    setAdminError('Не удалось сохранить изменения.');
                  }
                }}
                className="space-y-5"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.24em] text-neutral-500">
                      Название
                    </span>
                    <input
                      required
                      type="text"
                      value={adminForm.title}
                      onChange={e => setAdminForm(p => (p ? { ...p, title: e.target.value } : p))}
                      className="w-full border-2 border-black bg-white px-3 py-3 text-sm font-bold outline-none"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.24em] text-neutral-500">
                      Категория
                    </span>
                    <select
                      value={adminForm.category}
                      onChange={e => {
                        const next = e.target.value as ProductCategory;
                        setAdminForm(p => {
                          if (!p) return p;
                          const prevHasSize = categoryHasSizeField(p.category);
                          const nextHasSize = categoryHasSizeField(next);
                          return {
                            ...p,
                            category: next,
                            sizeLabel: !nextHasSize ? '' : prevHasSize ? p.sizeLabel : '',
                            fit: categoryHasFitField(next) ? p.fit : 'unisex',
                          };
                        });
                      }}
                      className="w-full border-2 border-black bg-white px-3 py-3 text-sm font-bold outline-none"
                    >
                      {[
                        'rackets',
                        'shuttlecocks',
                        'strings',
                        'shoes',
                        'bags',
                        'clothing',
                        'accessories',
                        'grips',
                        'knee_braces',
                        'socks',
                        'nets_stands',
                        'court_inventory',
                        'other',
                      ].map(c => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.24em] text-neutral-500">
                      Цена
                    </span>
                    <input
                      required
                      inputMode="numeric"
                      pattern="[0-9]*"
                      type="text"
                      value={adminForm.price}
                      onChange={e => setAdminForm(p => (p ? { ...p, price: sanitizePriceInput(e.target.value) } : p))}
                      className="w-full border-2 border-black bg-white px-3 py-3 text-sm font-bold outline-none"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.24em] text-neutral-500">
                      Условие
                    </span>
                    <select
                      value={adminForm.condition}
                      onChange={e => setAdminForm(p => (p ? { ...p, condition: e.target.value as ProductCondition } : p))}
                      className="w-full border-2 border-black bg-white px-3 py-3 text-sm font-bold outline-none"
                    >
                      <option value="new">Новый</option>
                      <option value="used">Б/У</option>
                    </select>
                  </label>
                </div>

                {categoryHasSizeField(adminForm.category) ? (
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.24em] text-neutral-500">
                      Размер
                    </span>
                    <select
                      value={adminForm.sizeLabel}
                      onChange={e => setAdminForm(p => (p ? { ...p, sizeLabel: e.target.value } : p))}
                      className="w-full border-2 border-black bg-white px-3 py-3 text-sm font-bold outline-none"
                    >
                      <option value="">Не указано</option>
                      {SIZE_OPTIONS_BY_CATEGORY[adminForm.category as 'shoes' | 'clothing' | 'socks'].map(sz => (
                        <option key={sz} value={sz}>
                          {sz}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}

                {categoryHasFitField(adminForm.category) ? (
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.24em] text-neutral-500">
                      Для кого
                    </span>
                    <select
                      value={adminForm.fit}
                      onChange={e => setAdminForm(p => (p ? { ...p, fit: e.target.value as ProductFit } : p))}
                      className="w-full border-2 border-black bg-white px-3 py-3 text-sm font-bold outline-none"
                    >
                      {FIT_FORM_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}

                <label className="block">
                  <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.24em] text-neutral-500">
                    Цвет (опционально)
                  </span>
                  <input
                    type="text"
                    value={adminForm.colorLabel}
                    onChange={e => setAdminForm(p => (p ? { ...p, colorLabel: e.target.value } : p))}
                    className="w-full border-2 border-black bg-white px-3 py-3 text-sm font-bold outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.24em] text-neutral-500">
                    Описание
                  </span>
                  <textarea
                    required
                    rows={5}
                    value={adminForm.description}
                    onChange={e => setAdminForm(p => (p ? { ...p, description: e.target.value } : p))}
                    className="w-full resize-y border-2 border-black bg-white px-3 py-3 text-sm font-bold outline-none"
                  />
                </label>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <label className="block">
                      <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.24em] text-neutral-500">
                        Фото (PNG)
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/png"
                        disabled={imageUploadBusy}
                        onChange={handleAdminImageChange}
                        className="w-full text-sm"
                      />
                    </label>
                  </div>

                  {adminForm.imagePreviews.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {adminForm.imagePreviews.map((src, index) => (
                        <div key={`${src}-${index}`} className="relative h-16 w-16 overflow-hidden border-2 border-black bg-white">
                          <img src={src} alt="" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleAdminImageRemove(index)}
                            className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center border-l-2 border-b-2 border-black bg-white text-[10px] font-black leading-none text-black hover:bg-neutral-100"
                            aria-label={`Удалить фото ${index + 1}`}
                          >
                            ×
                          </button>
                          {index === 0 ? (
                            <span className="absolute inset-x-0 bottom-0 bg-black px-1 py-0.5 text-center text-[8px] font-bold uppercase text-white">
                              Главная
                            </span>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-3 border-t-2 border-black pt-4">
                  <button
                    type="submit"
                    className="border-2 border-black bg-primary px-5 py-3 font-bold text-black sketch-shadow-sm transition-colors hover:bg-primary-dark"
                  >
                    Сохранить
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminEditOpen(false)}
                    className="border-2 border-black bg-white px-5 py-3 font-bold text-black transition-colors hover:bg-neutral-100"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-col gap-8 lg:grid lg:min-h-0 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-stretch lg:gap-x-10 lg:gap-y-0">
          <ListingDetailMedia
            galleryUrls={galleryUrls}
            activeIndex={activeIndex}
            onActiveIndexChange={setActiveIndex}
            productTitle={effectiveProduct.title}
          />

          <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:min-h-0 lg:h-full lg:w-full lg:min-w-0">
            <div className="flex shrink-0 flex-col gap-3">
              <div className="flex w-full min-w-0 shrink-0 flex-wrap items-center gap-x-2 gap-y-2 sm:gap-x-3">
                <div className="inline-flex max-w-[13rem] min-w-0 flex-col items-center rounded-full border-2 border-black bg-white px-4 py-2 shadow-[3px_3px_0_0_#000] ring-1 ring-inset ring-black/[0.06] sm:px-5 sm:py-2.5">
                  <span className="text-[9px] font-black uppercase tracking-[0.22em] text-neutral-500">Цена</span>
                  <span className="mt-0.5 text-center text-base font-black tabular-nums leading-none tracking-tight text-gray-900 sm:text-lg">
                    {effectiveProduct.price.toLocaleString('ro-MD')} MDL
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setContactsOpen(o => !o)}
                  aria-expanded={contactsOpen}
                  className="ml-auto shrink-0 border-2 border-black bg-primary px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-black shadow-[2px_2px_0_0_#000] hover:bg-[#00C853] sm:px-3.5 sm:py-2 sm:text-xs"
                >
                  {contactsOpen ? 'Скрыть контакты' : 'Показать контакты продавца'}
                </button>
              </div>

              <div className="h-[7rem] w-full shrink-0">
                {contactsOpen ? (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 overflow-y-auto border-2 border-black bg-white px-3 py-2.5 sketch-shadow-sm sm:gap-2.5 sm:px-4">
                    <span className="sr-only">Контакты продавца {seller.name}</span>
                    {seller.phone ? (
                      <div className="flex w-full shrink-0 items-center gap-2">
                        <div className="h-px min-w-0 flex-1 border-t border-dashed border-neutral-600" aria-hidden />
                        <a
                          href={telHref(seller.phone)}
                          className="shrink-0 text-sm font-black tabular-nums text-gray-900 underline decoration-2 underline-offset-2 hover:text-primary"
                        >
                          {seller.phone}
                        </a>
                        <div className="h-px min-w-0 flex-1 border-t border-dashed border-neutral-600" aria-hidden />
                      </div>
                    ) : null}
                    {seller.links.length > 0 ? (
                      <div className="flex w-full flex-wrap items-center justify-center gap-2">
                        {seller.links.map(link => (
                          <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={socialLinkClass(link.label)}
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>

            <ListingDetailSpecsPanel product={effectiveProduct} />
          </div>
        </div>

        <section
          className="mt-10 border-2 border-black bg-white p-4 sm:p-6 sketch-shadow rounded-md"
          aria-labelledby="listing-desc"
        >
          <h2 id="listing-desc" className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">
            Описание
          </h2>
          <p className="text-sm leading-relaxed text-neutral-800 sm:text-base">{effectiveProduct.description}</p>
        </section>
      </div>
    </div>
  );
}
