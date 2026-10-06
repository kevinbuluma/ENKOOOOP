import { ArrowRight, ArrowUpRight, ChevronLeft, Clock3, MapPin } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLink, ImageCredit, PageIntro, Reveal, SectionEyebrow } from '../components/common';
import { LeadForm } from '../components/Forms';
import { SEO } from '../components/SEO';
import { ButtonLink } from '../components/common';
import { insights } from '../data/insights';
import { absoluteSiteUrl, siteConfig, whatsappUrl } from '../lib/config';

const team = [
  { initial: 'G', name: 'Gerard', role: 'Founder · Real estate' },
  { initial: 'F', name: 'Fari', role: 'Visuals · Content' },
  { initial: 'K', name: 'Kevin', role: 'Digital · Technology' },
];

export function AboutPage() {
  return (
    <>
      <SEO title="About ENKOP — Real estate, with perspective" description="ENKOP is a modern real-estate practice shaped by local knowledge, clear perspective and thoughtful representation across Nairobi." path="/about" />
      <section className="editorial-hero editorial-hero--about">
        <img src="/images/karen-villa-day.jpg" alt="Contemporary Kenyan architecture, quietly integrated into a green garden" fetchPriority="high" />
        <div className="editorial-hero__veil" />
        <div className="page-container editorial-hero__inner"><span className="eyebrow">ENKOP · OUR POINT OF VIEW</span><h1>We see property<br /><em>differently.</em></h1><p>Good property begins with a better question.</p><span className="editorial-hero__index">01 / ABOUT ENKOP</span></div>
        <ImageCredit>ARCHITECTURAL CONCEPT · KAREN, NAIROBI</ImageCredit>
      </section>

      <section className="about-opening section-paper">
        <div className="page-container about-opening__grid">
          <Reveal><SectionEyebrow number="01">A different perspective</SectionEyebrow></Reveal>
          <Reveal className="about-opening__copy" delay={90}><h2>Not more choice.<br /><em>Better context.</em></h2><p>ENKOP is a modern real-estate practice shaped by the belief that finding, selling or representing a property should feel considered from the first conversation to the final detail.</p></Reveal>
        </div>
      </section>

      <section className="about-image-band section-paper">
        <div className="page-container about-image-band__grid">
          <Reveal className="about-image-band__photo"><img src="/images/interior-living-room.jpg" alt="A calm, naturally lit home opening onto a tropical garden" loading="lazy" /><span className="about-image-band__caption">A HOME IS MORE THAN ITS ADDRESS.</span></Reveal>
          <Reveal className="about-image-band__text" delay={100}><span className="eyebrow">02 / Our approach</span><h2>Listen first.<br />Look closer.<br /><em>Represent well.</em></h2><p>We take the time to understand what matters to you. Then we bring local knowledge, a thoughtful eye and clear advice to the work—without the noise.</p><ArrowLink to="/services">What we do</ArrowLink></Reveal>
        </div>
      </section>

      <section className="about-principles section-ink">
        <div className="page-container"><Reveal><SectionEyebrow number="03">How we work</SectionEyebrow><h2 className="section-heading section-heading--light">A little more<br /><em>considered.</em></h2></Reveal>
          <div className="principles-grid">
            {[
              ['01', 'Local knowledge', 'We understand the character of Nairobi’s neighbourhoods and the details that make each one distinct.'],
              ['02', 'Clear perspective', 'Thoughtful advice, honest context and a steady hand through the decisions that matter.'],
              ['03', 'Careful representation', 'Every property has a story. We make sure it is told with clarity, integrity and intention.'],
            ].map(([number, title, description], index) => <Reveal className="principle-card" key={number} delay={index * 90}><span>{number}</span><h3>{title}</h3><p>{description}</p></Reveal>)}
          </div>
        </div>
      </section>

      <section className="team-section section-paper">
        <div className="page-container team-section__grid">
          <Reveal><SectionEyebrow number="04">The people behind ENKOP</SectionEyebrow><h2 className="section-heading">People make<br /><em>the perspective.</em></h2><p className="team-section__intro">A small, complementary team bringing property, visual storytelling and digital experience together.</p></Reveal>
          <div className="team-list">{team.map((person, index) => <Reveal key={person.name} delay={index * 75} className="team-member"><span className="team-member__initial" aria-hidden="true">{person.initial}</span><div><h3>{person.name}</h3><p>{person.role}</p></div><span className="team-member__index">0{index + 1}</span></Reveal>)}</div>
        </div>
      </section>

      <section className="about-city-cta">
        <img src="/images/nairobi-city.jpg" alt="Morning light across Nairobi’s green cityscape" loading="lazy" /><div className="about-city-cta__veil" />
        <div className="page-container about-city-cta__content"><span className="eyebrow">Rooted in Nairobi · Open to possibility</span><h2>Place matters.<br /><em>So does perspective.</em></h2><ButtonLink to="/contact" variant="light">Get to know ENKOP</ButtonLink></div>
        <ImageCredit>CONCEPT IMAGE · NAIROBI, KENYA</ImageCredit>
      </section>
    </>
  );
}

