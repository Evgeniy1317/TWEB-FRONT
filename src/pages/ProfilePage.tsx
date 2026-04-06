import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { stringingOrders } from '../data/mockData';
import StatusTracker from '../components/StatusTracker';
import type { Product, ProductCategory, ProductCondition, ProductGender, UserContact, UserContactPlatform } from '../types';
import { ClipboardList, LogOut, Mail, Phone, Plus, ShoppingBag, ShoppingCart, SquarePen, Trash2, X } from 'lucide-react';
import { deleteProfileListingById, loadProfileListings, saveProfileListings } from '../services/profileListings';

type ProfileTab = 'listings' | 'cart' | 'orders' | 'edit';

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
  gender: '' | ProductGender;
  sizeLabel: string;
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
  { value: 'other', label: 'Другое' },
];

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
  gender: '',
  sizeLabel: '',
};

const createEmptyContact = (): UserContact => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  platform: 'telegram',
  value: '',
});

const getContactPlatformLabel = (platform: UserContactPlatform): string =>
  contactPlatformOptions.find(option => option.value === platform)?.label ?? 'Контакт';

const getContactButtonClass = (platform: UserContactPlatform): string => {
  const base =
    'inline-flex items-center justify-center border-2 border-black px-3 py-1.5 text-xs font-black text-white sketch-shadow-sm transition-transform hover:-translate-y-0.5';
  if (platform === 'telegram') return `${base} bg-[#229ED9]`;
  if (platform === 'instagram') return `${base} bg-[#E4405F]`;
  if (platform === 'viber') return `${base} bg-[#7360F2]`;
  if (platform === 'facebook') return `${base} bg-[#1877F2]`;
  if (platform === 'whatsapp') return `${base} bg-[#25D366]`;
  return `${base} bg-neutral-700`;
};

const buildContactHref = (contact: UserContact): string => {
  const trimmedValue = contact.value.trim();
  if (!trimmedValue) return '#';
  if (/^(https?:\/\/|mailto:)/i.test(trimmedValue)) return trimmedValue;

  if (contact.platform === 'telegram') {
    return `https://t.me/${trimmedValue.replace(/^@/, '').replace(/^\//, '')}`;
  }

  if (contact.platform === 'instagram') {
    return `https://www.instagram.com/${trimmedValue.replace(/^@/, '').replace(/^\//, '')}`;
  }

  if (contact.platform === 'facebook') {
    return `https://www.facebook.com/${trimmedValue.replace(/^@/, '').replace(/^\//, '')}`;
  }

  if (contact.platform === 'whatsapp') {
    return `https://wa.me/${trimmedValue.replace(/\D/g, '')}`;
  }

  if (contact.platform === 'viber') {
    return `viber://chat?number=${trimmedValue.replace(/[^\d+]/g, '')}`;
  }

  return `https://${trimmedValue}`;
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
    <div className="flex min-h-[22rem] flex-col items-center justify-center border-2 border-black bg-white px-6 py-10 text-center sketch-shadow">
      <div className="mb-6 flex h-20 w-20 items-center justify-center border-2 border-black bg-neutral-100 text-3xl font-black text-neutral-500">
        ∅
      </div>
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
  onDelete,
}: {
  product: Product;
  onDelete: (id: number) => void;
}) {
  const openLabel = `${product.title} — открыть объявление`;

  return (
    <article className="relative flex flex-col overflow-hidden rounded-none border border-gray-300 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md hover:ring-2 hover:ring-primary/40">
      <Link
        to={`/profile/listing/${product.id}`}
        className="absolute inset-0 z-[1]"
        aria-label={openLabel}
      />
      <div className="relative z-[2] flex flex-1 flex-col pointer-events-none">
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.title}
            className="absolute inset-0 h-full w-full object-cover select-none"
            width={400}
            height={400}
            decoding="async"
            draggable={false}
            loading="lazy"
          />
          <button
            type="button"
            onClick={event => {
              event.preventDefault();
              event.stopPropagation();
              onDelete(product.id);
            }}
            className="pointer-events-auto absolute right-2 top-2 z-[3] flex h-10 w-10 items-center justify-center rounded-full border border-red-200/90 bg-white/95 text-red-600 shadow-sm outline-none transition-colors hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-300"
            aria-label={`Удалить объявление ${product.title}`}
          >
            <Trash2 size={18} strokeWidth={2.2} />
          </button>
        </div>

        <div className="flex flex-col gap-1 border-t border-gray-200 p-3 sm:p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
          {categoryLabel[product.category]}
          </p>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900">{product.title}</h3>
          <p className="pt-0.5 text-base font-bold tabular-nums text-gray-900 sm:text-lg">
            {product.price.toLocaleString('ro-MD')} MDL
          </p>
        </div>
      </div>
    </article>
  );
}

