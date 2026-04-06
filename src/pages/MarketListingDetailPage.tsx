import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, SquarePen } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMarketSellerForProduct, products } from '../data/mockData';
import { useProfileListings } from '../context/ProfileListingsContext';
import { marketSellerFromProduct } from '../utils/marketSellerFromProduct';
import { telHref } from '../utils/contactLinks';
import { buildListingGalleryUrls } from '../utils/listingDetailSpecs';
import { ListingDetailMedia } from '../components/listing/ListingDetailMedia';
import { ListingDetailSpecsPanel } from '../components/listing/ListingDetailSpecsPanel';

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
  const { isAuthenticated } = useAuth();
  const { listings: profileListings } = useProfileListings();
  const product = Number.isFinite(numericId)
    ? profileListings.find(p => p.id === numericId) ?? products.find(p => p.id === numericId)
    : undefined;
  const isUserListing = Boolean(
    Number.isFinite(numericId) && profileListings.some(p => p.id === numericId),
  );

  const galleryUrls = useMemo(() => (product ? buildListingGalleryUrls(product) : []), [product]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [contactsOpen, setContactsOpen] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
  }, [numericId]);

  if (!product) {
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

  const seller = isUserListing ? marketSellerFromProduct(product) : getMarketSellerForProduct(product.id);

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
          <h1 className="min-w-0 flex-1 text-xl font-black tracking-tight sm:text-2xl">{product.title}</h1>
          {isUserListing && isAuthenticated ? (
            <Link
              to={`/profile?edit=${product.id}`}
              onClick={() => {
                try {
                  window.sessionStorage.setItem('sm-profile-edit-id', String(product.id));
                } catch {
                  /* ignore */
                }
              }}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-black bg-white text-gray-900 shadow-[2px_2px_0_0_#000] transition-colors hover:bg-primary/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label="Редактировать объявление"
              title="Редактировать объявление"
            >
              <SquarePen size={20} strokeWidth={2.2} aria-hidden />
            </Link>
          ) : null}
        </div>

        <div className="flex flex-col gap-8 lg:grid lg:min-h-0 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-stretch lg:gap-x-10 lg:gap-y-0">
          <ListingDetailMedia
            galleryUrls={galleryUrls}
            activeIndex={activeIndex}
            onActiveIndexChange={setActiveIndex}
            productTitle={product.title}
          />

          <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:min-h-0 lg:h-full lg:w-full lg:min-w-0">
            <div className="flex shrink-0 flex-col gap-3">
              <div className="flex w-full min-w-0 shrink-0 flex-wrap items-center gap-x-2 gap-y-2 sm:gap-x-3">
                <div className="inline-flex max-w-[13rem] min-w-0 flex-col items-center rounded-full border-2 border-black bg-white px-4 py-2 shadow-[3px_3px_0_0_#000] ring-1 ring-inset ring-black/[0.06] sm:px-5 sm:py-2.5">
                  <span className="text-[9px] font-black uppercase tracking-[0.22em] text-neutral-500">Цена</span>
                  <span className="mt-0.5 text-center text-base font-black tabular-nums leading-none tracking-tight text-gray-900 sm:text-lg">
                    {product.price.toLocaleString('ro-MD')} MDL
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

            <ListingDetailSpecsPanel product={product} />
          </div>
        </div>

        <section
          className="mt-10 border-2 border-black bg-white p-4 sm:p-6 sketch-shadow rounded-md"
          aria-labelledby="listing-desc"
        >
          <h2 id="listing-desc" className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">
            Описание
          </h2>
          <p className="text-sm leading-relaxed text-neutral-800 sm:text-base">{product.description}</p>
        </section>
      </div>
    </div>
  );
}