const services = [
  { number: '01', name: 'Property sales', summary: 'A clear strategy and considered representation for every sale.', image: '/images/oak-residence-exterior.jpg', alt: 'A contemporary residential building framed by mature trees', interest: 'Selling' },
  { number: '02', name: 'Lettings & leasing', summary: 'Connecting well-matched people with spaces they can make their own.', image: '/images/interior-living-room.jpg', alt: 'Natural materials and morning light in a contemporary home', interest: 'Renting' },
  { number: '03', name: 'Property sourcing', summary: 'A personal search shaped around your priorities, not just a brief.', image: '/images/westlands-penthouse.jpg', alt: 'A rooftop terrace and city view in Westlands', interest: 'Buying' },
  { number: '04', name: 'Real estate consultancy', summary: 'Grounded insight for decisions that deserve a little more thought.', image: '/images/nairobi-city.jpg', alt: 'The Nairobi skyline in early morning haze', interest: 'Property management' },
  { number: '05', name: 'Property marketing', summary: 'A distinctive story, told with the clarity and care a property deserves.', image: '/images/karen-villa-day.jpg', alt: 'Contemporary stone residence in a landscaped Nairobi garden', interest: 'Selling' },
  { number: '06', name: 'Property representation', summary: 'Attentive guidance through the process, from first viewing to close.', image: '/images/hero-karen-residence.jpg', alt: 'Warm evening light across a contemporary residence', interest: 'General enquiry' },
];

export function ServicesPage() {
  return (
    <>
      <SEO title="Services — ENKOP Real Estate" description="Thoughtful property sales, letting, sourcing, consultancy, marketing and representation in Nairobi." path="/services" />
      <section className="editorial-hero editorial-hero--services">
        <img src="/images/interior-living-room.jpg" alt="A spacious, quiet interior with garden views" fetchPriority="high" />
        <div className="editorial-hero__veil" />
        <div className="page-container editorial-hero__inner"><span className="eyebrow">A considered way to work</span><h1>Property,<br /><em>thoughtfully.</em></h1><p>From a first conversation to a confident next step.</p><span className="editorial-hero__index">02 / OUR SERVICES</span></div>
        <ImageCredit>ILLUSTRATIVE INTERIOR · NAIROBI</ImageCredit>
      </section>

      <section className="services-intro section-paper"><div className="page-container services-intro__inner"><SectionEyebrow number="01">Our services</SectionEyebrow><p>Good representation is personal. Tell us where you are, and we will meet you there.</p><ArrowLink to="/contact">Start a conversation</ArrowLink></div></section>

      <section className="services-full section-paper"><div className="page-container"><div className="services-list-heading"><span className="eyebrow">How we can help</span><span>01 — 06 <i>·</i> ENKOP SERVICES</span></div><div className="services-editorial-list">{services.map((service, index) => <Reveal className="service-row" key={service.number} delay={index * 45}><Link to={`/contact?interest=${encodeURIComponent(service.interest)}`}><span className="service-row__number">{service.number}</span><div className="service-row__main"><h2>{service.name}</h2><p>{service.summary}</p></div><div className="service-row__image"><img src={service.image} alt={service.alt} loading="lazy" /></div><span className="service-row__arrow"><ArrowUpRight size={17} /></span></Link></Reveal>)}</div></div></section>

      <section className="services-cta section-ink"><div className="page-container services-cta__inner"><div><SectionEyebrow number="02">Begin with a conversation</SectionEyebrow><h2>Whatever the<br /><em>next move.</em></h2></div><div><p>Buying, selling, renting or planning ahead—let’s work out what makes sense for you.</p><ButtonLink to="/contact" variant="light">Talk to ENKOP</ButtonLink></div></div></section>
    </>
  );
}

