import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, ArrowUpRight, Check, X } from 'lucide-react';
import { submitEnquiry } from '../lib/repository';
import { isLiveBackendConfigured } from '../lib/supabase';
import type { EnquiryPayload, Property } from '../types';

interface LeadFormProps {
  property?: Property;
  viewing?: boolean;
  compact?: boolean;
  initialInterest?: string;
}

export function LeadForm({ property, viewing = false, compact = false, initialInterest }: LeadFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [sentMode, setSentMode] = useState<'live' | 'preview' | null>(null);
  const [error, setError] = useState('');
  const [honeypot, setHoneypot] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (honeypot) {
      setSentMode('preview');
      return;
    }
    setError('');
    setSubmitting(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload: EnquiryPayload = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      phone: String(formData.get('phone') || ''),
      message: String(formData.get('message') || ''),
      property: property ? { id: property.id, slug: property.slug, title: property.title, location: property.location } : undefined,
      preferredDate: String(formData.get('preferredDate') || '') || undefined,
      preferredTime: String(formData.get('preferredTime') || '') || undefined,
      preferredContact: (String(formData.get('preferredContact') || 'WhatsApp')) as EnquiryPayload['preferredContact'],
      interest: String(formData.get('interest') || initialInterest || (viewing ? 'Viewing request' : 'General enquiry')),
      source: property ? `property:${property.slug}` : 'contact-page',
    };
    try {
      const result = await submitEnquiry(payload);
      setSentMode(result.mode);
      form.reset();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (sentMode) {
    return (
      <div className="form-success" role="status" aria-live="polite">
        <span className="form-success__mark"><Check size={22} strokeWidth={1.5} /></span>
        <span className="eyebrow">Enquiry received</span>
        <h3>Thank you.</h3>
        <p>{sentMode === 'live'
          ? 'An ENKOP representative will be in touch shortly.'
          : 'Your enquiry is saved in this browser preview. Connect Supabase to route it directly to the ENKOP team.'}</p>
        <button type="button" className="text-button" onClick={() => setSentMode(null)}>Send another enquiry <ArrowUpRight size={14} /></button>
      </div>
    );
  }

  return (
    <form className={`lead-form ${compact ? 'lead-form--compact' : ''}`} onSubmit={handleSubmit}>
      <div className="form-row">
        <label className="form-field"><span>Name <i>*</i></span><input name="name" autoComplete="name" required minLength={2} maxLength={120} placeholder="Your name" /></label>
        <label className="form-field"><span>Phone <i>*</i></span><input name="phone" type="tel" autoComplete="tel" inputMode="tel" pattern="\\+?[0-9][0-9\\s()-]{5,38}" required maxLength={40} placeholder="+254 …" /></label>
      </div>
      <div className="form-row">
        <label className="form-field"><span>Email <i>*</i></span><input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></label>
        {!property && <label className="form-field"><span>I'm interested in</span><select name="interest" defaultValue={initialInterest || ''}>
          <option value="">Select an interest</option>
          <option>Buying</option><option>Selling</option><option>Renting</option><option>Property management</option><option>Partnership</option><option>General enquiry</option>
        </select></label>}
      </div>
      {(property || viewing) && <div className="form-row">
        <label className="form-field"><span>Preferred date</span><input name="preferredDate" type="date" min={new Date().toISOString().slice(0, 10)} /></label>
        <label className="form-field"><span>Preferred time</span><select name="preferredTime" defaultValue=""><option value="">Flexible</option><option>Morning · 9am–12pm</option><option>Afternoon · 12pm–4pm</option><option>Evening · 4pm–6pm</option></select></label>
      </div>}
      <div className="form-row form-row--message">
        <label className="form-field"><span>Preferred contact</span><select name="preferredContact" defaultValue="WhatsApp"><option>WhatsApp</option><option>Phone</option><option>Email</option></select></label>
        <label className="form-field form-field--message"><span>Message <i>*</i></span><textarea name="message" required minLength={3} maxLength={3000} rows={3} placeholder={property ? `I'd like to know more about ${property.title}…` : 'Tell us a little about what you have in mind…'} /></label>
      </div>
      <label className="honeypot" aria-hidden="true">Leave this field empty<input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      {!isLiveBackendConfigured && <p className="form-preview-note" role="note">Preview mode · this enquiry is saved only in this browser.</p>}
      <div className="form-submit-row">
        <button className="button button--dark" type="submit" disabled={submitting}>{submitting ? 'Sending…' : viewing ? 'Request a viewing' : 'Send your enquiry'}<ArrowUpRight size={16} /></button>
        <span className="form-privacy">Your details are treated with care.</span>
      </div>
    </form>
  );
}

export function EnquiryModal({ open, onClose, property, viewing = false }: { open: boolean; onClose: () => void; property?: Property; viewing?: boolean }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { onClose(); return; }
      if (event.key !== 'Tab') return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previous;
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialogRef} className="enquiry-modal" role="dialog" aria-modal="true" aria-labelledby="enquiry-modal-title">
        <button ref={closeRef} className="modal-close" type="button" onClick={onClose} aria-label="Close enquiry form"><X size={19} strokeWidth={1.4} /></button>
        <div className="enquiry-modal__intro">
          <span className="eyebrow">A good place to begin</span>
          <h2 id="enquiry-modal-title">{viewing ? 'Arrange a viewing.' : 'Let’s talk.'}</h2>
          <p>{property ? `${property.title} · ${property.location}` : 'Tell us what you are looking for, and we will take it from there.'}</p>
        </div>
        <LeadForm property={property} viewing={viewing} />
      </section>
    </div>
  );
}

