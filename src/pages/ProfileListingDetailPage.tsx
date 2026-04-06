import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, SquarePen, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useProfileListings } from '../context/ProfileListingsContext';
import {
  buildContactHrefFromSnapshot,
  CONTACT_PLATFORM_LABEL,
  socialButtonClassForPlatform,
  telHref,
} from '../utils/contactLinks';
import { buildListingGalleryUrls } from '../utils/listingDetailSpecs';
import { ListingDetailMedia } from '../components/listing/ListingDetailMedia';
import { ListingDetailSpecsPanel } from '../components/listing/ListingDetailSpecsPanel';

export default function ProfileListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const numericId = id ? Number.parseInt(id, 10) : NaN;
  const { listings, deleteListing } = useProfileListings();
  const product = Number.isFinite(numericId) ? listings.find(p => p.id === numericId) : undefined;

  const galleryUrls = useMemo(() => (product ? buildListingGalleryUrls(product) : []), [product]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [contactsOpen, setContactsOpen] = useState(false);

  const hasSellerContacts =
    Boolean(product?.sellerPhone?.trim()) || (product?.sellerContacts?.length ?? 0) > 0;

  useEffect(() => {
    setActiveIndex(0);
    setContactsOpen(false);
  }, [numericId]);

  if (!product) {
    return (
      <div className="sketch-page min-h-[calc(100dvh-4.5rem)] w-full px-4 py-10 text-gray-900 sm:px-6">
        <p className="font-black text-lg">Объявление не найдено</p>
        <Link
          to="/profile"
          className="mt-4 inline-block border-2 border-black bg-white px-4 py-2 text-sm font-bold sketch-shadow-sm hover:bg-neutral-100"
        >
          К профилю
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    deleteListing(product.id);
    navigate('/profile');
  };

  return (
    <div className="sketch-page min-h-[calc(100dvh-4.5rem)] w-full text-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Link
          to="/profile"
          className="mb-6 inline-flex items-center gap-2 border-2 border-black bg-white px-3 py-2 text-sm font-bold sketch-shadow-sm hover:bg-neutral-100"
        >
          <ArrowLeft size={18} strokeWidth={2.5} aria-hidden />
          К моим объявлениям
        </Link>

        <div className="mb-8 flex flex-wrap items-start justify-between gap-3 sm:gap-4">
          <h1 className="min-w-0 flex-1 text-xl font-black tracking-tight sm:text-2xl">{product.title}</h1>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            <Link
              to={`/market/listing/${product.id}`}
              className="inline-flex items-center gap-2 border-2 border-black bg-primary px-3 py-2 text-xs font-bold text-black sketch-shadow-sm transition-colors hover:bg-primary-dark sm:text-sm"
            >
              Смотреть на барахолке
            </Link>
            <Link
              to={`/profile?edit=${product.id}`}
              onClick={() => {
                try {
                  window.sessionStorage.setItem('sm-profile-edit-id', String(product.id));
                } catch {
                  /* ignore */
                }
              }}
              className="inline-flex items-center gap-1.5 border-2 border-black bg-white px-3 py-2 text-xs font-bold text-gray-900 sketch-shadow-sm transition-colors hover:bg-neutral-100 sm:text-sm"
            >
              <SquarePen size={16} strokeWidth={2.2} aria-hidden />
              Редактировать
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 border-2 border-black bg-white px-3 py-2 text-xs font-bold text-red-600 sketch-shadow-sm transition-colors hover:bg-red-50 sm:text-sm"
            >
              <Trash2 size={16} strokeWidth={2.2} />
              Удалить
            </button>
          </div>
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

                {hasSellerContacts ? (
                  <button
                    type="button"
                    onClick={() => setContactsOpen(o => !o)}
                    aria-expanded={contactsOpen}
                    className="ml-auto shrink-0 border-2 border-black bg-primary px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-black shadow-[2px_2px_0_0_#000] hover:bg-[#00C853] sm:px-3.5 sm:py-2 sm:text-xs"
                  >
                    {contactsOpen ? 'Скрыть контакты' : 'Показать контакты продавца'}
                  </button>
                ) : (
                  <span className="ml-auto max-w-[12rem] shrink-0 text-right text-[10px] font-bold uppercase leading-snug tracking-wide text-neutral-500 sm:text-xs">
                    Контакты не указаны
                  </span>
                )}
              </div>

              <div className="h-[7rem] w-full shrink-0">
                {contactsOpen && hasSellerContacts ? (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 overflow-y-auto border-2 border-black bg-white px-3 py-2.5 sketch-shadow-sm sm:gap-2.5 sm:px-4">
                    {product.sellerPhone?.trim() ? (
                      <div className="flex w-full shrink-0 items-center gap-2">
                        <div className="h-px min-w-0 flex-1 border-t border-dashed border-neutral-600" aria-hidden />
                        <a
                          href={telHref(product.sellerPhone)}
                          className="shrink-0 text-sm font-black tabular-nums text-gray-900 underline decoration-2 underline-offset-2 hover:text-primary"
                        >
                          {product.sellerPhone.trim()}
                        </a>
                        <div className="h-px min-w-0 flex-1 border-t border-dashed border-neutral-600" aria-hidden />
                      </div>
                    ) : null}
                    {product.sellerContacts && product.sellerContacts.length > 0 ? (
                      <div className="flex w-full flex-wrap items-center justify-center gap-2">
                        {product.sellerContacts.map((c, i) => (
                          <a
                            key={`${c.platform}-${i}`}
                            href={buildContactHrefFromSnapshot(c)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={socialButtonClassForPlatform(c.platform)}
                          >
                            {CONTACT_PLATFORM_LABEL[c.platform]}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>

            <ListingDetailSpecsPanel product={product} headingId="profile-listing-specs" />
          </div>
        </div>

        <section
          className="mt-10 border-2 border-black bg-white p-4 sm:p-6 sketch-shadow rounded-md"
          aria-labelledby="profile-listing-desc"
        >
          <h2
            id="profile-listing-desc"
            className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600"
          >
            Описание
          </h2>
          <p className="text-sm leading-relaxed text-neutral-800 sm:text-base">{product.description}</p>
        </section>
      </div>
    </div>
  );
}
