import type { SellerContactSnapshot, UserContact, UserContactPlatform } from '../types';

export const CONTACT_PLATFORM_LABEL: Record<UserContactPlatform, string> = {
  telegram: 'Telegram',
  instagram: 'Instagram',
  viber: 'Viber',
  facebook: 'Facebook',
  whatsapp: 'WhatsApp',
};

export function telHref(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) return `tel:${cleaned}`;
  if (cleaned.length > 0) return `tel:+${cleaned}`;
  return 'tel:';
}

/** Ссылка для контакта (как в профиле). */
export function buildContactHrefFromSnapshot(contact: SellerContactSnapshot): string {
  return buildContactHref({
    id: '',
    platform: contact.platform,
    value: contact.value,
  });
}

export function buildContactHref(contact: UserContact): string {
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
}

export function socialButtonClassForPlatform(platform: UserContactPlatform): string {
  const base =
    'inline-flex border-2 border-black px-2.5 py-1 text-[11px] font-bold text-white shadow-[2px_2px_0_0_#000] hover:brightness-110';
  if (platform === 'telegram') return `${base} bg-[#229ED9]`;
  if (platform === 'instagram') return `${base} bg-[#E4405F]`;
  if (platform === 'viber') return `${base} bg-[#7360F2]`;
  if (platform === 'facebook') return `${base} bg-[#1877F2]`;
  if (platform === 'whatsapp') return `${base} bg-[#25D366]`;
  return `${base} bg-neutral-600`;
}
