import { useEffect, useLayoutEffect, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useStringingOrders } from '../context/StringingOrdersContext';
import StatusTracker from '../components/StatusTracker';
import type { Product, ProductCategory, ProductCondition, ProductFit, UserContact, UserContactPlatform } from '../types';
import {
  categoryHasFitField,
  categoryHasSizeField,
  FIT_FORM_OPTIONS,
  normalizeProductFit,
  SIZE_OPTIONS_BY_CATEGORY,
} from '../utils/productCategoryFields';
import { buildContactHref, CONTACT_PLATFORM_LABEL } from '../utils/contactLinks';
import { ClipboardList, LogOut, Mail, Phone, Plus, ShoppingBag, ShoppingCart, SquarePen, Trash2, X } from 'lucide-react';
import { useProfileListings } from '../context/ProfileListingsContext';

type ProfileTab = 'listings' | 'cart' | 'orders' | 'edit';

type ProfileLocationState = { editListingId?: number };

type ProfileNavItem = {
  id: ProfileTab;
  label: string;
  icon: typeof ShoppingBag;
};

type ListingFormState = {
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

type EditProfileFormState = {
  name: string;
  email: string;
  phone: string;
  contacts: UserContact[];
};

type ContactPlatformOption = {
  value: UserContactPlatform;
  label: string;
};

const contactPlatformOptions: ContactPlatformOption[] = [
  { value: 'telegram', label: 'Telegram' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'viber', label: 'Viber' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'whatsapp', label: 'WhatsApp' },
];

const MAX_SOCIAL_CONTACTS = 5;

function isUserContactPlatform(value: string): value is UserContactPlatform {
  return contactPlatformOptions.some(o => o.value === value);
}

/** Убирает дубликаты платформ, легаси «other» → telegram, не больше 5 */
function normalizeContactsForEdit(contacts: UserContact[]): UserContact[] {
  const seen = new Set<UserContactPlatform>();
  const out: UserContact[] = [];
  for (const c of contacts) {
    const raw = c.platform as string;
    const platform: UserContactPlatform =
      raw === 'other' || !isUserContactPlatform(raw) ? 'telegram' : raw;
    if (seen.has(platform)) continue;
    seen.add(platform);
    out.push({ ...c, platform });
    if (out.length >= MAX_SOCIAL_CONTACTS) break;
  }
  return out;
}

const profileTabs: ProfileNavItem[] = [
  { id: 'listings', label: 'Мои объявления', icon: ShoppingBag },
  { id: 'cart', label: 'Корзина', icon: ShoppingCart },
  { id: 'orders', label: 'Мои заказы и статус', icon: ClipboardList },
  { id: 'edit', label: 'Изменить профиль', icon: SquarePen },
];

const categoryLabel: Record<ProductCategory, string> = {
  rackets: 'Ракетки',
  shoes: 'Обувь',
  shuttlecocks: 'Воланы',
  strings: 'Струны для перетяжки',
  bags: 'Сумки и чехлы',
  clothing: 'Одежда',
  accessories: 'Аксессуары',
  grips: 'Обмотки',
  knee_braces: 'Тейпы и бандажи',
  socks: 'Носки',
  nets_stands: 'Сетки и стойки',
  court_inventory: 'Инвентарь для зала',
  other: 'Другое',
};

const initialListingForm: ListingFormState = {
  title: '',
  category: 'rackets',
  condition: 'new',
  price: '',
  colorLabel: '',
  description: '',
  image: '',
  imagePreviews: [],
  sizeLabel: '',
  fit: 'unisex',
};

const sanitizePriceInput = (value: string) => value.replace(/\D+/g, '');

function blockNonNumericKeys(event: KeyboardEvent<HTMLInputElement>) {
  if (['e', 'E', '+', '-', '.', ','].includes(event.key)) {
    event.preventDefault();
  }
}

function productToForm(p: Product): ListingFormState {
  const previews = [p.image, ...(p.extraImages ?? [])].slice(0, 8);
  return {
    title: p.title,
    category: p.category,
    condition: p.condition,
    price: String(p.price),
    colorLabel: p.colorLabel ?? '',
    description: p.description,
    image: previews[0] ?? '',
    imagePreviews: previews,
    sizeLabel: p.sizeLabel ?? '',
    fit: normalizeProductFit(p.fit),
  };
}

function listingHasSellerSnapshot(p: Product): boolean {
  return (
    Boolean(p.sellerPhone?.trim()) ||
    (p.sellerContacts?.some(c => c.value.trim().length > 0) ?? false)
  );
}

const getContactPlatformLabel = (platform: UserContactPlatform): string =>
  CONTACT_PLATFORM_LABEL[platform] ?? 'Контакт';

const getContactButtonClass = (platform: UserContactPlatform): string => {
  const base =
    'inline-flex items-center justify-center border-2 border-black px-3 py-1.5 text-xs font-black text-white sketch-shadow-sm transition-transform hover:-translate-y-0.5';
  if (platform === 'telegram') return `${base} bg-[#229ED9]`;
  if (platform === 'instagram') return `${base} bg-[#E4405F]`;
  if (platform === 'viber') return `${base} bg-[#7360F2]`;
  if (platform === 'facebook') return `${base} bg-[#1877F2]`;
  if (platform === 'whatsapp') return `${base} bg-[#25D366]`;
  return `${base} bg-neutral-600`;
};

const isProfileTab = (value: string | null): value is ProfileTab =>
  value === 'listings' || value === 'cart' || value === 'orders' || value === 'edit';

function ProfileEmptyState({
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  actionError,
}: {
  title: string;
  description: string;
  actionLabel: string;
  actionTo?: string;
  onAction?: () => void;
  actionError?: string;
}) {
  return (
    <div className="flex min-h-[18rem] flex-col items-center justify-center border-2 border-black bg-white px-6 py-10 text-center sketch-shadow">
      <h3 className="text-2xl font-black tracking-tight">{title}</h3>
      <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600 sm:text-base">{description}</p>
      {actionTo ? (
        <Link
          to={actionTo}
          className="mt-6 border-2 border-black bg-primary px-5 py-3 font-bold text-black sketch-shadow-sm transition-colors hover:bg-primary-dark"
        >
          {actionLabel}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 border-2 border-black bg-primary px-5 py-3 font-bold text-black sketch-shadow-sm transition-colors hover:bg-primary-dark"
        >
          {actionLabel}
        </button>
      )}
      {actionError ? <p className="mt-4 max-w-xl text-sm font-bold text-red-600">{actionError}</p> : null}
    </div>
  );
}

function ProfileListingCard({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}) {
  const listingPath = `/profile/listing/${product.id}`;
  const openLabel = `${product.title} — открыть объявление`;

  return (
    <article className="relative flex flex-col overflow-hidden rounded-none border border-gray-300 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md hover:ring-2 hover:ring-primary/40">
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <Link
          to={listingPath}
          className="absolute inset-0 z-0 block outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
          aria-label={openLabel}
        >
          <img
            src={product.image}
            alt=""
            className="h-full w-full object-cover select-none"
            width={400}
            height={400}
            decoding="async"
            draggable={false}
            loading="lazy"
          />
        </Link>
        <button
          type="button"
          onClick={() => onEdit(product)}
          className="absolute left-2 top-2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-black/15 bg-white/95 text-gray-900 shadow-md outline-none transition-colors hover:bg-primary/20 focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={`Редактировать объявление ${product.title}`}
        >
          <SquarePen size={18} strokeWidth={2.2} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(product.id)}
          className="absolute right-2 top-2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-red-200/90 bg-white/95 text-red-600 shadow-md outline-none transition-colors hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-300"
          aria-label={`Удалить объявление ${product.title}`}
        >
          <Trash2 size={18} strokeWidth={2.2} />
        </button>
      </div>

      <Link
        to={listingPath}
        className="relative z-10 flex flex-col gap-1 border-t border-gray-200 p-3 sm:p-3.5"
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
          {categoryLabel[product.category]}
        </p>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900">{product.title}</h3>
        <p className="pt-0.5 text-base font-bold tabular-nums text-gray-900 sm:text-lg">
          {product.price.toLocaleString('ro-MD')} MDL
        </p>
      </Link>
    </article>
  );
}

