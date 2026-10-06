import { useEffect } from 'react';
import { absoluteSiteUrl } from '../lib/config';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  path?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

export function SEO({ title, description, image = '/images/hero-karen-residence.jpg', path, type = 'website', noindex = false, structuredData }: SEOProps) {
  useEffect(() => {
    document.title = title;
    const absoluteImage = absoluteSiteUrl(image);
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', absoluteImage);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', absoluteImage);

    const canonicalHref = absoluteSiteUrl(path || window.location.pathname);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalHref;

    const existingJsonLd = document.getElementById('enkop-jsonld');
    if (structuredData) {
      const script = existingJsonLd instanceof HTMLScriptElement ? existingJsonLd : document.createElement('script');
      script.id = 'enkop-jsonld';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      if (!script.parentElement) document.head.appendChild(script);
    } else {
      existingJsonLd?.remove();
    }
  }, [title, description, image, path, type, noindex, structuredData]);
  return null;
}
