import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, BedDouble, Bath, CarFront, Maximize2, MapPin, Check } from 'lucide-react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLink, ButtonLink, FavoriteToggle, GalleryImage, ImageCredit, PageIntro, PropertyCard, Reveal, SectionEyebrow, StatusBadge } from '../components/common';
import { EnquiryModal, GalleryModal } from '../components/Forms';
import { PropertySearch } from '../components/PropertySearch';
import { SEO } from '../components/SEO';
import { LoadingState } from '../components/Loader';
import { useProperties } from '../context/PropertyContext';
import { useExperience } from '../context/ExperienceContext';
import { formatFullPrice, formatPrice, getPropertyGalleryImages } from '../data/properties';
import { absoluteSiteUrl, siteConfig, whatsappUrl } from '../lib/config';
import type { Property } from '../types';

export function PropertiesPage() {
  const { properties, loading } = useProperties();
  const { intent } = useExperience();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const selectedLocation = (params.get('location') || '').trim().toLowerCase();
  const selectedType = (params.get('type') || '').trim().toLowerCase();
  const selectedStatus = (params.get('status') || '').trim().toLowerCase();
  const minBeds = Number(params.get('beds') || 0);
  const maxPrice = Number(params.get('maxPrice') || 0);
  const selectedSort = params.get('sort') || 'recommended';

  const filtered = useMemo(() => {
    const results = properties.filter((property) => {
      const locationMatch = !selectedLocation || `${property.location} ${property.neighborhood} ${property.city}`.toLowerCase().includes(selectedLocation);
      const typeMatch = !selectedType || property.propertyType.toLowerCase() === selectedType;
      const statusMatch = !selectedStatus || property.status.toLowerCase() === selectedStatus;
      const bedsMatch = !minBeds || property.bedrooms >= minBeds;
      const priceMatch = !maxPrice || property.price <= maxPrice;
      return locationMatch && typeMatch && statusMatch && bedsMatch && priceMatch;
    });
    if (selectedSort === 'price-low') return results.sort((a, b) => a.price - b.price);
    if (selectedSort === 'price-high') return results.sort((a, b) => b.price - a.price);
    if (selectedSort === 'area') return results.sort((a, b) => b.area - a.area);
    if (selectedSort === 'featured') return results.sort((a, b) => Number(b.featured) - Number(a.featured));
    if (selectedSort === 'newest') return results.sort((a, b) => {
      const aDate = Date.parse(a.createdAt || '');
      const bDate = Date.parse(b.createdAt || '');
      if (Number.isFinite(aDate) && Number.isFinite(bDate)) return bDate - aDate || Number(b.featured) - Number(a.featured);
      if (Number.isFinite(bDate)) return -1;
      if (Number.isFinite(aDate)) return 1;
      return Number(b.featured) - Number(a.featured);
    });
    const intentRank = (property: Property) => intent === 'rent' ? Number(property.listingType === 'rent') : intent === 'buy' || intent === 'invest' ? Number(property.listingType === 'sale') : 0;
    return results.sort((a, b) => intentRank(b) - intentRank(a) || Number(b.featured) - Number(a.featured));
  }, [properties, selectedLocation, selectedType, selectedStatus, minBeds, maxPrice, selectedSort, intent]);

  const hasFilters = Boolean(selectedLocation || selectedType || selectedStatus || minBeds || maxPrice);
  if (loading && properties.length === 0) return <LoadingState label="Preparing the collection" />;

  return (
    <>
      <SEO title="The Collection — ENKOP Real Estate" description="Discover exceptional residences curated by ENKOP across Nairobi. Search by neighbourhood, property type and availability." path="/properties" />
      <section className="collection-intro page-container">
        <div className="collection-intro__top"><span className="eyebrow">ENKOP · NAIROBI</span><span className="eyebrow">A considered collection</span></div>
        <div className="collection-intro__main">
          <div><SectionEyebrow number="01">The collection</SectionEyebrow><h1>Find your<br /><em>somewhere.</em></h1></div>
          <p>Exceptional residences, thoughtfully represented. Explore by place, pace or possibility.</p>
        </div>
        <div className="collection-intro__foot"><span>RESIDENCES · LAND · LIFESTYLE</span><span>SCROLL TO EXPLORE <ArrowDown size={13} /></span></div>
      </section>

      <section className="collection-search section-paper">
        <div className="page-container"><PropertySearch /></div>
      </section>

      <section className="collection-results section-paper">
        <div className="page-container">
          <div className="collection-results__heading">
            <div><span className="eyebrow">{hasFilters ? 'Your search' : 'Curated by ENKOP'}</span><h2>{hasFilters ? 'A closer look.' : 'The residences.'}</h2></div>
            <div className="collection-results__tools">
              <label className="collection-sort"><span>Sort by</span><select value={selectedSort} aria-label="Sort properties" onChange={(event) => { const next = new URLSearchParams(params); if (event.target.value === 'recommended') next.delete('sort'); else next.set('sort', event.target.value); navigate(`/properties${next.toString() ? `?${next.toString()}` : ''}`, { replace: true }); }}><option value="recommended">Recommended</option><option value="featured">Featured</option><option value="newest">Newest</option><option value="price-low">Price · low to high</option><option value="price-high">Price · high to low</option><option value="area">Largest area</option></select></label>
              <div className="collection-results__count"><strong>{String(filtered.length).padStart(2, '0')}</strong><span>{filtered.length === 1 ? 'residence' : 'residences'}</span></div>
            </div>
          </div>
          {filtered.some((property) => property.isSample) && <p className="collection-preview-note"><span className="sample-disclosure__dot" /> Preview listings are illustrative sample content and must be replaced with verified ENKOP inventory.</p>}
          {filtered.length ? <div className="property-results-grid">{filtered.map((property, index) => <Reveal key={property.id} delay={(index % 3) * 70}><PropertyCard property={property} index={String(index + 1).padStart(2, '0')} /></Reveal>)}</div> : (
            <div className="empty-state">
              <span className="empty-state__number">0{0}</span><span className="eyebrow">Nothing matched your search</span>
              <h3>Nothing here,<br /><em>for now.</em></h3><p>Try adjusting your location, property type or price range.</p><Link className="button button--dark" to="/properties">View all properties <ArrowUpRight size={16} /></Link>
            </div>
          )}
          {filtered.length > 0 && <div className="collection-endnote"><span>END OF THE COLLECTION</span><span>Looking for something specific? <Link to="/contact">Tell us what you have in mind <ArrowUpRight size={12} /></Link></span></div>}
        </div>
      </section>
    </>
  );
}

