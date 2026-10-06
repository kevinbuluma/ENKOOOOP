export type ListingStatus = 'For Sale' | 'For Rent' | 'Sold' | 'Let' | 'Coming Soon';
export type PropertyType = 'Apartment' | 'Villa' | 'Penthouse' | 'Townhouse' | 'Land';
export type ListingType = 'sale' | 'rent';

export interface PropertyImage {
  src: string;
  alt: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  location: string;
  neighborhood: string;
  city: string;
  propertyType: PropertyType;
  listingType: ListingType;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  parking: number;
  status: ListingStatus;
  featured: boolean;
  images: PropertyImage[];
  amenities: string[];
  heroImage?: string;
  propertyVideo?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  xUrl?: string;
  virtualTourUrl?: string;
  externalListingUrl?: string;
  googleMapsUrl?: string;
  whatsappNumber?: string;
  contactPhone?: string;
  latitude?: number;
  longitude?: number;
  agent?: string;
  createdAt?: string;
  updatedAt?: string;
  isSample?: boolean;
}

export interface EnquiryPayload {
  name: string;
  email: string;
  phone: string;
  message: string;
  property?: Pick<Property, 'id' | 'slug' | 'title' | 'location'>;
  preferredDate?: string;
  preferredTime?: string;
  preferredContact?: 'Phone' | 'Email' | 'WhatsApp';
  interest?: string;
  source?: string;
}

export interface InsightArticle {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  alt: string;
  body: string[];
}
