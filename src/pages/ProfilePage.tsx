import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { products, stringingOrders } from '../data/mockData';
import StatusTracker from '../components/StatusTracker';
import { User, Mail, Phone, Heart, LogOut, ShieldCheck, Repeat, Package } from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated, logout, toggleRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user) return null;

  const favoriteProducts = products.filter(p => user.favorites.includes(p.id));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="sketch-page min-h-[calc(100dvh-4.5rem)] w-full text-black">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Профиль</h1>
        </div>

        <section className="mb-8 border-2 border-black bg-white p-5 sketch-shadow sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center border-2 border-black bg-primary/15">
                <User size={34} className="text-black" />
              </div>

              <div>
                <h2 className="text-2xl font-black tracking-tight">{user.name}</h2>
                <div className="mt-3 flex flex-col gap-2 text-sm text-neutral-700 sm:flex-row sm:flex-wrap sm:gap-5">
                  <span className="flex items-center gap-2">
                    <Mail size={15} className="shrink-0" />
                    {user.email}
                  </span>
                  <span className="flex items-center gap-2">
                    <Phone size={15} className="shrink-0" />
                    {user.phone}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-center">
              <span
                className={`inline-flex items-center gap-2 border-2 border-black px-3 py-2 text-xs font-black uppercase tracking-wide ${
                  user.role === 'master' ? 'bg-black text-white' : 'bg-primary text-black'
                }`}
              >
                <ShieldCheck size={14} />
                {user.role === 'master' ? 'Мастер' : 'Пользователь'}
              </span>
              <button
                onClick={toggleRole}
                className="flex h-10 w-10 items-center justify-center border-2 border-black bg-white sketch-shadow-sm transition-colors hover:bg-neutral-100"
                title="Переключить роль"
              >
                <Repeat size={16} />
              </button>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="mb-4 border-b-2 border-black pb-3">
            <h2 className="flex items-center gap-2 text-xl font-black tracking-tight">
              <Heart size={18} className="text-black" />
              Избранное
            </h2>
          </div>

          {favoriteProducts.length === 0 ? (
            <div className="border-2 border-black bg-white px-5 py-8 text-sm text-neutral-600 sketch-shadow">
              У вас пока нет избранных товаров
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {favoriteProducts.map(product => (
                <article
                  key={product.id}
                  className="flex items-center gap-3 border-2 border-black bg-white p-4 sketch-shadow-sm"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-16 w-16 shrink-0 border-2 border-black object-cover"
                  />
                  <div className="min-w-0">
                    <h3 className="line-clamp-2 text-sm font-bold leading-snug">{product.title}</h3>
                    <p className="mt-1 text-base font-black text-primary-dark">{product.price} MDL</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mb-8">
          <div className="mb-4 border-b-2 border-black pb-3">
            <h2 className="flex items-center gap-2 text-xl font-black tracking-tight">
              <Package size={18} className="text-black" />
              История перетяжек
            </h2>
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

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 border-2 border-black bg-white px-5 py-3 font-bold text-black sketch-shadow-sm transition-colors hover:bg-black hover:text-white"
        >
          <LogOut size={18} />
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}
