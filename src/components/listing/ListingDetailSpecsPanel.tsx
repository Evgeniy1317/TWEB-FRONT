import type { Product } from '../../types';
import { buildListingSpecLines } from '../../utils/listingDetailSpecs';

type ListingDetailSpecsPanelProps = {
  product: Product;
  headingId?: string;
};

export function ListingDetailSpecsPanel({ product, headingId = 'listing-specs' }: ListingDetailSpecsPanelProps) {
  const specLines = buildListingSpecLines(product);

  return (
    <section
      className="mt-auto flex w-full shrink-0 flex-col border-2 border-black bg-white p-4 sketch-shadow-sm"
      aria-labelledby={headingId}
    >
      <h2
        id={headingId}
        className="mb-2.5 shrink-0 text-center text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600"
      >
        Основные характеристики
      </h2>

      <dl className="w-full space-y-0 text-sm">
        {specLines.map(row => (
          <div
            key={row.label}
            className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-neutral-200 py-2 text-left last:border-b-0"
          >
            <dt className="font-bold text-neutral-600">{row.label}</dt>
            <dd className="text-right font-semibold text-gray-900">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