export function SavedPropertiesPage() {
  const { properties, loading } = useProperties();
  const { favorites } = useExperience();
  const savedProperties = favorites.map((id) => properties.find((property) => property.id === id)).filter((property): property is Property => Boolean(property));

  if (loading && properties.length === 0) return <LoadingState label="Opening your shortlist" />;
  return (
    <>
      <SEO title="Saved properties — ENKOP Real Estate" description="Your ENKOP property shortlist, saved privately on this device." path="/saved" noindex />
      <PageIntro eyebrow="YOUR ENKOP SHORTLIST" title={<>Keep the<br /><em>possibilities.</em></>} body="Properties you save stay here on this device. No account required." />
      <section className="collection-results section-paper saved-properties-page">
        <div className="page-container">
          <div className="collection-results__heading"><div><span className="eyebrow">Your shortlist</span><h2>{savedProperties.length ? 'Saved residences.' : 'A place to begin.'}</h2></div><div className="collection-results__count"><strong>{String(savedProperties.length).padStart(2, '0')}</strong><span>{savedProperties.length === 1 ? 'residence saved' : 'residences saved'}</span></div></div>
          {savedProperties.length ? <div className="property-results-grid">{savedProperties.map((property, index) => <Reveal key={property.id} delay={index * 70}><PropertyCard property={property} index={String(index + 1).padStart(2, '0')} /></Reveal>)}</div> : (
            <div className="empty-state"><span className="empty-state__number">00</span><span className="eyebrow">Your shortlist is yours alone</span><h3>Keep a few<br /><em>in mind.</em></h3><p>Save a residence while you browse, then return to it here—your shortlist stays on this device.</p><Link className="button button--dark" to="/properties">Explore the collection <ArrowUpRight size={16} /></Link></div>
          )}
          {savedProperties.some((property) => property.isSample) && <p className="collection-preview-note"><span className="sample-disclosure__dot" /> Preview listings and imagery are illustrative, not verified ENKOP inventory.</p>}
        </div>
      </section>
    </>
  );
}

