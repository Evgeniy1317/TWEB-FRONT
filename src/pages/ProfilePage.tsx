import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { stringingOrders } from '../data/mockData';
import StatusTracker from '../components/StatusTracker';
import type { Product, ProductCategory, ProductCondition, ProductGender } from '../types';
import { ClipboardList, LogOut, Mail, Phone, ShoppingBag, ShoppingCart, SquarePen } from 'lucide-react';

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
  imageName: string;
  gender: '' | ProductGender;
  sizeLabel: string;
};

type EditProfileFormState = {
  name: string;
  email: string;
  phone: string;
};

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
  imageName: '',
  gender: '',
  sizeLabel: '',
};

function ProfileEmptyState({
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel: string;
  actionTo?: string;
  onAction?: () => void;
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
    </div>
  );
}

function ListingPreviewCard({ product }: { product: Product }) {
  return (
    <article className="overflow-hidden border-2 border-black bg-white sketch-shadow-sm">
      <div className="grid gap-0 md:grid-cols-[15rem_minmax(0,1fr)]">
        <div className="aspect-[4/3] border-b-2 border-black bg-neutral-100 md:aspect-auto md:h-full md:border-b-0 md:border-r-2">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="p-5">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="mb-2 inline-block border-b border-dashed border-black/30 pb-1 text-[10px] font-black uppercase tracking-[0.22em] text-neutral-500">
                {categoryLabel[product.category]}
              </p>
              <h3 className="text-xl font-black tracking-tight">{product.title}</h3>
            </div>

            <div className="border-2 border-black bg-white px-4 py-2 text-right sketch-shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-neutral-500">Цена</p>
              <p className="text-lg font-black tabular-nums">{product.price} MDL</p>
            </div>
          </div>

          <div className="mb-4 border-2 border-black bg-white p-4">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-neutral-500">
              Основные характеристики
            </p>
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-4 border-b border-black/10 pb-2">
                <dt className="font-bold text-neutral-600">Категория</dt>
                <dd className="font-bold">{categoryLabel[product.category]}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-black/10 pb-2">
                <dt className="font-bold text-neutral-600">Состояние</dt>
                <dd className="font-bold">{product.condition === 'new' ? 'Новое' : 'Б/У'}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="font-bold text-neutral-600">Цвет</dt>
                <dd className="font-bold">{product.colorLabel || '—'}</dd>
              </div>
            </dl>
          </div>

          <div className="border-2 border-black bg-white p-4">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-neutral-500">
              Описание
            </p>
            <p className="text-sm leading-6 text-neutral-800">{product.description}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ProfilePage() {
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProfileTab>('listings');
  const [listingFormOpen, setListingFormOpen] = useState(false);
  const [listingForm, setListingForm] = useState<ListingFormState>(initialListingForm);
  const [profileListings, setProfileListings] = useState<Product[]>([]);
  const [editProfileForm, setEditProfileForm] = useState<EditProfileFormState>({
    name: '',
    email: '',
    phone: '',
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
      phone: user.phone,
    });
  }, [user]);

  if (!isAuthenticated || !user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
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

  const handleListingImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'image/png') {
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setListingForm(prev => ({
        ...prev,
        image: result,
        imageName: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleCreateListing = (event: FormEvent) => {
    event.preventDefault();

    const newListing: Product = {
      id: Date.now(),
      title: listingForm.title.trim(),
      category: listingForm.category,
      condition: listingForm.condition,
      price: Number.parseInt(listingForm.price, 10),
      image: listingForm.image,
      description: listingForm.description.trim(),
      colorLabel: listingForm.colorLabel.trim() || undefined,
      gender: listingForm.gender || undefined,
      sizeLabel: listingForm.sizeLabel.trim() || undefined,
    };

    setProfileListings(prev => [newListing, ...prev]);
    setListingForm(initialListingForm);
    setListingFormOpen(false);
  };

  const handleProfileSave = (event: FormEvent) => {
    event.preventDefault();

    updateProfile({
      name: editProfileForm.name.trim(),
      email: editProfileForm.email.trim(),
      phone: editProfileForm.phone.trim(),
    });
  };

  const renderListingsContent = () => (
    <section>
      <div className="mb-5 border-b-2 border-black pb-4">
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Мои объявления</h2>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-black/15 pb-4 text-sm sm:text-base">
        <span className="border-b-2 border-black pb-1 font-bold">Опубликовано {profileListings.length}</span>

        <button
          type="button"
          onClick={() => setListingFormOpen(true)}
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
                required
                onChange={handleListingImageChange}
                className="w-full border-2 border-black bg-white px-3 py-3 text-sm font-bold outline-none file:mr-3 file:border-2 file:border-black file:bg-primary file:px-3 file:py-1.5 file:font-bold file:text-black"
              />
              {listingForm.imageName ? (
                <p className="mt-2 text-xs font-bold text-neutral-600">Файл: {listingForm.imageName}</p>
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

      {profileListings.length === 0 ? (
        <ProfileEmptyState
          title="Вы ещё не разместили ни одного объявления."
          description="Заполните форму и первое объявление сразу появится в вашем личном кабинете."
          actionLabel="Добавить объявление"
          onAction={() => setListingFormOpen(true)}
        />
      ) : (
        <div className="space-y-5">
          {profileListings.map(product => (
            <ListingPreviewCard key={product.id} product={product} />
          ))}
        </div>
      )}
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
                required
                value={editProfileForm.phone}
                onChange={event => updateEditProfileForm('phone', event.target.value)}
                placeholder="Введите телефон"
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
                  phone: user.phone,
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
                <p className="flex items-center gap-2">
                  <Phone size={15} />
                  {user.phone}
                </p>
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
                      onClick={() => setActiveTab(tab.id)}
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