export default function ProfilePage() {
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<ProfileTab>(() => {
    const requestedTab = searchParams.get('tab');
    return isProfileTab(requestedTab) ? requestedTab : 'listings';
  });
  const [listingFormOpen, setListingFormOpen] = useState(false);
  const [listingContactError, setListingContactError] = useState('');
  const [listingForm, setListingForm] = useState<ListingFormState>(initialListingForm);
  const [profileListings, setProfileListings] = useState<Product[]>(() => loadProfileListings());
  const [editProfileForm, setEditProfileForm] = useState<EditProfileFormState>({
    name: '',
    email: '',
    phone: '',
    contacts: [],
  });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (!user) return;
    setEditProfileForm({
      name: user.name,
      email: user.email,
      phone: user.phone ?? '',
      contacts: user.contacts ?? [],
    });
  }, [user]);

  useEffect(() => {
    saveProfileListings(profileListings);
  }, [profileListings]);

  useEffect(() => {
    const requestedTab = searchParams.get('tab');
    const nextTab = isProfileTab(requestedTab) ? requestedTab : 'listings';
    setActiveTab(prev => (prev === nextTab ? prev : nextTab));
  }, [searchParams]);

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
    setListingFormOpen(true);
  };

  const updateListingForm = <K extends keyof ListingFormState>(key: K, value: ListingFormState[K]) => {
    setListingForm(prev => ({ ...prev, [key]: value }));
  };

  const updateEditProfileForm = <K extends keyof EditProfileFormState>(
    key: K,
    value: EditProfileFormState[K],
  ) => {
    setEditProfileForm(prev => ({ ...prev, [key]: value }));
  };

  const addContactField = () => {
    setEditProfileForm(prev => ({ ...prev, contacts: [...prev.contacts, createEmptyContact()] }));
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

    if (!hasAnyContactData) {
      setListingFormOpen(false);
      setListingContactError('Добавьте телефон или хотя бы один дополнительный контакт в профиле, чтобы разместить объявление.');
      return;
    }

    const newListing: Product = {
      id: Date.now(),
      title: listingForm.title.trim(),
      category: listingForm.category,
      condition: listingForm.condition,
      price: Number.parseInt(listingForm.price, 10),
      image: listingForm.image,
      extraImages: listingForm.imagePreviews.slice(1, 8),
      description: listingForm.description.trim(),
      colorLabel: listingForm.colorLabel.trim() || undefined,
      gender: listingForm.gender || undefined,
      sizeLabel: listingForm.sizeLabel.trim() || undefined,
    };

    setProfileListings(prev => [newListing, ...prev]);
    setListingForm(initialListingForm);
    setListingFormOpen(false);
  };

  const handleDeleteListing = (id: number) => {
    const nextListings = deleteProfileListingById(id);
    setProfileListings(nextListings);
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

    updateProfile({
      name: editProfileForm.name.trim(),
      email: editProfileForm.email.trim(),
      phone: editProfileForm.phone.trim(),
      contacts: editProfileForm.contacts
        .map(contact => ({
          ...contact,
          value: contact.value.trim(),
        }))
        .filter(contact => contact.value.length > 0),
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

      {listingFormOpen && (
        <form onSubmit={handleCreateListing} className="mb-6 border-2 border-black bg-white p-5 sketch-shadow sm:p-6">
          <div className="mb-6 border-b-2 border-black pb-4">
            <h3 className="text-2xl font-black tracking-tight">Новое объявление</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Заполните данные объявления в формате проекта и сохраните его в личном кабинете.
            </p>
          </div>

          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-[15rem_minmax(0,1fr)] sm:items-center">
              <label htmlFor="listing-category" className="text-sm font-bold sm:text-base">
                Категория *
              </label>
              <select
                id="listing-category"
                value={listingForm.category}
                onChange={event => updateListingForm('category', event.target.value as ProductCategory)}
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
                  type="number"
                  min="1"
                  required
                  value={listingForm.price}
                  onChange={event => updateListingForm('price', event.target.value)}
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

            <div className="grid gap-3 sm:grid-cols-[15rem_minmax(0,1fr)] sm:items-center">
              <label htmlFor="listing-gender" className="text-sm font-bold sm:text-base">
                Пол
              </label>
              <select
                id="listing-gender"
                value={listingForm.gender}
                onChange={event => updateListingForm('gender', event.target.value as '' | ProductGender)}
                className="w-full border-2 border-black bg-white px-3 py-3 text-sm font-bold outline-none"
              >
                <option value="">Не указывать</option>
                <option value="mens">Мужское</option>
                <option value="womens">Женское</option>
                <option value="unisex">Унисекс</option>
              </select>
            </div>

            <div className="grid gap-3 sm:grid-cols-[15rem_minmax(0,1fr)] sm:items-center">
              <label htmlFor="listing-size" className="text-sm font-bold sm:text-base">
                Размер
              </label>
              <input
                id="listing-size"
                type="text"
                value={listingForm.sizeLabel}
                onChange={event => updateListingForm('sizeLabel', event.target.value)}
                placeholder="Например, 42, M или 39-42"
                className="w-full border-2 border-black bg-white px-3 py-3 text-sm font-bold outline-none placeholder:font-normal placeholder:text-neutral-400"
              />
            </div>

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
              Сохранить объявление
            </button>
            <button
              type="button"
              onClick={() => {
                setListingForm(initialListingForm);
                setListingFormOpen(false);
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
            title="Вы ещё не разместили ни одного объявления."
            description="Заполните форму и первое объявление сразу появится в вашем личном кабинете."
            actionLabel="Добавить объявление"
            onAction={handleOpenListingForm}
            actionError={listingContactError}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {profileListings.map(product => (
              <ProfileListingCard
                key={product.id}
                product={product}
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
          </div>

          <ProfileEmptyState
            title="В корзине пока ничего нет."
            description="У нас ещё нет общей сохранённой корзины для профиля, поэтому здесь пока пусто."
            actionLabel="Перейти в барахолку"
            actionTo="/market"
          />
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
            {stringingOrders.map(order => (
              <article key={order.id} className="border-2 border-black bg-white p-5 sketch-shadow sm:p-6">
                <div className="mb-5">
                  <h3 className="text-lg font-black tracking-tight">{order.racketModel}</h3>
                  <p className="mt-1 text-sm text-neutral-600">
                    {order.stringType} • {order.tension} кг • {order.createdAt}
                  </p>
                </div>
                <StatusTracker status={order.status} />
              </article>
            ))}
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
                <span className="block text-[11px] font-black uppercase tracking-[0.24em] text-neutral-500">
                  Дополнительные контакты
                </span>
                <button
                  type="button"
                  onClick={addContactField}
                  className="inline-flex items-center gap-2 border-2 border-black bg-white px-3 py-2 text-xs font-bold text-black transition-colors hover:bg-neutral-100"
                >
                  <Plus size={14} />
                  Добавить контакт
                </button>
              </div>

              {editProfileForm.contacts.length > 0 ? (
                <div className="space-y-3">
                  {editProfileForm.contacts.map(contact => (
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
                        {contactPlatformOptions.map(option => (
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
                  ))}
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
                  contacts: user.contacts ?? [],
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
            <div className="border-2 border-black bg-white p-5 sketch-shadow">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div className="flex h-24 w-24 items-center justify-center border-2 border-black bg-neutral-100 text-4xl font-black text-neutral-500">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>

              <h1 className="text-2xl font-black tracking-tight">{user.name}</h1>
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
              className="inline-flex items-center gap-2 border-2 border-black bg-white px-5 py-3 font-bold text-black sketch-shadow-sm transition-colors hover:bg-black hover:text-white"
            >
              <LogOut size={18} />
              Выйти из аккаунта
            </button>
          </aside>

          <div className="min-w-0">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
