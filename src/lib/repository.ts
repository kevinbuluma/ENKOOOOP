import { sampleProperties } from '../data/properties';
import type { EnquiryPayload, Property, PropertyImage } from '../types';
import { supabase } from './supabase';

const LOCAL_ENQUIRY_KEY = 'enkop.preview.enquiries.v1';
const LOCAL_RATE_KEY = 'enkop.preview.enquiry-rate.v1';
function readLocalArray<T>(key: string): T[] {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value as T[] : [];
  } catch { return []; }
}
let propertyCache: Property[] | null = null;
let propertyRequest: Promise<Property[]> | null = null;

function mapProperty(row: Record<string, any>): Property {
  const images: PropertyImage[] = (row.property_images ?? [])
    .sort((a: Record<string, any>, b: Record<string, any>) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((image: Record<string, any>) => ({ src: image.image_url, alt: image.alt_text || row.title }));
  const amenities = (row.property_amenities ?? [])
    .map((item: Record<string, any>) => item.amenities?.name)
    .filter((name: string | undefined): name is string => Boolean(name));

  const neighborhood = row.locations?.name || row.neighborhood || '';
  const city = row.locations?.city || row.city || 'Nairobi';
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? '',
    location: neighborhood ? `${neighborhood}, ${city}` : city,
    neighborhood,
    city,
    propertyType: row.property_type,
    listingType: row.listing_type,
    price: Number(row.price ?? 0),
    currency: row.currency || 'KES',
    bedrooms: Number(row.bedrooms ?? 0),
    bathrooms: Number(row.bathrooms ?? 0),
    area: Number(row.area ?? 0),
    parking: Number(row.parking ?? 0),
    status: row.status,
    featured: Boolean(row.featured),
    images,
    amenities,
    heroImage: row.hero_image_url || undefined,
    propertyVideo: row.property_video_url || undefined,
    instagramUrl: row.instagram_url || undefined,
    facebookUrl: row.facebook_url || undefined,
    tiktokUrl: row.tiktok_url || undefined,
    youtubeUrl: row.youtube_url || undefined,
    xUrl: row.x_url || undefined,
    virtualTourUrl: row.virtual_tour_url || undefined,
    externalListingUrl: row.external_listing_url || undefined,
    googleMapsUrl: row.google_maps_url || undefined,
    whatsappNumber: row.whatsapp_number || undefined,
    contactPhone: row.contact_phone || undefined,
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,
    agent: row.agent_name || undefined,
    createdAt: row.created_at || undefined,
    updatedAt: row.updated_at || undefined,
    isSample: false,
  };
}

export async function listProperties(forceRefresh = false): Promise<Property[]> {
  if (!supabase) return sampleProperties;
  if (propertyCache && !forceRefresh) return propertyCache;
  if (propertyRequest && !forceRefresh) return propertyRequest;

  propertyRequest = (async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('*, locations(name, city), property_images(*), property_amenities(amenities(name))')
      .eq('is_published', true)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('ENKOP property data could not be loaded:', error.message);
      return [];
    }
    propertyCache = (data ?? []).map((row) => mapProperty(row as Record<string, any>));
    return propertyCache;
  })();

  try {
    return await propertyRequest;
  } catch (requestError) {
    console.error('ENKOP property data request failed:', requestError);
    return [];
  } finally {
    propertyRequest = null;
  }
}

export async function submitEnquiry(payload: EnquiryPayload): Promise<{ mode: 'live' | 'preview' }> {
  const clean = {
    name: payload.name.trim().slice(0, 120),
    email: payload.email.trim().toLowerCase().slice(0, 254),
    phone: payload.phone.trim().slice(0, 40),
    message: payload.message.trim().slice(0, 3000),
    preferred_date: payload.preferredDate || null,
    preferred_time: payload.preferredTime || null,
    preferred_contact: payload.preferredContact || 'WhatsApp',
    interest: payload.interest || 'Property enquiry',
    source: (payload.source || 'website').slice(0, 100),
    property_id: payload.property && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(payload.property.id) ? payload.property.id : null,
    property_slug: payload.property?.slug || null,
    property_title: payload.property?.title || null,
    property_location: payload.property?.location || null,
    status: 'new',
  };

  if (!clean.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email) || !clean.phone || !clean.message) {
    throw new Error('Please check the required fields and try again.');
  }

  if (supabase) {
    const { error } = await supabase.from('enquiries').insert(clean);
    if (error) {
      console.error('ENKOP enquiry could not be submitted:', error.message);
      throw new Error('We could not send your enquiry just now. Please try again or contact us via WhatsApp.');
    }
    return { mode: 'live' };
  }

  if (typeof window !== 'undefined') {
    const now = Date.now();
    const recent = readLocalArray<number>(LOCAL_RATE_KEY);
    const allowed = recent.filter((time) => now - time < 10 * 60 * 1000);
    if (allowed.length >= 4) throw new Error('Please wait a few minutes before sending another enquiry.');
    allowed.push(now);
    window.localStorage.setItem(LOCAL_RATE_KEY, JSON.stringify(allowed));

    const previous = readLocalArray<Record<string, unknown>>(LOCAL_ENQUIRY_KEY);
    const record = { ...clean, id: crypto.randomUUID?.() || `${now}`, created_at: new Date(now).toISOString() };
    window.localStorage.setItem(LOCAL_ENQUIRY_KEY, JSON.stringify([...previous.slice(-99), record]));
  }
  return { mode: 'preview' };
}