function UnavailableProperty() {
  return (
    <>
      <SEO title="Property unavailable — ENKOP Real Estate" description="This property is no longer available. Explore the ENKOP collection or speak with our team about finding another space." />
      <section className="unavailable-property page-container">
      <div className="unavailable-property__mark">E</div>
      <span className="eyebrow">Property update</span>
      <h1>This space<br /><em>isn’t available.</em></h1>
      <p>This property may have been let, sold or removed from the collection. We would be glad to help you find another.</p>
      <div className="unavailable-property__actions"><ButtonLink to="/properties">Browse properties</ButtonLink><ArrowLink to="/contact">Contact ENKOP</ArrowLink></div>
      </section>
    </>
  );
}

function PropertyHero({ property, onEnquire, onViewing }: { property: Property; onEnquire: () => void; onViewing: () => void }) {
  const image = getPropertyGalleryImages(property)[0] || { src: '/images/hero-karen-residence.jpg', alt: property.title };
  return (
    <section className="property-hero">
      <img src={image.src} alt={image.alt} fetchPriority="high" />
      <div className="property-hero__veil" />
      <div className="property-hero__content page-container">
        <div className="property-breadcrumb"><Link to="/properties">The collection</Link><span>/</span><span>{property.neighborhood}</span></div>
        <div className="property-hero__tags"><StatusBadge status={property.status} />{property.isSample && <span className="sample-pill">Preview listing</span>}<FavoriteToggle property={property} className="favorite-toggle--hero" showLabel /></div>
        <h1>{property.title}</h1>
        <div className="property-hero__location"><MapPin size={14} strokeWidth={1.35} /><span>{property.location}</span><i>·</i><span>{property.propertyType}</span></div>
        <div className="property-hero__bottom">
          <div><span className="eyebrow">{property.status === 'Sold' || property.status === 'Let' ? 'Previous price' : 'Asking price'}</span><strong>{formatPrice(property)}</strong></div>
          <div className="property-hero__actions"><button className="button button--light" onClick={onEnquire} type="button">Enquire about this property <ArrowUpRight size={16} /></button><button className="property-hero__viewing" onClick={onViewing} type="button">Schedule a viewing <ArrowRight size={14} /></button></div>
        </div>
      </div>
      <ImageCredit>ILLUSTRATIVE PREVIEW · {property.neighborhood.toUpperCase()}, NAIROBI</ImageCredit>
    </section>
  );
}