export function InsightsPage() {
  const [params] = useSearchParams();
  const activeCategory = params.get('category') || '';
  const categories = ['All', ...Array.from(new Set(insights.map((article) => article.category)))];
  const articles = activeCategory ? insights.filter((article) => article.category.toLowerCase() === activeCategory.toLowerCase()) : insights;
  const featured = articles[0];
  const rest = articles.slice(1);
  return (
    <>
      <SEO title="ENKOP Journal — Notes on place and possibility" description="A considered view of the places we live, the spaces we value and the city we call home." path="/insights" />
      <PageIntro eyebrow="ENKOP JOURNAL · 01" title={<>Notes on place<br /><em>and possibility.</em></>} body="A considered view of the places we live, the spaces we value and the city we call home." />
      <section className="insights-page section-paper"><div className="page-container">
        <div className="insights-category-filter" aria-label="Filter insights by category">{categories.map((category) => <Link key={category} className={((category === 'All' && !activeCategory) || activeCategory === category) ? 'is-active' : ''} to={category === 'All' ? '/insights' : `/insights?category=${encodeURIComponent(category)}`}>{category}</Link>)}</div>
        <p className="collection-preview-note"><span className="sample-disclosure__dot" /> Editorial preview content. Articles are illustrative and should be approved before publication.</p>
        {featured ? <>
          <Reveal className="insight-feature"><Link to={`/insights/${featured.slug}`}><div className="insight-feature__image"><img src={featured.image} alt={featured.alt} /><span className="insight-feature__open"><ArrowUpRight size={19} /></span></div><div className="insight-feature__copy"><div className="insight-card__meta"><span>{featured.category}</span><span>{featured.date}</span></div><h2>{featured.title}</h2><p>{featured.excerpt}</p><span className="text-button">Read the story <ArrowUpRight size={14} /></span></div></Link></Reveal>
          {rest.length > 0 && <div className="insight-list-grid">{rest.map((article, index) => <Reveal key={article.slug} delay={index * 70}><Link className="insight-card" to={`/insights/${article.slug}`}><div className="insight-card__image"><img src={article.image} alt={article.alt} loading="lazy" /><span><ArrowUpRight size={17} /></span></div><div className="insight-card__meta"><span>{article.category}</span><span>{article.date}</span></div><h3>{article.title}</h3><p>{article.excerpt}</p><span className="insight-read-time"><Clock3 size={13} /> {article.readTime}</span></Link></Reveal>)}</div>}
        </> : <div className="empty-state"><span className="eyebrow">No articles in this category yet</span><h3>More to come.</h3><ButtonLink to="/insights">View all insights</ButtonLink></div>}
      </div></section>
      <section className="insights-bottom-cta section-ink"><div className="page-container"><span className="eyebrow">Stay curious</span><h2>Good perspective<br /><em>travels well.</em></h2><ArrowLink to="/properties" light>Explore the collection</ArrowLink></div></section>
    </>
  );
}

export function InsightDetailPage() {
  const { slug } = useParams();
  const article = insights.find((item) => item.slug === slug);
  if (!article) return <NotFoundPage compact />;
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    image: absoluteSiteUrl(article.image),
    author: { '@type': 'Organization', name: 'ENKOP Real Estate' },
    publisher: { '@type': 'Organization', name: 'ENKOP Real Estate' },
  };
  return (
    <>
      <SEO title={`${article.title} — ENKOP Journal`} description={article.excerpt} image={article.image} path={`/insights/${article.slug}`} type="article" structuredData={[articleSchema, {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteSiteUrl('/') },
          { '@type': 'ListItem', position: 2, name: 'Journal', item: absoluteSiteUrl('/insights') },
          { '@type': 'ListItem', position: 3, name: article.title, item: absoluteSiteUrl(`/insights/${article.slug}`) },
        ],
      }]} />
      <article className="article-page">
        <div className="article-hero"><img src={article.image} alt={article.alt} fetchPriority="high" /><div className="article-hero__veil" /><div className="page-container article-hero__content"><Link to="/insights" className="article-back"><ChevronLeft size={14} /> Journal</Link><span className="eyebrow">{article.category} <i>·</i> {article.date}</span><h1>{article.title}</h1><p>{article.excerpt}</p><span className="article-read-time"><Clock3 size={14} /> {article.readTime}</span></div><ImageCredit>ENKOP PERSPECTIVE · NAIROBI</ImageCredit></div>
        <div className="article-body page-container"><aside><span className="eyebrow">In this story</span><span>{article.category}</span><span>{article.date}</span><Link to="/insights">Back to journal <ArrowUpRight size={13} /></Link></aside><div className="article-body__copy">{article.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}<div className="article-quote"><span>“</span><p>A considered view can change the way a place feels.</p></div><Link className="article-contact-link" to="/contact">Have a property question? Start a conversation <ArrowUpRight size={14} /></Link></div></div>
      </article>
      <section className="article-next section-paper"><div className="page-container"><SectionEyebrow>Continue reading</SectionEyebrow><div>{insights.filter((item) => item.slug !== article.slug).slice(0, 2).map((item) => <Link key={item.slug} to={`/insights/${item.slug}`}><span className="eyebrow">{item.category}</span><h3>{item.title}</h3><ArrowUpRight size={17} /></Link>)}</div></div></section>
    </>
  );
}

