import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUpRight, Facebook, Heart, Instagram, Linkedin, Menu, X, Youtube } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { siteConfig } from '../lib/config';
import { isLiveBackendConfigured } from '../lib/supabase';
import { formatPrice, getPropertyGalleryImages } from '../data/properties';
import { useExperience } from '../context/ExperienceContext';
import type { Property, PropertyImage } from '../types';
import { whatsappUrl } from '../lib/config';

const navigation = [
  { label: 'Properties', to: '/properties' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Insights', to: '/insights' },
];

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link className={`brand-mark ${light ? 'brand-mark--light' : ''}`} to="/" aria-label="ENKOP Real Estate — home">
      <span className="brand-word">ENKOP</span>
      <span className="brand-caption">REAL ESTATE</span>
    </Link>
  );
}

export function Navbar() {
  const { pathname } = useLocation();
  const { favorites } = useExperience();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const knownLightRoutes = ['/properties', '/insights', '/saved'];
  const knownRoutes = ['/', '/properties', '/about', '/services', '/insights', '/contact', '/saved'];
  const isNotFound = !knownRoutes.includes(pathname) && !pathname.startsWith('/properties/') && !pathname.startsWith('/insights/');
  const isDarkHero = pathname === '/' || pathname === '/about' || pathname === '/services' || pathname === '/contact' || pathname.startsWith('/properties/') || pathname.startsWith('/insights/') || isNotFound || !knownLightRoutes.includes(pathname);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 32);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const firstLink = menuRef.current?.querySelector<HTMLElement>('a[href]');
    const focusTimer = window.setTimeout(() => firstLink?.focus(), 40);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); toggleRef.current?.focus(); return; }
      if (event.key !== 'Tab') return;
      const focusable = Array.from(headerRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') || []).filter((element) => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { window.clearTimeout(focusTimer); document.removeEventListener('keydown', onKeyDown); };
  }, [menuOpen]);

  return (
    <header ref={headerRef} className={`site-header ${isDarkHero ? 'site-header--dark' : 'site-header--light'} ${scrolled ? 'site-header--scrolled' : ''} ${menuOpen ? 'site-header--menu-open' : ''}`}>
      <div className="nav-inner">
        <Logo light={isDarkHero} />
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="nav-actions">
          <Link className="nav-saved" to="/saved" aria-label={`Saved properties${favorites.length ? `, ${favorites.length} saved` : ''}`} title="Saved properties">
            <Heart size={16} strokeWidth={1.5} fill={favorites.length ? 'currentColor' : 'none'} />
            {favorites.length > 0 && <span className="nav-saved__count">{favorites.length}</span>}
          </Link>
          <Link className="nav-enquire" to="/contact">
            <span>Enquire</span><ArrowUpRight size={15} strokeWidth={1.45} aria-hidden="true" />
          </Link>
          <button ref={toggleRef} className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={21} strokeWidth={1.4} /> : <Menu size={21} strokeWidth={1.4} />}
          </button>
        </div>
      </div>
      <div ref={menuRef} className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu__top"><span className="eyebrow">The ENKOP directory</span><span className="mobile-menu__index">01 — 06</span></div>
        <nav aria-label="Mobile navigation">
          <Link to="/properties"><span>01</span>Properties</Link>
          <Link to="/about"><span>02</span>About ENKOP</Link>
          <Link to="/services"><span>03</span>Services</Link>
          <Link to="/insights"><span>04</span>Insights</Link>
          <Link to="/saved"><span>05</span>Saved properties{favorites.length ? ` · ${favorites.length}` : ''}</Link>
          <Link to="/contact"><span>06</span>Contact</Link>
        </nav>
        <div className="mobile-menu__bottom">
          <p>Thoughtful real estate.<br />Nairobi, Kenya.</p>
          <Link className="button button--light" to="/contact">Enquire now <ArrowUpRight size={16} /></Link>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="footer-main page-container">
        <div className="footer-brand-column">
          <Logo light />
          <p className="footer-statement">Exceptional spaces.<br /><em>Thoughtfully represented.</em></p>
        </div>
        <div className="footer-column">
          <span className="eyebrow">Explore</span>
          <Link to="/properties">The collection</Link>
          <Link to="/saved">Saved properties</Link>
          <Link to="/about">About ENKOP</Link>
          <Link to="/services">Our services</Link>
          <Link to="/insights">Perspective</Link>
        </div>
        <div className="footer-column">
          <span className="eyebrow">Connect</span>
          <Link to="/contact">Start a conversation <ArrowUpRight size={13} /></Link>
          {siteConfig.email && <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>}
          {siteConfig.phone ? <a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}>{siteConfig.phone}</a> : <span>Nairobi, Kenya</span>}
          <div className="footer-socials">
            {siteConfig.socials.instagram && <a href={siteConfig.socials.instagram} target="_blank" rel="noreferrer" aria-label="ENKOP on Instagram"><Instagram size={15} /></a>}
            {siteConfig.socials.linkedin && <a href={siteConfig.socials.linkedin} target="_blank" rel="noreferrer" aria-label="ENKOP on LinkedIn"><Linkedin size={15} /></a>}
            {siteConfig.socials.facebook && <a href={siteConfig.socials.facebook} target="_blank" rel="noreferrer" aria-label="ENKOP on Facebook"><Facebook size={15} /></a>}
            {siteConfig.socials.youtube && <a href={siteConfig.socials.youtube} target="_blank" rel="noreferrer" aria-label="ENKOP on YouTube"><Youtube size={15} /></a>}
            {siteConfig.socials.tiktok && <a href={siteConfig.socials.tiktok} target="_blank" rel="noreferrer" aria-label="ENKOP on TikTok"><span>TT</span></a>}
            {siteConfig.socials.x && <a href={siteConfig.socials.x} target="_blank" rel="noreferrer" aria-label="ENKOP on X"><span>𝕏</span></a>}
          </div>
        </div>
        <div className="footer-cta-column">
          <span className="eyebrow">A considered next step</span>
          <p>Finding a place begins<br />with a conversation.</p>
          <Link className="footer-round-link" to="/contact" aria-label="Contact ENKOP"><ArrowUpRight size={21} /></Link>
        </div>
      </div>
      <div className="footer-bottom page-container">
        <span>© {year} ENKOP REAL ESTATE</span>
        <span>NAIROBI · KENYA</span>
        <span className="footer-preview-note">{isLiveBackendConfigured ? 'ENKOP · NAIROBI' : 'Preview experience · sample content'}</span>
      </div>
    </footer>
  );
}

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${visible ? 'reveal--visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

export function SectionEyebrow({ children, number }: { children: ReactNode; number?: string }) {
  return <div className="section-eyebrow"><span>{number && `${number} / `}{children}</span><span className="section-eyebrow__rule" /></div>;
}

export function ArrowLink({ to, children, light = false, external = false, className = '' }: { to: string; children: ReactNode; light?: boolean; external?: boolean; className?: string }) {
  const content = <>{children}<span className="arrow-link__icon"><ArrowUpRight size={16} strokeWidth={1.5} /></span></>;
  return external ? (
    <a className={`arrow-link ${light ? 'arrow-link--light' : ''} ${className}`} href={to} target="_blank" rel="noreferrer">{content}</a>
  ) : (
    <Link className={`arrow-link ${light ? 'arrow-link--light' : ''} ${className}`} to={to}>{content}</Link>
  );
}

export function ScrollCue({ label = 'Scroll to explore', target = '#content' }: { label?: string; target?: string }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const update = () => setVisible(window.scrollY < 70);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return <a className={`scroll-cue ${visible ? '' : 'scroll-cue--hidden'}`} href={target} aria-label={label} aria-hidden={!visible} tabIndex={visible ? 0 : -1}><span>{label}</span><ArrowDown size={14} strokeWidth={1.35} /></a>;
}

export function StatusBadge({ status }: { status: Property['status'] }) {
  const key = status.toLowerCase().replace(/\s+/g, '-');
  return <span className={`status-badge status-badge--${key}`}>{status}</span>;
}

export function FavoriteToggle({ property, className = '', showLabel = false }: { property: Property; className?: string; showLabel?: boolean }) {
  const { favorites, toggleFavorite } = useExperience();
  const saved = favorites.includes(property.id);
  const label = saved ? `Remove ${property.title} from saved properties` : `Save ${property.title}`;
  return (
    <button className={`favorite-toggle ${className}`} type="button" aria-label={label} aria-pressed={saved} onClick={(event) => { event.preventDefault(); event.stopPropagation(); toggleFavorite(property.id); }}>
      <Heart size={16} strokeWidth={1.5} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
      {showLabel && <span>{saved ? 'Saved' : 'Save property'}</span>}
    </button>
  );
}

export function PropertyCard({ property, size = 'regular', index }: { property: Property; size?: 'regular' | 'feature' | 'portrait'; index?: string }) {
  const cover = getPropertyGalleryImages(property)[0];
  return (
    <article className={`property-card property-card--${size}`}>
      <Link className="property-card__link" to={`/properties/${property.slug}`} aria-label={`View ${property.title}`}>
        <div className="property-card__media">
          <img src={cover?.src || '/images/hero-karen-residence.jpg'} alt={cover?.alt || property.title} loading="lazy" decoding="async" />
          <div className="property-card__shade" />
          <div className="property-card__topline">
            <StatusBadge status={property.status} />
            {property.isSample && <span className="sample-pill">Preview listing</span>}
          </div>
          <span className="property-card__open" aria-hidden="true"><ArrowUpRight size={18} strokeWidth={1.45} /></span>
          <div className="property-card__media-copy">
            {index && <span className="property-card__index">{index}</span>}
            <span className="property-card__media-place">{property.neighborhood} <i>·</i> {property.city}</span>
          </div>
        </div>
        <div className="property-card__info">
          <div>
            <p className="property-card__type">{property.propertyType} <span>·</span> {property.bedrooms} bedrooms</p>
            <h3>{property.title}</h3>
          </div>
          <div className="property-card__price-block">
            <span className="property-card__price">{formatPrice(property)}</span>
            <span className="property-card__details">{property.area} m² <span>·</span> {property.bathrooms} baths <span>·</span> {property.parking} parking</span>
          </div>
        </div>
      </Link>
      <FavoriteToggle property={property} className="favorite-toggle--card" />
    </article>
  );
}

export function ButtonLink({ to, children, variant = 'dark', className = '' }: { to: string; children: ReactNode; variant?: 'dark' | 'light' | 'outline'; className?: string }) {
  return <Link className={`button button--${variant} ${className}`} to={to}>{children}<ArrowUpRight size={16} strokeWidth={1.5} /></Link>;
}

export function WhatsAppFloat() {
  const { pathname } = useLocation();
  const message = 'Hello ENKOP, I would like to learn more about your properties and services.';
  if (pathname === '/contact' || pathname.startsWith('/properties/')) return null;
  return (
    <a className="whatsapp-float" href={whatsappUrl(message)} target="_blank" rel="noreferrer" aria-label="Start an ENKOP WhatsApp enquiry">
      <span className="whatsapp-float__dot" />
      <span>Let’s talk</span>
      <ArrowUpRight size={14} />
    </a>
  );
}

export function PageIntro({ eyebrow, title, body, dark = false }: { eyebrow: string; title: ReactNode; body?: string; dark?: boolean }) {
  return (
    <section className={`page-intro ${dark ? 'page-intro--dark' : ''}`}>
      <div className="page-container page-intro__inner">
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        <h1>{title}</h1>
        {body && <p className="page-intro__body">{body}</p>}
      </div>
    </section>
  );
}

export function ImageCredit({ children }: { children: ReactNode }) {
  return <span className="image-credit">{children}</span>;
}

export function GalleryImage({ image, className = '', onClick }: { image: PropertyImage; className?: string; onClick: () => void }) {
  return (
    <button className={`gallery-image ${className}`} type="button" onClick={onClick} aria-label={`Open image: ${image.alt}`}>
      <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
      <span className="gallery-image__hint">View image <ArrowUpRight size={14} /></span>
    </button>
  );
}

export function BackToTop() {
  return <button className="back-to-top" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"><ArrowUpRight size={15} /></button>;
}