function StickyPropertyCTA({ property, onEnquire, message }: { property: Property; onEnquire: () => void; message: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>('.property-hero');
    if (!hero) return;
    const update = () => setVisible(hero.getBoundingClientRect().bottom < 96);
    if (typeof IntersectionObserver === 'undefined') {
      update();
      window.addEventListener('scroll', update, { passive: true });
      return () => window.removeEventListener('scroll', update);
    }
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    }, { threshold: 0 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;
  return (
    <aside className="property-sticky-cta" aria-label={`Quick enquiry for ${property.title}`}>
      <div className="property-sticky-cta__property"><span>{property.isSample ? 'ILLUSTRATIVE PREVIEW' : `${property.neighborhood} · ${property.status}`}</span><strong>{property.title}</strong></div>
      <div className="property-sticky-cta__price"><span>{property.isSample ? 'PREVIEW PRICE' : 'GUIDE PRICE'}</span><strong>{formatPrice(property)}</strong></div>
      <button className="property-sticky-cta__enquire" type="button" onClick={onEnquire}>Enquire <ArrowUpRight size={15} /></button>
      <a className="property-sticky-cta__whatsapp" href={whatsappUrl(message, property.whatsappNumber)} target="_blank" rel="noreferrer" aria-label={`Enquire about ${property.title} on WhatsApp`}>WhatsApp <ArrowUpRight size={14} /></a>
    </aside>
  );
}

export function PropertyDetailPage() {
  const { slug } = useParams();
  const { properties, loading } = useProperties();
  const { recordViewed } = useExperience();
  const property = properties.find((item) => item.slug === slug);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [viewingOpen, setViewingOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);

  useEffect(() => { if (property) recordViewed(property.id); }, [property?.id, recordViewed]);
  if (!property) return loading ? <LoadingState label="Opening the residence" /> : <UnavailableProperty />;
  const galleryImages = getPropertyGalleryImages(property).length ? getPropertyGalleryImages(property) : [{ src: '/images/hero-karen-residence.jpg', alt: property.title }];
  const related = properties
    .filter((item) => item.slug !== property.slug && !['Sold', 'Let'].includes(item.status))
    .map((item) => {
      const priceDistance = Math.abs(item.price - property.price) / Math.max(property.price, 1);
      const score = (item.neighborhood === property.neighborhood ? 4 : 0) + (item.propertyType === property.propertyType ? 2 : 0) + (priceDistance <= 0.3 ? 1 : 0) + (item.featured ? 0.2 : 0);
      return { item, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ item }) => item);
  const whatsappMessage = `Hello ENKOP, I'm interested in ${property.title} in ${property.location}. I found it on the ENKOP website and would like to arrange a viewing. ${absoluteSiteUrl(`/properties/${property.slug}`)}`;
  const mapUrl = property.googleMapsUrl || (property.latitude != null && property.longitude != null ? `https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}` : '');
  const contactPhone = property.contactPhone || siteConfig.phone;
  const propertySocialLinks = [
    { label: 'Instagram', url: property.instagramUrl },
    { label: 'Facebook', url: property.facebookUrl },
    { label: 'TikTok', url: property.tiktokUrl },
    { label: 'YouTube', url: property.youtubeUrl },
    { label: 'X', url: property.xUrl },
  ].filter((item): item is { label: string; url: string } => Boolean(item.url));
  const hasAdditionalMedia = Boolean(propertySocialLinks.length || property.virtualTourUrl || property.externalListingUrl);
  const relatedSectionNumber = 5 + Number(Boolean(property.propertyVideo)) + Number(hasAdditionalMedia);
  const availability = property.status === 'Sold' || property.status === 'Let' ? 'https://schema.org/SoldOut' : property.status === 'Coming Soon' ? 'https://schema.org/PreOrder' : 'https://schema.org/InStock';
  const propertySchema = {
    '@context': 'https://schema.org',
    '@type': 'Residence',
    name: property.title,
    description: property.description,
    image: galleryImages.map((image) => absoluteSiteUrl(image.src)),
    address: { '@type': 'PostalAddress', addressLocality: property.neighborhood, addressRegion: 'Nairobi County', addressCountry: 'KE' },
    numberOfBedrooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    floorSize: { '@type': 'QuantitativeValue', value: property.area, unitCode: 'MTK' },
    offers: { '@type': 'Offer', price: property.price, priceCurrency: property.currency, availability },
  };

  return (
    <>
      <SEO title={`${property.title} — ENKOP Real Estate`} description={`${property.description} ${property.location}. Explore this ${property.propertyType.toLowerCase()} with ENKOP.`} image={galleryImages[0]?.src} path={`/properties/${property.slug}`} noindex={property.isSample} structuredData={[propertySchema, {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteSiteUrl('/') },
          { '@type': 'ListItem', position: 2, name: 'The Collection', item: absoluteSiteUrl('/properties') },
          { '@type': 'ListItem', position: 3, name: property.title, item: absoluteSiteUrl(`/properties/${property.slug}`) },
        ],
      }]} />
      <PropertyHero property={property} onEnquire={() => setEnquiryOpen(true)} onViewing={() => setViewingOpen(true)} />
      <section className="property-overview section-paper">
        <div className="page-container property-overview__top">
          <Reveal className="property-overview__title"><SectionEyebrow number="01">The residence</SectionEyebrow><h2>A home with<br /><em>room to be.</em></h2></Reveal>
          <Reveal className="property-overview__summary" delay={100}><p>{property.description}</p><div className="property-overview__location"><MapPin size={14} /><span>{property.location}</span><span className="property-overview__pin">NAIROBI · KENYA</span></div></Reveal>
        </div>
        <div className="page-container property-facts">
          {[
            { label: 'Bedrooms', value: property.bedrooms, icon: <BedDouble size={17} /> },
            { label: 'Bathrooms', value: property.bathrooms, icon: <Bath size={17} /> },
            { label: 'Interior area', value: `${property.area} m²`, icon: <Maximize2 size={16} /> },
            { label: 'Parking', value: property.parking, icon: <CarFront size={17} /> },
          ].map((fact) => <div className="property-fact" key={fact.label}><span className="property-fact__icon">{fact.icon}</span><span className="property-fact__label">{fact.label}</span><strong>{fact.value}</strong></div>)}
        </div>
      </section>

      <section className={`property-gallery-section section-paper ${galleryImages.length < 3 ? 'property-gallery-section--two' : ''}`}>
        <div className="page-container">
          <div className="property-gallery-heading"><SectionEyebrow number="02">A closer look</SectionEyebrow><button className="text-button" type="button" onClick={() => setGalleryIndex(0)}>View all images <ArrowUpRight size={14} /></button></div>
          <div className="property-gallery-grid">
            {galleryImages.slice(0, 3).map((image, index) => <GalleryImage key={`${image.src}-${index}`} image={image} className={`property-gallery-image property-gallery-image--${index + 1}`} onClick={() => setGalleryIndex(index)} />)}
          </div>
        </div>
      </section>

      {property.propertyVideo && <section className="property-film section-ink"><div className="page-container"><div className="property-film__heading"><div><SectionEyebrow number="03">A closer look in motion</SectionEyebrow><h2>Property<br /><em>film.</em></h2></div><span className="eyebrow">ENKOP · {property.neighborhood.toUpperCase()}</span></div><video src={property.propertyVideo} controls playsInline preload="none" poster={galleryImages[0]?.src} aria-label={`Property film for ${property.title}`}>Your browser does not support embedded video.</video>{property.isSample && <p className="property-film__note">Illustrative preview media · replace with approved property footage.</p>}</div></section>}

      <section className="property-details-section section-paper">
        <div className="page-container property-details-grid">
          <Reveal className="property-details-copy"><SectionEyebrow number={property.propertyVideo ? '04' : '03'}>A considered approach</SectionEyebrow><h2>Designed for<br /><em>everyday ease.</em></h2><p>{property.description} Thoughtfully proportioned rooms, natural light and considered finishes create a calm backdrop for daily life.</p><div className="property-amenities"><span className="eyebrow">Features & amenities</span><ul>{property.amenities.map((amenity) => <li key={amenity}><Check size={14} />{amenity}</li>)}</ul></div></Reveal>
          <Reveal className="property-details-panel" delay={100}>
            <div className="property-details-panel__top"><span className="eyebrow">Property details</span><span className="property-details-panel__sample">{property.isSample ? 'ILLUSTRATIVE PREVIEW' : 'ENKOP COLLECTION'}</span></div>
            <dl>
              <div><dt>Property type</dt><dd>{property.propertyType}</dd></div>
              <div><dt>Location</dt><dd>{property.neighborhood}</dd></div>
              <div><dt>Listing status</dt><dd>{property.status}</dd></div>
              <div><dt>Interior area</dt><dd>{property.area} m²</dd></div>
              <div><dt>Price</dt><dd>{formatFullPrice(property)}</dd></div>
            </dl>
            {!property.isSample && property.agent && <div className="property-details-agent"><span>ENKOP representative</span><strong>{property.agent}</strong></div>}
            <button className="button button--dark property-details-panel__button" type="button" onClick={() => setEnquiryOpen(true)}>Enquire about this property <ArrowUpRight size={16} /></button>
          </Reveal>
        </div>
      </section>

      <section className="property-location-section section-ink">
        <div className="page-container property-location-grid">
          <Reveal><SectionEyebrow number={property.propertyVideo ? '05' : '04'}>The neighbourhood</SectionEyebrow><h2>Rooted in<br /><em>{property.neighborhood}.</em></h2><p>{property.neighborhood} offers its own pace and perspective within Nairobi. Discover a home that brings the city closer, while keeping the everyday in balance.</p><div className="property-location-actions"><Link className="text-button text-button--light" to={`/properties?location=${encodeURIComponent(property.neighborhood.toLowerCase())}`}>Explore {property.neighborhood} <ArrowUpRight size={14} /></Link>{mapUrl && <a className="text-button text-button--light" href={mapUrl} target="_blank" rel="noreferrer">{property.isSample ? 'View area in Maps' : 'Get directions'} <ArrowUpRight size={14} /></a>}</div></Reveal>
          <Reveal className="property-location-visual" delay={120}><img src="/images/nairobi-city.jpg" alt={`Nairobi neighbourhood context for ${property.neighborhood}`} loading="lazy" /><div className="location-pin"><span /><strong>{property.neighborhood}</strong><i>NAIROBI</i></div><span className="eyebrow">A sense of place</span></Reveal>
        </div>
      </section>

      {hasAdditionalMedia && <section className="property-social section-paper"><div className="page-container property-social__inner"><div><SectionEyebrow number={String(5 + Number(Boolean(property.propertyVideo))).padStart(2, '0')}>Further perspective</SectionEyebrow><h2>See it<br /><em>in context.</em></h2><p>Explore the additional property material supplied by ENKOP.</p></div><div className="property-social__links">{propertySocialLinks.map((link) => <a key={link.label} href={link.url} target="_blank" rel="noreferrer"><span>{link.label}</span><ArrowUpRight size={16} /></a>)}{property.virtualTourUrl && <a href={property.virtualTourUrl} target="_blank" rel="noreferrer"><span>Open virtual tour</span><ArrowUpRight size={16} /></a>}{property.externalListingUrl && <a href={property.externalListingUrl} target="_blank" rel="noreferrer"><span>View external listing</span><ArrowUpRight size={16} /></a>}</div></div></section>}

      <section className="property-enquiry-band section-paper">
        <div className="page-container property-enquiry-band__inner"><div><span className="eyebrow">A next step, when you’re ready</span><h2>Interested in<br /><em>this residence?</em></h2></div><div className="property-enquiry-band__actions"><button className="button button--dark" type="button" onClick={() => setEnquiryOpen(true)}>Enquire about this property <ArrowUpRight size={16} /></button><a className="button button--outline" href={whatsappUrl(whatsappMessage, property.whatsappNumber)} target="_blank" rel="noreferrer">Enquire via WhatsApp <ArrowUpRight size={16} /></a>{contactPhone && <a className="text-button" href={`tel:${contactPhone.replace(/[^\d+]/g, '')}`}>Call ENKOP <ArrowUpRight size={14} /></a>}<span>Reference: {property.slug.toUpperCase()} · {siteConfig.address.toUpperCase()}</span></div></div>
      </section>

      {related.length > 0 && <section className="related-section section-paper"><div className="page-container"><div className="section-heading-row"><div><SectionEyebrow number={String(relatedSectionNumber).padStart(2, '0')}>You may also like</SectionEyebrow><h2 className="section-heading">More spaces<br /><em>to discover.</em></h2></div><ArrowLink to="/properties">See the full collection</ArrowLink></div><div className="property-results-grid property-results-grid--related">{related.map((item, index) => <Reveal key={item.id} delay={index * 80}><PropertyCard property={item} /></Reveal>)}</div></div></section>}

      <StickyPropertyCTA property={property} onEnquire={() => setEnquiryOpen(true)} message={whatsappMessage} />
      <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} property={property} />
      <EnquiryModal open={viewingOpen} onClose={() => setViewingOpen(false)} property={property} viewing />
      <GalleryModal images={galleryImages} initialIndex={galleryIndex} onClose={() => setGalleryIndex(null)} />
    </>
  );
}
