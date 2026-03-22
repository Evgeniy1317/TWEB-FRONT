import { useState, type FormEvent } from 'react';
import { ClipboardList, PlusCircle, Send } from 'lucide-react';
import StatusTracker from '../components/StatusTracker';
import { stringingOrders as initialOrders } from '../data/mockData';
import type { StringingOrder } from '../types';

const stringTypes = ['BG65', 'BG80', 'BG80 Power', 'Nanogy 98', 'Nanogy 99', 'NBG95'] as const;

interface OrderForm {
  racketModel: string;
  tension: string;
  stringType: string;
}

export default function StringingPage() {
  const [activeTab, setActiveTab] = useState<'order' | 'history'>('order');
  const [orders, setOrders] = useState<StringingOrder[]>(initialOrders);
  const [form, setForm] = useState<OrderForm>({ racketModel: '', tension: '', stringType: '' });
  const [submitted, setSubmitted] = useState(false);

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
    setTimeout(() => { setSubmitted(false); setActiveTab('history'); }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-dark mb-2">Перетяжка ракеток</h1>
        <p className="text-gray-500">Оформите заказ и отслеживайте его статус</p>
      </div>

      <div className="flex gap-2 mb-8 bg-gray-100 rounded-xl p-1 max-w-md">
        <button
          onClick={() => setActiveTab('order')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
            ${activeTab === 'order'
              ? 'bg-white text-dark shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          <PlusCircle size={16} />
          Оформить заказ
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
            ${activeTab === 'history'
              ? 'bg-white text-dark shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          <ClipboardList size={16} />
          Мои заказы
        </button>
      </div>

      {activeTab === 'order' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send size={28} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">Заказ оформлен!</h3>
              <p className="text-gray-500">Переходим к списку заказов...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">
                  Модель ракетки
                </label>
                <input
                  type="text"
                  required
                  placeholder="Напр. Yonex Astrox 88D"
                  value={form.racketModel}
                  onChange={e => setForm({ ...form, racketModel: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">
                  Натяжение (кг)
                </label>
                <input
                  type="number"
                  required
                  min="18"
                  max="35"
                  placeholder="24"
                  value={form.tension}
                  onChange={e => setForm({ ...form, tension: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">
                  Тип струны
                </label>
                <select
                  required
                  value={form.stringType}
                  onChange={e => setForm({ ...form, stringType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-white"
                >
                  <option value="">Выберите тип струны</option>
                  {stringTypes.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Оформить заказ
              </button>
            </form>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">Заказов пока нет</p>
            </div>
          ) : (
            orders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div>
                    <h3 className="font-semibold text-dark">{order.racketModel}</h3>
                    <p className="text-sm text-gray-500">
                      {order.stringType} · {order.tension} кг · {order.createdAt}
                    </p>
                  </div>
                  <span
                    className={`inline-flex self-start px-3 py-1 rounded-lg text-xs font-bold
                      ${order.status === 'ready' ? 'bg-primary/10 text-primary-dark' : ''}
                      ${order.status === 'in_progress' ? 'bg-amber-50 text-amber-700' : ''}
                      ${order.status === 'received' ? 'bg-blue-50 text-blue-600' : ''}
                    `}
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
  );
}
