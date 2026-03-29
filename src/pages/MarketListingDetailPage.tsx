import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { products } from '../data/mockData';

const categoryLabel = {
  rackets: 'Ракетки',
  shoes: 'Обувь',
  shuttlecocks: 'Воланы',
  strings: 'Струны для перетяжки',
  bags: 'Сумки и чехлы',
  clothing: 'Одежда',
  accessories: 'Аксессуары',
} as const;

export default function MarketListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const numericId = id ? Number.parseInt(id, 10) : NaN;
  const product = Number.isFinite(numericId) ? products.find(p => p.id === numericId) : undefined;

  if (!product) {
    return (
      <div className="sketch-page min-h-[calc(100dvh-4.5rem)] w-full px-4 py-10 text-gray-900 sm:px-6">
        <p className="font-black text-lg">Объявление не найдено</p>
        <Link to="/market" className="mt-4 inline-block font-bold text-blue-700 underline">
          К барахолке
        </Link>
      </div>
    );
  }

  return (
    <div className="sketch-page min-h-[calc(100dvh-4.5rem)] w-full text-gray-900">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Link
          to="/market"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:underline"
        >
          <ArrowLeft size={18} strokeWidth={2.5} aria-hidden />
          К списку
        </Link>

        <article className="overflow-hidden border-2 border-black bg-white sketch-shadow rounded-md">
          <div className="aspect-square w-full max-h-[min(70vh,32rem)] overflow-hidden bg-gray-100 sm:mx-auto sm:max-w-lg">
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-cover"
              width={800}
              height={800}
              decoding="async"
            />
          </div>
          <div className="border-t-2 border-black p-4 sm:p-6">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              {categoryLabel[product.category]}
            </p>
            <h1 className="mt-1 text-xl font-black tracking-tight sm:text-2xl">{product.title}</h1>
            <p className="mt-3 text-2xl font-black tabular-nums sm:text-3xl">
              {product.price.toLocaleString('ro-MD')} MDL
            </p>
            <p className="mt-4 text-sm leading-relaxed text-neutral-700 sm:text-base">{product.description}</p>
          </div>
        </article>
      </div>
    </div>
  );
}