export function ContactPage() {
  const [params] = useSearchParams();
  const interest = params.get('interest') || undefined;
  const phone = siteConfig.phone;
  const whatsappMessage = 'Hello ENKOP, I would like to talk about a property opportunity.';
  return (
    <>
      <SEO title="Contact ENKOP — Start a conversation" description="Talk with ENKOP about buying, selling, renting or managing property in Nairobi." path="/contact" />
      <section className="contact-hero section-ink"><div className="page-container contact-hero__inner"><div><span className="eyebrow">A good place to begin</span><h1>Let’s find<br /><em>your next space.</em></h1></div><div className="contact-hero__side"><p>Tell us what you are looking for. We’ll bring a little perspective to the conversation.</p><a href="#contact-form" className="contact-hero__jump">Start below <ArrowDownIcon /></a></div></div><span className="contact-hero__seal">ENKOP<br /><i>NAIROBI</i></span></section>
      <section className="contact-main section-paper" id="contact-form"><div className="page-container contact-main__grid">
        <Reveal className="contact-details"><SectionEyebrow number="01">Get in touch</SectionEyebrow><h2>A conversation<br /><em>starts here.</em></h2><p>Whether you have a property in mind or a question about the market, we would be glad to hear from you.</p>
          <div className="contact-channel-list">
            {siteConfig.email ? <a href={`mailto:${siteConfig.email}`}><span className="eyebrow">Email</span><strong>{siteConfig.email}</strong><ArrowUpRight size={14} /></a> : <a href="#contact-form"><span className="eyebrow">Enquiry form</span><strong>Send us a message</strong><ArrowUpRight size={14} /></a>}
            {phone && <a href={`tel:${phone.replace(/\s/g, '')}`}><span className="eyebrow">Call</span><strong>{phone}</strong><ArrowUpRight size={14} /></a>}
            <a href={whatsappUrl(whatsappMessage)} target="_blank" rel="noreferrer"><span className="eyebrow">WhatsApp</span><strong>Start a conversation</strong><ArrowUpRight size={14} /></a>
            <div className="contact-location"><span className="eyebrow">Visit</span><strong>{siteConfig.address}</strong><MapPin size={14} /></div>
          </div>
          <div className="contact-city-image"><img src="/images/nairobi-city.jpg" alt="Nairobi, home to ENKOP" loading="lazy" /><span className="contact-city-image__label">ENKOP · NAIROBI, KENYA</span></div>
        </Reveal>
        <Reveal className="contact-form-wrap" delay={110}><div className="contact-form-heading"><span className="eyebrow">Tell us a little more</span><h3>How can we help?</h3></div><LeadForm initialInterest={interest} /></Reveal>
      </div></section>
    </>
  );
}

function ArrowDownIcon() { return <ArrowRight className="contact-hero__arrow" size={14} />; }

export function NotFoundPage({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <SEO title="Page not found — ENKOP" description="We couldn’t find the page you were looking for. Explore the ENKOP property collection or return home." />
      <section className={`not-found-page ${compact ? 'not-found-page--compact' : ''}`}>
        <div className="page-container"><span className="not-found-page__number">404</span><span className="eyebrow">A little off the map</span><h1>This space<br /><em>doesn’t exist.</em></h1><p>We couldn’t find the page you were looking for. It may have moved, or it may never have been here.</p><div className="not-found-page__actions"><ButtonLink to="/">Return home</ButtonLink><ArrowLink to="/properties">Explore properties</ArrowLink></div></div>
      </section>
    </>
  );
}
