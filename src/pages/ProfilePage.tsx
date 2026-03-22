import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { products, stringingOrders } from '../data/mockData';
import StatusTracker from '../components/StatusTracker';
import {
  User,
  Mail,
  Phone,
  Heart,
  LogOut,
  ShieldCheck,
  Repeat,
} from 'lucide-react';

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-dark mb-2">Профиль</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <User size={28} className="text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-dark">{user.name}</h2>
            <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <Mail size={14} /> {user.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone size={14} /> {user.phone}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start">
            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold
              ${user.role === 'master'
                ? 'bg-violet-50 text-violet-600'
                : 'bg-primary/10 text-primary-dark'
              }`}
            >
              <ShieldCheck size={14} />
              {user.role === 'master' ? 'Мастер' : 'Пользователь'}
            </span>
            <button
              onClick={toggleRole}
              className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              title="Переключить роль"
            >
              <Repeat size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
          <Heart size={18} className="text-red-500" />
          Избранное
        </h2>
        {favoriteProducts.length === 0 ? (
          <p className="text-gray-400 text-sm">У вас пока нет избранных товаров</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteProducts.map(p => (
              <div key={p.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
                <img src={p.image} alt={p.title} className="w-14 h-14 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-dark truncate">{p.title}</h4>
                  <p className="text-sm text-primary-dark font-bold">{p.price} MDL</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold text-dark mb-4">История перетяжек</h2>
        <div className="space-y-3">
          {stringingOrders.map(order => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h4 className="font-semibold text-dark text-sm">{order.racketModel}</h4>
                  <p className="text-xs text-gray-500">
                    {order.stringType} · {order.tension} кг · {order.createdAt}
                  </p>
                </div>
              </div>
              <StatusTracker status={order.status} />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-6 py-3 text-red-500 font-medium rounded-xl hover:bg-red-50 transition-colors"
      >
        <LogOut size={18} />
        Выйти из аккаунта
      </button>
    </div>
  );
}
