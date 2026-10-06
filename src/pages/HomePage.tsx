import { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, MoveUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ArrowLink, ImageCredit, PropertyCard, Reveal, ScrollCue, SectionEyebrow } from '../components/common';
import { PropertySearch } from '../components/PropertySearch';
import { HeroScape } from '../components/HeroScape';
import { SEO } from '../components/SEO';
import { useProperties } from '../context/PropertyContext';
import { useExperience, type VisitorIntent } from '../context/ExperienceContext';
import { insights } from '../data/insights';
import { propertyLocations } from '../data/properties';
import { absoluteSiteUrl } from '../lib/config';

const intentChoices: { value: VisitorIntent; label: string; note: string }[] = [
  { value: 'buy', label: 'Buy', note: 'Find a place to call your own.' },
  { value: 'rent', label: 'Rent', note: 'Explore considered rental homes.' },
  { value: 'invest', label: 'Invest', note: 'Review residences listed for sale.' },
  { value: 'sell', label: 'Sell', note: 'Start a conversation about representation.' },
];

const categories = [
  { name: 'Apartments', type: 'apartment', image: '/images/oak-residence-exterior.jpg', alt: 'Contemporary apartment architecture framed by trees', number: '01' },
  { name: 'Private homes', type: 'villa', image: '/images/karen-villa-day.jpg', alt: 'A quiet modern home in a lush Nairobi garden', number: '02' },
  { name: 'City above', type: 'penthouse', image: '/images/westlands-penthouse.jpg', alt: 'A rooftop terrace looking across Westlands at dusk', number: '03' },
  { name: 'Townhouses', type: 'townhouse', image: '/images/karen-villa-day.jpg', alt: 'A contemporary low-rise residence set within a green Nairobi garden', number: '04' },
];

const homeSections = [
  { id: 'collection', label: 'Collection' },
  { id: 'experience', label: 'Property types' },
  { id: 'services', label: 'Services' },
  { id: 'neighbourhoods', label: 'Nairobi' },
  { id: 'journal', label: 'Journal' },
];

function HomeSectionNavigation() {
  const [active, setActive] = useState(homeSections[0].id);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const nodes = homeSections.map((section) => document.getElementById(section.id)).filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver((entries) => {
      const next = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (next?.target instanceof HTMLElement) setActive(next.target.id);
    }, { rootMargin: '-28% 0px -55% 0px', threshold: [0, 0.2, 0.45, 0.7] });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  return <nav className="home-section-nav" aria-label="Homepage sections">{homeSections.map((section, index) => <a key={section.id} href={`#${section.id}`} className={active === section.id ? 'is-active' : ''} aria-label={`Go to ${section.label}`} aria-current={active === section.id ? 'location' : undefined}><span>{String(index + 1).padStart(2, '0')}</span><i /></a>)}</nav>;
}