export function GalleryModal({ images, initialIndex, onClose }: { images: Property['images']; initialIndex: number | null; onClose: () => void }) {
  const [activeIndex, setActiveIndex] = useState(initialIndex ?? 0);
  const touchStartX = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (initialIndex !== null) setActiveIndex(initialIndex); }, [initialIndex]);
  useEffect(() => {
    if (initialIndex === null) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { onClose(); return; }
      if (event.key === 'ArrowRight') setActiveIndex((index) => (index + 1) % images.length);
      if (event.key === 'ArrowLeft') setActiveIndex((index) => (index - 1 + images.length) % images.length);
      if (event.key === 'Tab') {
        const focusable = modalRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previous;
      previouslyFocused?.focus();
    };
  }, [initialIndex, images.length, onClose]);
  if (initialIndex === null || images.length === 0) return null;
  const previous = () => setActiveIndex((index) => (index - 1 + images.length) % images.length);
  const next = () => setActiveIndex((index) => (index + 1) % images.length);
  return (
    <div ref={modalRef} className="gallery-modal" role="dialog" aria-modal="true" aria-label="Property image gallery" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="gallery-modal__top"><span className="eyebrow">Property gallery</span><span className="gallery-modal__count">{String(activeIndex + 1).padStart(2, '0')} <i>/</i> {String(images.length).padStart(2, '0')}</span><button ref={closeRef} type="button" className="modal-close modal-close--light" onClick={onClose} aria-label="Close gallery"><X size={20} /></button></div>
      <div className="gallery-modal__stage" onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={(event) => {
        if (touchStartX.current === null) return;
        const delta = event.changedTouches[0]?.clientX - touchStartX.current;
        if (delta > 45) previous(); else if (delta < -45) next();
        touchStartX.current = null;
      }}>
        <button className="gallery-modal__nav gallery-modal__nav--prev" type="button" onClick={previous} aria-label="Previous image"><ArrowRight size={20} /></button>
        <img key={activeIndex} src={images[activeIndex]?.src} alt={images[activeIndex]?.alt} />
        <button className="gallery-modal__nav gallery-modal__nav--next" type="button" onClick={next} aria-label="Next image"><ArrowRight size={20} /></button>
        <p className="gallery-modal__caption">{images[activeIndex]?.alt}</p>
      </div>
      <div className="gallery-modal__thumbs" aria-label="Choose gallery image">
        {images.map((image, index) => <button key={`${image.src}-${index}`} type="button" className={index === activeIndex ? 'is-active' : ''} onClick={() => setActiveIndex(index)} aria-label={`Show image ${index + 1}`} aria-current={index === activeIndex}>
          <img src={image.src} alt="" />
        </button>)}
      </div>
    </div>
  );
}
