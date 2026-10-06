const env = import.meta.env;

export const siteConfig = {
  url: env.VITE_SITE_URL || '',
  name: 'ENKOP',
  descriptor: 'REAL ESTATE',
  email: env.VITE_CONTACT_EMAIL || '',
  phone: env.VITE_CONTACT_PHONE || '',
  whatsappNumber: (env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, ''),
  address: env.VITE_CONTACT_ADDRESS || 'Nairobi, Kenya',
  socials: {
    instagram: env.VITE_INSTAGRAM_URL || '',
    linkedin: env.VITE_LINKEDIN_URL || '',
    facebook: env.VITE_FACEBOOK_URL || '',
    tiktok: env.VITE_TIKTOK_URL || '',
    youtube: env.VITE_YOUTUBE_URL || '',
    x: env.VITE_X_URL || '',
  },
};

export function absoluteSiteUrl(path = ''): string {
  const base = siteConfig.url || window.location.origin;
  return new URL(path, base.endsWith('/') ? base : `${base}/`).toString();
}

export function whatsappUrl(message: string, number?: string): string {
  const recipient = (number || siteConfig.whatsappNumber).replace(/\D/g, '');
  const base = recipient ? `https://wa.me/${recipient}` : 'https://wa.me/';
  return `${base}?text=${encodeURIComponent(message)}`;
}