export default function HomePage() {
  const { properties } = useProperties();
  const { intent, setIntent, recentlyViewed } = useExperience();
  const activeProperties = properties.filter((property) => !['Sold', 'Let'].includes(property.status));
  const preferredPool = intent === 'rent'
    ? activeProperties.filter((property) => property.listingType === 'rent')
    : intent === 'buy' || intent === 'invest'
      ? activeProperties.filter((property) => property.listingType === 'sale')
      : activeProperties;
  const curatedPool = preferredPool.length ? preferredPool : activeProperties;
  const preferredFeatured = curatedPool.filter((property) => property.featured);
  const featuredList = intent === 'sell' ? [] : (preferredFeatured.length ? preferredFeatured : curatedPool).slice(0, 2);
  const selectedWork = properties.filter((property) => ['Sold', 'Let', 'Coming Soon'].includes(property.status)).slice(0, 2);
  const areas = properties.length ? Array.from(new Set(properties.map((property) => property.neighborhood))).filter(Boolean).slice(0, 6) : propertyLocations.slice(0, 6);
  const recentProperties = recentlyViewed.flatMap((id) => { const property = properties.find((item) => item.id === id); return property ? [property] : []; }).slice(0, 3);
  const firstInsight = insights[0];
  const secondInsight = insights[1];

  return (
    <>
      <SEO title="ENKOP — Exceptional spaces" description="A considered view of property. Explore curated real estate, distinctive homes and local perspective across Nairobi and beyond." image="/images/hero-karen-residence.jpg" path="/" structuredData={{
        '@context': 'https://schema.org',
        '@type': 'RealEstateAgent',
        name: 'ENKOP Real Estate',
        url: absoluteSiteUrl('/'),
        description: 'A considered real-estate practice based in Nairobi, Kenya.',
        address: { '@type': 'PostalAddress', addressLocality: 'Nairobi', addressCountry: 'KE' },
        areaServed: { '@type': 'City', name: 'Nairobi' },
      }} />
      <HomeSectionNavigation />
      <section className="home-hero" id="home" aria-label="ENKOP real estate in Nairobi">
        <HeroScape />
        <div className="home-hero__content page-container">
          <span className="eyebrow hero-eyebrow">Property, with perspective <i>·</i> Nairobi</span>
          <h1><span>Exceptional</span><span><em>spaces.</em></span></h1>
          <p>Curated real estate across Nairobi<br className="desktop-only" /> and beyond.</p>
          <div className="hero-actions">
            <Link className="button button--light" to="/properties">Explore the collection <ArrowUpRight size={16} /></Link>
            <Link className="hero-secondary-link" to="/contact">Work with ENKOP <ArrowRight size={15} /></Link>
          </div>
        </div>
        <ScrollCue target="#content" />
        <div className="hero-side-note">A MORE CONSIDERED WAY TO FIND YOUR PLACE</div>
      </section>

      <div id="content" className="home-content">
        <section className="brand-statement section-paper">
          <div className="page-container brand-statement__layout">
            <Reveal className="brand-statement__side"><SectionEyebrow number="01">Our point of view</SectionEyebrow><span className="brand-statement__aside">A different perspective<br />on property.</span></Reveal>
            <Reveal className="brand-statement__main" delay={90}>
              <h2>Real estate,<br /><em>with perspective.</em></h2>
              <div className="brand-statement__bottom">
                <span className="brand-statement__mark">ENKOP<br /><i>01 / 04</i></span>
                <p>We connect people with exceptional spaces through a more considered approach to property.</p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="search-band" aria-label="Find a property">
          <div className="page-container search-band__inner">
            <div className="search-band__label"><span className="eyebrow">Begin somewhere</span><h2>Find your fit.</h2></div>
            <PropertySearch compact />
          </div>
        </section>

        <section className="intent-discovery section-paper" aria-labelledby="intent-discovery-title">
          <div className="page-container intent-discovery__inner">
            <div className="intent-discovery__copy"><span className="eyebrow">A more personal starting point</span><h2 id="intent-discovery-title">What brings you<br /><em>to ENKOP?</em></h2></div>
            <div className="intent-discovery__choices" role="group" aria-label="Choose what you are looking for">
              {intentChoices.map((choice) => <button key={choice.value} type="button" className={intent === choice.value ? 'is-active' : ''} aria-pressed={intent === choice.value} onClick={() => setIntent(intent === choice.value ? null : choice.value)}><span>{choice.label}</span><ArrowUpRight size={14} /></button>)}
              <p aria-live="polite">{intent ? `${intentChoices.find((choice) => choice.value === intent)?.note} Your preference stays on this device.` : 'Choose a direction. We’ll quietly tailor the residences we show you.'}</p>
            </div>
          </div>
        </section>

        <section className="featured-section section-paper" id="collection">
          <div className="page-container">
            <div className="section-heading-row">
              <Reveal><SectionEyebrow number="02">{intent ? `Selected for ${intent === 'invest' ? 'investment' : intent === 'sell' ? 'your plans' : intent}` : 'Selected properties'}</SectionEyebrow><h2 className="section-heading">Spaces, selected<br /><em>with care.</em></h2></Reveal>
              <Reveal delay={120} className="section-heading-aside"><p>{intent === 'rent' ? 'A considered selection of residences currently offered for rent.' : intent === 'buy' ? 'A considered selection of residences currently offered for sale.' : intent === 'invest' ? 'Sale listings to help you begin an investment conversation.' : intent === 'sell' ? 'Tell us about the property you are considering representing.' : 'A small collection of distinctive homes, each with a point of view.'}</p>{intent === 'sell' ? <ArrowLink to="/contact?interest=Selling">Work with ENKOP</ArrowLink> : <ArrowLink to={intent === 'rent' ? '/properties?status=For%20Rent' : intent === 'buy' || intent === 'invest' ? '/properties?status=For%20Sale' : '/properties'}>View the collection</ArrowLink>}</Reveal>
            </div>
            {intent === 'sell' ? <div className="owner-featured-cta"><div><span className="eyebrow">For property owners</span><h3>Have a property<br /><em>worth representing?</em></h3><p>Tell us what you are considering. We will begin with a conversation.</p></div><Link className="button button--dark" to="/contact?interest=Selling">Work with ENKOP <ArrowUpRight size={16} /></Link></div> : <div className="featured-property-grid">
              {featuredList.map((property, index) => <Reveal key={property.id} delay={index * 100} className={index === 1 ? 'featured-property-grid__secondary' : ''}>
                <PropertyCard property={property} size={index === 0 ? 'feature' : 'portrait'} index={`0${index + 1}`} />
              </Reveal>)}
            </div>}
            {featuredList.some((property) => property.isSample) && <div className="sample-disclosure"><span className="sample-disclosure__dot" /> Preview listings and imagery are illustrative, not actual ENKOP inventory.</div>}
          </div>
        </section>

        <section className="category-section section-ink" id="experience">
          <div className="page-container">
            <div className="category-heading">
              <Reveal><SectionEyebrow number="03">A place for every way of living</SectionEyebrow><h2 className="section-heading section-heading--light">Make room<br />for <em>what’s next.</em></h2></Reveal>
              <Reveal delay={120} className="category-intro"><p>From a city apartment to a home among the trees, find a space that feels like yours.</p></Reveal>
            </div>
            <div className="category-grid">
              {categories.map((category, index) => <Reveal key={category.type} delay={index * 100}>
                <Link className="category-card" to={`/properties?type=${category.type}`}>
                  <div className="category-card__media"><img src={category.image} alt={category.alt} loading="lazy" /><span className="category-card__number">{category.number}</span><span className="category-card__arrow"><ArrowUpRight size={18} /></span></div>
                  <div className="category-card__copy"><h3>{category.name}</h3><span>Explore <ArrowRight size={14} /></span></div>
                </Link>
              </Reveal>)}
            </div>
          </div>
        </section>

        <section className="perspective-section section-paper">
          <div className="page-container perspective-grid">
            <Reveal className="perspective-visual"><img src="/images/interior-living-room.jpg" alt="Light-filled contemporary home with a garden view" loading="lazy" /><span className="perspective-visual__stamp">PLACE<br /><i>MATTERS</i></span><ImageCredit>DETAILS THAT MAKE A HOUSE A HOME</ImageCredit></Reveal>
            <Reveal className="perspective-copy" delay={100}>
              <SectionEyebrow number="04">The ENKOP perspective</SectionEyebrow>
              <h2>Property is<br />personal.<br /><em>We keep it that way.</em></h2>
              <p>Good representation begins with listening. We bring local knowledge, a considered eye and clear advice to every step of your property journey.</p>
              <ArrowLink to="/about">Our approach</ArrowLink>
            </Reveal>
          </div>
        </section>

        <section className="services-strip section-paper" id="services">
          <div className="page-container services-strip__inner">
            <Reveal className="services-strip__heading"><SectionEyebrow number="05">What we do</SectionEyebrow><h2>Thoughtful at<br /><em>every step.</em></h2><ArrowLink to="/services">Explore our services</ArrowLink></Reveal>
            <div className="service-list-preview">
              {['Property sales', 'Lettings & leasing', 'Property sourcing', 'Real estate consultancy'].map((item, index) => <Reveal key={item} delay={index * 70} className="service-list-preview__row"><span>0{index + 1}</span><span>{item}</span><MoveUpRight size={16} strokeWidth={1.3} /></Reveal>)}
            </div>
          </div>
        </section>

        {selectedWork.length > 0 && <section className="portfolio-preview section-paper">
          <div className="page-container">
            <div className="section-heading-row"><Reveal><SectionEyebrow number="06">Selected work</SectionEyebrow><h2 className="section-heading">A record of<br /><em>considered spaces.</em></h2></Reveal><Reveal delay={100} className="section-heading-aside"><p>From first introduction to the right next chapter.</p><ArrowLink to="/properties">Explore our portfolio</ArrowLink></Reveal></div>
            <div className="portfolio-preview__grid">{selectedWork.map((property, index) => <Reveal key={property.id} delay={index * 90}><PropertyCard property={property} size="regular" index={`0${index + 1}`} /></Reveal>)}</div>
            {selectedWork.some((property) => property.isSample) && <div className="sample-disclosure"><span className="sample-disclosure__dot" /> Portfolio examples and imagery are illustrative preview content.</div>}
          </div>
        </section>}

        <section className="nairobi-section" id="neighbourhoods">
          <img className="nairobi-section__image" src="/images/nairobi-city.jpg" alt="Nairobi skyline rising above a green canopy at first light" loading="lazy" />
          <div className="nairobi-section__overlay" />
          <div className="page-container nairobi-section__inner">
            <Reveal className="nairobi-section__heading"><SectionEyebrow number="07">The city, in detail</SectionEyebrow><h2>Nairobi,<br /><em>from a different<br className="desktop-only" /> perspective.</em></h2><p>Distinct neighbourhoods. One remarkable city.</p></Reveal>
            <Reveal className="area-list" delay={120}>
              <span className="eyebrow">Explore by area</span>
              <div>{areas.map((area, index) => <Link key={area} to={`/properties?location=${encodeURIComponent(area.toLowerCase())}`}><span>0{index + 1}</span>{area}<ArrowUpRight size={13} /></Link>)}</div>
            </Reveal>
          </div>
          <ImageCredit>NAIROBI · KENYA</ImageCredit>
        </section>

        {recentProperties.length > 0 && <section className="continue-exploring section-paper" id="continue-exploring"><div className="page-container"><div className="section-heading-row"><div><SectionEyebrow>On this device</SectionEyebrow><h2 className="section-heading">Continue<br /><em>exploring.</em></h2></div><ArrowLink to="/properties">Browse the collection</ArrowLink></div><div className="property-results-grid">{recentProperties.map((property, index) => <Reveal key={property.id} delay={index * 65}><PropertyCard property={property} index={String(index + 1).padStart(2, '0')} /></Reveal>)}</div><p className="local-personalization-note">Recently viewed residences are kept only in this browser.</p></div></section>}

        <section className="insights-preview section-paper" id="journal">
          <div className="page-container">
            <div className="section-heading-row insights-heading-row">
              <Reveal><SectionEyebrow number="08">ENKOP perspective</SectionEyebrow><h2 className="section-heading">A little more<br /><em>to consider.</em></h2></Reveal>
              <Reveal delay={120} className="section-heading-aside"><p>Notes on place, design and the way we live.</p><ArrowLink to="/insights">Read our journal</ArrowLink></Reveal>
            </div>
            <div className="insights-home-grid">
              {[firstInsight, secondInsight].filter(Boolean).map((article, index) => <Reveal key={article.slug} delay={index * 100}>
                <Link className="insight-card" to={`/insights/${article.slug}`}>
                  <div className="insight-card__image"><img src={article.image} alt={article.alt} loading="lazy" /><span><ArrowUpRight size={17} /></span></div>
                  <div className="insight-card__meta"><span>{article.category}</span><span>{article.readTime}</span></div>
                  <h3>{article.title}</h3><p>{article.excerpt}</p>
                </Link>
              </Reveal>)}
            </div>
          </div>
        </section>

        <section className="home-contact-cta section-ink">
          <div className="page-container home-contact-cta__inner">
            <Reveal><SectionEyebrow number="09">A conversation, first</SectionEyebrow><h2>Let’s find<br /><em>your next space.</em></h2></Reveal>
            <Reveal delay={120} className="home-contact-cta__side"><p>Whether you are looking to buy, sell, let or simply understand the market better, we are here to help.</p><Link className="button button--light" to="/contact">Start a conversation <ArrowUpRight size={16} /></Link><span className="home-contact-cta__note">NAIROBI · KENYA</span></Reveal>
            <span className="home-contact-cta__orb" aria-hidden="true" />
          </div>
        </section>
      </div>
    </>
  );
}