export default function ProfilePage() {
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const { items: cartItems, count: cartCount, removeFromCart } = useCart();
  const { listings: profileListings, addListing, updateListing, deleteListing } = useProfileListings();
  const { orders: stringingOrdersAll } = useStringingOrders();
  const myStringingOrders = user ? stringingOrdersAll.filter(o => o.clientUserId === user.id) : [];
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<ProfileTab>(() => {
    const requestedTab = searchParams.get('tab');
    return isProfileTab(requestedTab) ? requestedTab : 'listings';
  });
  const [listingFormOpen, setListingFormOpen] = useState(false);
  const [listingEditingId, setListingEditingId] = useState<number | null>(null);
  const [listingContactError, setListingContactError] = useState('');
  const [listingForm, setListingForm] = useState<ListingFormState>(initialListingForm);
  const [editProfileForm, setEditProfileForm] = useState<EditProfileFormState>({
    name: '',
    email: '',
    phone: '',
    contacts: [],
  });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login', {
        replace: true,
        state: {
          from: `${location.pathname}${location.search}${location.hash}`,
        },
      });
    }
  }, [isAuthenticated, user, navigate, location.pathname, location.search, location.hash]);

  useEffect(() => {
    if (!user) return;
    setEditProfileForm({
      name: user.name,
      email: user.email,
      phone: user.phone ?? '',
      contacts: normalizeContactsForEdit(user.contacts ?? []),
    });
  }, [user]);

  useEffect(() => {
    const requestedTab = searchParams.get('tab');
    const nextTab = isProfileTab(requestedTab) ? requestedTab : 'listings';
    setActiveTab(prev => (prev === nextTab ? prev : nextTab));
  }, [searchParams]);

  const editQueryParam = searchParams.get('edit');

  useLayoutEffect(() => {
    if (!isAuthenticated || !user) return;

    const fromState = (location.state as ProfileLocationState | null)?.editListingId;
    const parsedQuery = editQueryParam ? Number.parseInt(editQueryParam, 10) : NaN;
    let id =
      Number.isFinite(parsedQuery) ? parsedQuery
      : typeof fromState === 'number' && Number.isFinite(fromState) ? fromState
      : NaN;

    if (!Number.isFinite(id)) {
      const raw = typeof window !== 'undefined' ? window.sessionStorage.getItem('sm-profile-edit-id') : null;
      if (raw) {
        window.sessionStorage.removeItem('sm-profile-edit-id');
        const parsed = Number.parseInt(raw, 10);
        if (Number.isFinite(parsed)) id = parsed;
      }
    }

    if (!Number.isFinite(id)) return;

    const listing = profileListings.find(l => l.id === id);
    if (!listing) return;

    const userHasContact =
      Boolean(user.phone?.trim()) || user.contacts.some(c => c.value.trim().length > 0);
    const canOpenEdit = userHasContact || listingHasSellerSnapshot(listing);
    if (!canOpenEdit) {
      setListingContactError('Добавьте телефон или хотя бы один дополнительный контакт в профиле, чтобы редактировать объявление.');
      return;
    }

    setListingContactError('');
    setListingForm(productToForm(listing));
    setListingEditingId(id);
    setListingFormOpen(true);
    setActiveTab('listings');
  }, [isAuthenticated, user, location.state, editQueryParam, profileListings]);

  useEffect(() => {
    if (!listingFormOpen) return;
    const timer = window.setTimeout(() => {
      document.getElementById('profile-listing-form')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [listingFormOpen, listingEditingId]);

  const stripEditFromUrl = () => {
    if (!searchParams.get('edit')) return;
    setSearchParams(
      prev => {
        const next = new URLSearchParams(prev);
        next.delete('edit');
        return next;
      },
      { replace: true },
    );
  };

  if (!isAuthenticated || !user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleTabChange = (tab: ProfileTab) => {
    setActiveTab(tab);
    setSearchParams(tab === 'listings' ? {} : { tab });
  };

  const hasAnyContactData =
    Boolean(user.phone?.trim()) || user.contacts.some(contact => contact.value.trim().length > 0);

  const handleOpenListingForm = () => {
    if (!hasAnyContactData) {
      setListingContactError('Добавьте телефон или хотя бы один дополнительный контакт в профиле, чтобы разместить объявление.');
      return;
    }

    setListingContactError('');
    setListingForm(initialListingForm);
    setListingEditingId(null);
    setListingFormOpen(true);
    stripEditFromUrl();
  };

  const handleEditListing = (product: Product) => {
    if (!hasAnyContactData && !listingHasSellerSnapshot(product)) {
      setListingContactError('Добавьте телефон или хотя бы один дополнительный контакт в профиле, чтобы редактировать объявление.');
      return;
    }
    setListingContactError('');
    setListingForm(productToForm(product));
    setListingEditingId(product.id);
    setListingFormOpen(true);
  };

  const updateListingForm = <K extends keyof ListingFormState>(key: K, value: ListingFormState[K]) => {
    setListingForm(prev => ({ ...prev, [key]: value }));
  };

  const handleListingCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const next = event.target.value as ProductCategory;
    setListingForm(prev => {
      const prevHadSize = categoryHasSizeField(prev.category);
      const nextHasSize = categoryHasSizeField(next);
      let sizeLabel = prev.sizeLabel;
      if (!nextHasSize) sizeLabel = '';
      else if (!prevHadSize || prev.category !== next) {
        const opts = SIZE_OPTIONS_BY_CATEGORY[next as 'shoes' | 'clothing' | 'socks'];
        sizeLabel = opts.includes(prev.sizeLabel) ? prev.sizeLabel : '';
      }
      return {
        ...prev,
        category: next,
        sizeLabel,
        fit: categoryHasFitField(next) ? prev.fit : 'unisex',
      };
    });
  };

  const updateEditProfileForm = <K extends keyof EditProfileFormState>(
    key: K,
    value: EditProfileFormState[K],
  ) => {
    setEditProfileForm(prev => ({ ...prev, [key]: value }));
  };

  const addContactField = () => {
    setEditProfileForm(prev => {
      if (prev.contacts.length >= MAX_SOCIAL_CONTACTS) return prev;
      const occupied = new Set(prev.contacts.map(c => c.platform));
      const free = contactPlatformOptions.find(o => !occupied.has(o.value));
      if (!free) return prev;
      return {
        ...prev,
        contacts: [
          ...prev.contacts,
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            platform: free.value,
            value: '',
          },
        ],
      };
    });
  };

  const updateContactField = <K extends keyof UserContact>(
    id: string,
    key: K,
    value: UserContact[K],
  ) => {
    setEditProfileForm(prev => ({
      ...prev,
      contacts: prev.contacts.map(contact => (contact.id === id ? { ...contact, [key]: value } : contact)),
    }));
  };

  const removeContactField = (id: string) => {
    setEditProfileForm(prev => ({
      ...prev,
      contacts: prev.contacts.filter(contact => contact.id !== id),
    }));
  };

  const handleListingImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    if (files.some(file => file.type !== 'image/png')) {
      event.target.value = '';
      return;
    }

    Promise.all(
      files.map(
        file =>
          new Promise<string>(resolve => {
            const reader = new FileReader();
            reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
            reader.readAsDataURL(file);
          }),
      ),
    ).then(images => {
      const validImages = images.filter(Boolean);
      setListingForm(prev => ({
        ...prev,
        image: prev.imagePreviews[0] ?? validImages[0] ?? '',
        imagePreviews: [...prev.imagePreviews, ...validImages].slice(0, 8),
      }));
      event.target.value = '';
    });
  };

  const handleCreateListing = (event: FormEvent) => {
    event.preventDefault();

    const existing =
      listingEditingId !== null ? profileListings.find(l => l.id === listingEditingId) : undefined;
    const canSave =
      hasAnyContactData ||
      (listingEditingId !== null && existing !== undefined && listingHasSellerSnapshot(existing));

    if (!canSave) {
      setListingContactError('Добавьте телефон или хотя бы один дополнительный контакт в профиле, чтобы разместить объявление.');
      return;
    }

    const phoneFromUser = user.phone?.trim() ?? '';
    const contactsFromUser = normalizeContactsForEdit(user.contacts ?? [])
      .filter(c => c.value.trim())
      .map(({ platform, value }) => ({ platform, value: value.trim() }));

    const phoneSnap =
      phoneFromUser ||
      (listingEditingId !== null ? existing?.sellerPhone?.trim() ?? '' : '');
    const contactsSnap =
      contactsFromUser.length > 0
        ? contactsFromUser
        : listingEditingId !== null && existing?.sellerContacts?.length
          ? existing.sellerContacts
          : undefined;

    const listingId = listingEditingId ?? Date.now();
    const newListing: Product = {
      id: listingId,
      title: listingForm.title.trim(),
      category: listingForm.category,
      condition: listingForm.condition,
      price: Number.parseInt(listingForm.price, 10),
      image: listingForm.image,
      extraImages: listingForm.imagePreviews.slice(1, 8),
      description: listingForm.description.trim(),
      colorLabel: listingForm.colorLabel.trim() || undefined,
      sizeLabel:
        categoryHasSizeField(listingForm.category) && listingForm.sizeLabel.trim()
          ? listingForm.sizeLabel.trim()
          : undefined,
      fit: categoryHasFitField(listingForm.category) ? listingForm.fit : undefined,
      sellerPhone: phoneSnap || undefined,
      sellerContacts: contactsSnap && contactsSnap.length > 0 ? contactsSnap : undefined,
    };

    if (listingEditingId !== null) {
      updateListing(newListing);
    } else {
      addListing(newListing);
    }
    setListingForm(initialListingForm);
    setListingEditingId(null);
    setListingFormOpen(false);
    stripEditFromUrl();
  };

  const handleDeleteListing = (id: number) => {
    deleteListing(id);
  };

  const removeListingImage = (indexToRemove: number) => {
    setListingForm(prev => {
      const nextPreviews = prev.imagePreviews.filter((_, index) => index !== indexToRemove);
      return {
        ...prev,
        image: nextPreviews[0] ?? '',
        imagePreviews: nextPreviews,
      };
    });
  };

  const handleProfileSave = (event: FormEvent) => {
    event.preventDefault();

    const contactsSaved = normalizeContactsForEdit(
      editProfileForm.contacts.map(contact => ({
        ...contact,
        value: contact.value.trim(),
      })),
    ).filter(contact => contact.value.length > 0);

    updateProfile({
      name: editProfileForm.name.trim(),
      email: editProfileForm.email.trim(),
      phone: editProfileForm.phone.trim(),
      contacts: contactsSaved,
    });
  };

  useEffect(() => {
    if (hasAnyContactData) {
      setListingContactError('');
    }
  }, [hasAnyContactData]);

  const renderListingsContent = () => (
    <section>
      <div className="mb-5 border-b-2 border-black pb-4">
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Мои объявления</h2>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-black/15 pb-4 text-sm sm:text-base">
        <span className="border-b-2 border-black pb-1 font-bold">Опубликовано {profileListings.length}</span>

        <button
          type="button"
          onClick={handleOpenListingForm}
          className="border-2 border-black bg-primary px-4 py-2 font-bold text-black sketch-shadow-sm transition-colors hover:bg-primary-dark"
        >
          Добавить объявление
        </button>
      </div>

      {listingContactError ? (
        <div className="mb-6 border-2 border-black bg-amber-50 p-4 text-sm sketch-shadow-sm">
          <p className="font-semibold text-neutral-900">{listingContactError}</p>
          <Link
            to="/profile?tab=edit"
            className="mt-2 inline-block font-bold text-primary-dark underline decoration-2 underline-offset-2"
          >
            Указать контакты в профиле
          </Link>
        </div>
      ) : null}

      {listingFormOpen && (
        <form
          id="profile-listing-form"
          onSubmit={handleCreateListing}
          className="mb-6 scroll-mt-24 border-2 border-black bg-white p-5 sketch-shadow sm:p-6"
        >
          <div className="mb-6 border-b-2 border-black pb-4">
            <h3 className="text-2xl font-black tracking-tight">
              {listingEditingId !== null ? 'Редактировать объявление' : 'Новое объявление'}
            </h3>
            <p className="mt-2 text-sm text-neutral-600">
              {listingEditingId !== null
                ? 'Изменения сохранятся в объявлении, в том числе на странице барахолки.'
                : 'Заполните данные объявления в формате проекта и сохраните его в личном кабинете — оно появится в общем списке барахолки.'}
            </p>
          </div>

          <div className="mb-6 border-2 border-black bg-neutral-50 p-4 sketch-shadow-sm sm:p-5">
            <h4 className="text-sm font-black uppercase tracking-wide text-neutral-800">Контакты в объявлении</h4>
            <p className="mt-1.5 text-xs text-neutral-600">
              С покупателями можно связаться по телефону и соцсетям из вашего профиля — они сохраняются вместе с
              объявлением.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {user.phone?.trim() ? (
                <li className="flex flex-wrap gap-2">
                  <span className="font-bold text-neutral-600">Телефон:</span>
                  <span className="font-semibold text-gray-900">{user.phone.trim()}</span>
                </li>
              ) : (
                <li className="text-neutral-600">Телефон в профиле не указан.</li>
              )}
              {normalizeContactsForEdit(user.contacts ?? []).filter(c => c.value.trim()).length > 0 ? (
                <li className="pt-1">
                  <span className="font-bold text-neutral-600">Соцсети:</span>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {normalizeContactsForEdit(user.contacts ?? [])
                      .filter(c => c.value.trim())
                      .map(c => (
                        <li key={c.id}>
                          <a
                            href={buildContactHref(c)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={getContactButtonClass(c.platform)}
                          >
                            {getContactPlatformLabel(c.platform)}
                          </a>
                        </li>
                      ))}
                  </ul>
                </li>
              ) : (
                <li className="text-neutral-600">Дополнительные контакты в профиле не указаны.</li>
              )}
            </ul>
          </div>

          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-[15rem_minmax(0,1fr)] sm:items-center">
              <label htmlFor="listing-category" className="text-sm font-bold sm:text-base">
                Категория *
              </label>
              <select
                id="listing-category"
                value={listingForm.category}
                onChange={handleListingCategoryChange}
                className="w-full border-2 border-black bg-white px-3 py-3 text-sm font-bold outline-none"
              >
                {Object.entries(categoryLabel).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-3 sm:grid-cols-[15rem_minmax(0,1fr)] sm:items-center">
              <label htmlFor="listing-title" className="text-sm font-bold sm:text-base">
                Название *
              </label>
              <input
                id="listing-title"
                type="text"
                required
                value={listingForm.title}
                onChange={event => updateListingForm('title', event.target.value)}
                placeholder="Например, Yonex Astrox 88D Pro"
                className="w-full border-2 border-black bg-white px-3 py-3 text-sm font-bold outline-none placeholder:font-normal placeholder:text-neutral-400"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-[15rem_minmax(0,1fr)]">
              <span className="text-sm font-bold sm:pt-3 sm:text-base">Состояние *</span>
              <div className="flex flex-col gap-3 sm:pt-1">
                <label className="flex items-center gap-3 text-sm font-bold">
                  <input
                    type="radio"
                    name="listing-condition"
                    checked={listingForm.condition === 'new'}
                    onChange={() => updateListingForm('condition', 'new')}
                    className="h-4 w-4 accent-black"
                  />
                  Новое
                </label>
                <label className="flex items-center gap-3 text-sm font-bold">
                  <input
                    type="radio"
                    name="listing-condition"
                    checked={listingForm.condition === 'used'}
                    onChange={() => updateListingForm('condition', 'used')}
                    className="h-4 w-4 accent-black"
                  />
                  Б/У
                </label>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-3 sm:grid-cols-[15rem_minmax(0,1fr)] sm:items-center sm:col-span-2">
                <label htmlFor="listing-price" className="text-sm font-bold sm:text-base">
                  Цена *
                </label>
                <input
                  id="listing-price"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  value={listingForm.price}
                  onKeyDown={blockNonNumericKeys}
                  onChange={event => updateListingForm('price', sanitizePriceInput(event.target.value))}
                  placeholder="Введите цену"
                  className="input-no-spin w-full border-2 border-black bg-white px-3 py-3 text-sm font-bold outline-none placeholder:font-normal placeholder:text-neutral-400"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-[15rem_minmax(0,1fr)] sm:items-center sm:col-span-2">
                <label htmlFor="listing-color" className="text-sm font-bold sm:text-base">
                  Цвет
                </label>
                <input
                  id="listing-color"
                  type="text"
                  value={listingForm.colorLabel}
                  onChange={event => updateListingForm('colorLabel', event.target.value)}
                  placeholder="Например, Чёрный / зелёный"
                  className="w-full border-2 border-black bg-white px-3 py-3 text-sm font-bold outline-none placeholder:font-normal placeholder:text-neutral-400"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-[15rem_minmax(0,1fr)] sm:items-center">
              <label htmlFor="listing-image" className="text-sm font-bold sm:text-base">
                Фото PNG *
              </label>
              <input
                id="listing-image"
                type="file"
                accept="image/png"
                multiple
                required={listingForm.imagePreviews.length === 0}
                onChange={handleListingImageChange}
                className="w-full border-2 border-black bg-white px-3 py-3 text-sm font-bold outline-none file:mr-3 file:border-2 file:border-black file:bg-primary file:px-3 file:py-1.5 file:font-bold file:text-black"
              />
              <p className="mt-2 text-xs font-bold text-neutral-600">
                До 8 PNG. Можно добавлять по несколько раз. Первая картинка будет главной.
              </p>
              {listingForm.imagePreviews.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {listingForm.imagePreviews.map((src, index) => (
                    <div
                      key={`${src}-${index}`}
                      className="relative h-16 w-16 overflow-hidden border-2 border-black bg-white"
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeListingImage(index)}
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

            {categoryHasSizeField(listingForm.category) ? (
              <div className="grid gap-3 sm:grid-cols-[15rem_minmax(0,1fr)] sm:items-center">
                <label htmlFor="listing-size" className="text-sm font-bold sm:text-base">
                  Размер
                </label>
                <select
                  id="listing-size"
                  value={listingForm.sizeLabel}
                  onChange={event => updateListingForm('sizeLabel', event.target.value)}
                  className="w-full border-2 border-black bg-white px-3 py-3 text-sm font-bold outline-none"
                >
                  <option value="">Не указано</option>
                  {SIZE_OPTIONS_BY_CATEGORY[listingForm.category as 'shoes' | 'clothing' | 'socks'].map(sz => (
                    <option key={sz} value={sz}>
                      {sz}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            {categoryHasFitField(listingForm.category) ? (
              <div className="grid gap-3 sm:grid-cols-[15rem_minmax(0,1fr)] sm:items-center">
                <label htmlFor="listing-fit" className="text-sm font-bold sm:text-base">
                  Для кого
                </label>
                <select
                  id="listing-fit"
                  value={listingForm.fit}
                  onChange={event => updateListingForm('fit', event.target.value as ProductFit)}
                  className="w-full border-2 border-black bg-white px-3 py-3 text-sm font-bold outline-none"
                >
                  {FIT_FORM_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-[15rem_minmax(0,1fr)]">
              <label htmlFor="listing-description" className="text-sm font-bold sm:pt-3 sm:text-base">
                Описание *
              </label>
              <textarea
                id="listing-description"
                required
                rows={5}
                value={listingForm.description}
                onChange={event => updateListingForm('description', event.target.value)}
                placeholder="Опишите товар так, как он будет показан в объявлении"
                className="w-full resize-y border-2 border-black bg-white px-3 py-3 text-sm font-bold outline-none placeholder:font-normal placeholder:text-neutral-400"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 border-t-2 border-black pt-5">
            <button
              type="submit"
              className="border-2 border-black bg-primary px-5 py-3 font-bold text-black sketch-shadow-sm transition-colors hover:bg-primary-dark"
            >
              {listingEditingId !== null ? 'Сохранить изменения' : 'Сохранить объявление'}
            </button>
            <button
              type="button"
              onClick={() => {
                setListingForm(initialListingForm);
                setListingEditingId(null);
                setListingFormOpen(false);
                stripEditFromUrl();
              }}
              className="border-2 border-black bg-white px-5 py-3 font-bold text-black transition-colors hover:bg-neutral-100"
            >
              Отмена
            </button>
          </div>
        </form>
      )}

      {!listingFormOpen &&
        (profileListings.length === 0 ? (
          <ProfileEmptyState
            title="Вы ещё не разместили ни одного объявления"
            description="Заполните форму и первое объявление сразу появится в вашем личном кабинете."
            actionLabel="Добавить объявление"
            onAction={handleOpenListingForm}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {profileListings.map(product => (
              <ProfileListingCard
                key={product.id}
                product={product}
                onEdit={handleEditListing}
                onDelete={handleDeleteListing}
              />
            ))}
          </div>
        ))}
    </section>
  );

  const renderContent = () => {
    if (activeTab === 'listings') return renderListingsContent();

    if (activeTab === 'cart') {
      return (
        <section>
          <div className="mb-5 border-b-2 border-black pb-4">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Корзина</h2>
            {cartCount > 0 && (
              <p className="mt-2 text-sm text-neutral-600">
                Товаров: <span className="font-black tabular-nums text-gray-900">{cartCount}</span>
              </p>
            )}
          </div>

          {cartCount === 0 ? (
            <ProfileEmptyState
              title="В корзине пока ничего нет."
              description="Добавляйте товары с карточек в барахолке — список сохраняется в этом браузере."
              actionLabel="Перейти в барахолку"
              actionTo="/market"
            />
          ) : (
            <ul className="space-y-3">
              {cartItems.map(line => (
                <li
                  key={line.id}
                  className="flex flex-wrap items-start gap-3 border-2 border-black bg-white p-4 sketch-shadow sm:flex-nowrap sm:items-center sm:justify-between sm:p-5"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/market/listing/${line.id}`}
                      className="text-base font-black text-gray-900 underline decoration-2 underline-offset-2 hover:text-primary-dark"
                    >
                      {line.title}
                    </Link>
                    <p className="mt-1 text-sm tabular-nums text-neutral-700">
                      {line.price.toLocaleString('ro-MD')} MDL
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(line.id)}
                    className="inline-flex shrink-0 items-center gap-2 border-2 border-black bg-white px-3 py-2 text-xs font-black uppercase tracking-wide text-gray-900 transition-colors hover:bg-neutral-100"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                    Убрать
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      );
    }

    if (activeTab === 'orders') {
      return (
        <section>
          <div className="mb-5 border-b-2 border-black pb-4">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Мои заказы и статус</h2>
          </div>

          <div className="space-y-4">
            {myStringingOrders.length === 0 ? (
              <p className="border-2 border-black bg-white p-5 text-sm text-neutral-700 sketch-shadow sm:p-6">
                Заказов перетяжки пока нет. Оформите заказ на странице{' '}
                <Link to="/stringing" className="font-black text-black underline decoration-2 underline-offset-2">
                  Перетяжка
                </Link>
                .
              </p>
            ) : (
              myStringingOrders.map(order => (
                <article key={order.id} className="border-2 border-black bg-white p-5 sketch-shadow sm:p-6">
                  <div className="mb-5">
                    <h3 className="text-lg font-black tracking-tight">{order.racketModel}</h3>
                    <p className="mt-1 text-sm text-neutral-600">
                      {order.stringType} • {order.tension} кг • {order.createdAt}
                      {order.totalLei != null ? ` • ${order.totalLei} lei` : ''}
                    </p>
                  </div>
                  <StatusTracker status={order.status} />
                </article>
              ))
            )}
          </div>
        </section>
      );
    }

    return (
      <section>
        <div className="mb-5 border-b-2 border-black pb-4">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Изменить профиль</h2>
        </div>

        <form onSubmit={handleProfileSave} className="border-2 border-black bg-white p-5 sketch-shadow sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.24em] text-neutral-500">
                Имя
              </span>
              <input
                type="text"
                required
                value={editProfileForm.name}
                onChange={event => updateEditProfileForm('name', event.target.value)}
                placeholder="Введите имя"
                className="w-full border-2 border-black bg-white px-3 py-3 text-sm font-bold text-black outline-none placeholder:font-normal placeholder:text-neutral-400"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.24em] text-neutral-500">
                Телефон
              </span>
              <input
                type="text"
                value={editProfileForm.phone}
                onChange={event => updateEditProfileForm('phone', event.target.value)}
                placeholder="Если хотите, добавьте телефон"
                className="w-full border-2 border-black bg-white px-3 py-3 text-sm font-bold text-black outline-none placeholder:font-normal placeholder:text-neutral-400"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.24em] text-neutral-500">
                Email
              </span>
              <input
                type="email"
                required
                value={editProfileForm.email}
                onChange={event => updateEditProfileForm('email', event.target.value)}
                placeholder="Введите email"
                className="w-full border-2 border-black bg-white px-3 py-3 text-sm font-bold text-black outline-none placeholder:font-normal placeholder:text-neutral-400"
              />
            </label>

            <div className="sm:col-span-2">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="block text-[11px] font-black uppercase tracking-[0.24em] text-neutral-500">
                    Дополнительные контакты
                  </span>
                  <p className="mt-1 max-w-xl text-xs text-neutral-600">
                    До {MAX_SOCIAL_CONTACTS} соцсетей; одну и ту же сеть нельзя указать дважды.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addContactField}
                  disabled={editProfileForm.contacts.length >= MAX_SOCIAL_CONTACTS}
                  className="inline-flex items-center gap-2 border-2 border-black bg-white px-3 py-2 text-xs font-bold text-black transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <Plus size={14} />
                  Добавить контакт
                </button>
              </div>

              {editProfileForm.contacts.length > 0 ? (
                <div className="space-y-3">
                  {editProfileForm.contacts.map(contact => {
                    const usedElsewhere = new Set(
                      editProfileForm.contacts.filter(c => c.id !== contact.id).map(c => c.platform),
                    );
                    const platformOptions = contactPlatformOptions.filter(
                      opt => opt.value === contact.platform || !usedElsewhere.has(opt.value),
                    );
                    return (
                    <div
                      key={contact.id}
                      className="grid gap-3 border-2 border-black bg-neutral-50 p-3 sm:grid-cols-[12rem_minmax(0,1fr)_auto] sm:items-center"
                    >
                      <select
                        value={contact.platform}
                        onChange={event =>
                          updateContactField(contact.id, 'platform', event.target.value as UserContactPlatform)
                        }
                        className="w-full border-2 border-black bg-white px-3 py-3 text-sm font-bold outline-none"
                      >
                        {platformOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        value={contact.value}
                        onChange={event => updateContactField(contact.id, 'value', event.target.value)}
                        placeholder="Ник, ссылка или номер"
                        className="w-full border-2 border-black bg-white px-3 py-3 text-sm font-bold text-black outline-none placeholder:font-normal placeholder:text-neutral-400"
                      />

                      <button
                        type="button"
                        onClick={() => removeContactField(contact.id)}
                        className="inline-flex items-center justify-center border-2 border-black bg-white px-3 py-3 text-black transition-colors hover:bg-neutral-100"
                        aria-label={`Удалить контакт ${getContactPlatformLabel(contact.platform)}`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                    );
                  })}
                </div>
              ) : (
                <div className="border-2 border-dashed border-black/40 bg-neutral-50 px-4 py-5 text-sm text-neutral-600">
                  Сейчас дополнительных контактов нет.
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 border-t-2 border-black pt-5">
            <button
              type="submit"
              className="border-2 border-black bg-primary px-5 py-3 font-bold text-black sketch-shadow-sm transition-colors hover:bg-primary-dark"
            >
              Сохранить изменения
            </button>
            <button
              type="button"
              onClick={() =>
                setEditProfileForm({
                  name: user.name,
                  email: user.email,
                  phone: user.phone ?? '',
                  contacts: normalizeContactsForEdit(user.contacts ?? []),
                })
              }
              className="border-2 border-black bg-white px-5 py-3 font-bold text-black transition-colors hover:bg-neutral-100"
            >
              Сбросить
            </button>
          </div>
        </form>
      </section>
    );
  };

  return (
    <div className="sketch-page min-h-[calc(100dvh-4.5rem)] w-full text-black">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[19rem_minmax(0,1fr)]">
          <aside className="space-y-6">
            <div className="relative border-2 border-black bg-white p-5 sketch-shadow">
              <Link
                to="/profile?tab=edit"
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center border-2 border-black bg-white text-gray-900 shadow-[2px_2px_0_0_#000] transition-colors hover:bg-neutral-100"
                aria-label="Редактировать профиль"
                title="Редактировать профиль"
              >
                <SquarePen size={18} strokeWidth={2.5} aria-hidden />
              </Link>

              <h1 className="pr-12 text-2xl font-black tracking-tight">{user.name}</h1>
              <div className="mt-4 space-y-2 text-sm text-neutral-700">
                <p className="flex items-center gap-2">
                  <Mail size={15} />
                  {user.email}
                </p>
                {user.phone ? (
                  <p className="flex items-center gap-2">
                    <Phone size={15} />
                    {user.phone}
                  </p>
                ) : null}
                {user.contacts.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {user.contacts.map(contact => (
                      <a
                        key={contact.id}
                        href={buildContactHref(contact)}
                        target="_blank"
                        rel="noreferrer"
                        className={getContactButtonClass(contact.platform)}
                        title={contact.value}
                      >
                        {getContactPlatformLabel(contact.platform)}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <p className="mb-3 text-[11px] font-black uppercase tracking-[0.26em] text-neutral-500">
                Личный кабинет
              </p>

              <nav className="space-y-2">
                {profileTabs.map(tab => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleTabChange(tab.id)}
                      className={`flex w-full items-center gap-3 border-2 border-black px-4 py-4 text-left font-bold transition-colors ${
                        active
                          ? 'bg-primary text-black sketch-shadow-sm'
                          : 'bg-white text-black hover:bg-neutral-100'
                      }`}
                    >
                      <Icon size={18} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 border-2 border-red-600 bg-white px-5 py-3 font-bold text-red-600 shadow-[3px_3px_0_0_#dc2626] transition-colors hover:bg-red-600 hover:text-white"
            >
              <LogOut size={18} className="shrink-0" aria-hidden />
              Выйти из аккаунта
            </button>
          </aside>

          <div className="min-w-0">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
