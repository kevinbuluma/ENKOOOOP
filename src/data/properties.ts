import type { Property } from '../types';

// Illustrative preview content only. Replace these entries with verified ENKOP listings before launch.
export const sampleProperties: Property[] = [
  {
    id: 'oak-residence',
    slug: 'the-oak-residence',
    title: 'The Oak Residence',
    description: 'A considered city address, shaped around light, quiet and the rhythms of contemporary Nairobi living.',
    location: 'Kilimani, Nairobi',
    neighborhood: 'Kilimani',
    city: 'Nairobi',
    propertyType: 'Apartment',
    listingType: 'sale',
    price: 18500000,
    currency: 'KES',
    bedrooms: 3,
    bathrooms: 3,
    area: 180,
    parking: 2,
    status: 'For Sale',
    featured: true,
    images: [
      { src: '/images/oak-residence-exterior.jpg', alt: 'Contemporary stone and bronze apartment residence in Kilimani' },
      { src: '/images/interior-living-room.jpg', alt: 'Warm, light-filled residence opening to a green garden' },
      { src: '/images/nairobi-city.jpg', alt: 'Nairobi treetops and skyline at first light' },
    ],
    amenities: ['Private balcony', 'Residents’ lounge', 'Lift access', 'Backup power', 'Secure parking', 'Landscaped gardens'],
    latitude: -1.2921,
    longitude: 36.7832,
    agent: 'ENKOP Property Team',
    isSample: true,
  },
  {
    id: 'karibu-house',
    slug: 'karibu-house',
    title: 'Karibu House',
    description: 'A garden residence in Karen where honest materials, generous proportions and the outdoors meet.',
    location: 'Karen, Nairobi',
    neighborhood: 'Karen',
    city: 'Nairobi',
    propertyType: 'Villa',
    listingType: 'sale',
    price: 65000000,
    currency: 'KES',
    bedrooms: 4,
    bathrooms: 4,
    area: 420,
    parking: 3,
    status: 'For Sale',
    featured: true,
    images: [
      { src: '/images/hero-karen-residence.jpg', alt: 'Contemporary stone and timber residence in Karen at blue hour' },
      { src: '/images/karen-villa-day.jpg', alt: 'Quiet contemporary villa set within a mature Karen garden' },
      { src: '/images/interior-living-room.jpg', alt: 'Open-plan living room with garden outlook' },
    ],
    amenities: ['Private garden', 'Swimming pool', 'Staff quarters', 'Fireplace', 'Solar water heating', 'Gated community'],
    latitude: -1.3196,
    longitude: 36.7073,
    agent: 'ENKOP Property Team',
    isSample: true,
  },
  {
    id: 'solstice-penthouse',
    slug: 'solstice-penthouse',
    title: 'Solstice Penthouse',
    description: 'Elevated city living with open skies, long views and an unhurried connection to the city below.',
    location: 'Westlands, Nairobi',
    neighborhood: 'Westlands',
    city: 'Nairobi',
    propertyType: 'Penthouse',
    listingType: 'rent',
    price: 260000,
    currency: 'KES',
    bedrooms: 2,
    bathrooms: 2,
    area: 155,
    parking: 2,
    status: 'For Rent',
    featured: true,
    images: [
      { src: '/images/westlands-penthouse.jpg', alt: 'Penthouse terrace overlooking Westlands at dusk' },
      { src: '/images/interior-living-room.jpg', alt: 'Contemporary open-plan living space with natural materials' },
      { src: '/images/nairobi-city.jpg', alt: 'Nairobi skyline appearing through early morning haze' },
    ],
    amenities: ['Private terrace', 'Rooftop pool', 'Concierge', 'Gym', 'Backup power', 'Two parking bays'],
    latitude: -1.2676,
    longitude: 36.8088,
    agent: 'ENKOP Property Team',
    isSample: true,
  },
  {
    id: 'riverside-residence',
    slug: 'riverside-residence',
    title: 'Riverside Residence',
    description: 'A softly modern home with a calm material palette, tucked into one of Nairobi’s leafy addresses.',
    location: 'Riverside, Nairobi',
    neighborhood: 'Riverside',
    city: 'Nairobi',
    propertyType: 'Apartment',
    listingType: 'rent',
    price: 230000,
    currency: 'KES',
    bedrooms: 2,
    bathrooms: 2,
    area: 138,
    parking: 2,
    status: 'For Rent',
    featured: false,
    images: [
      { src: '/images/interior-living-room.jpg', alt: 'Quiet contemporary living room in a leafy Nairobi residence' },
      { src: '/images/oak-residence-exterior.jpg', alt: 'Stone-clad contemporary apartment building framed by trees' },
      { src: '/images/nairobi-city.jpg', alt: 'Nairobi skyline above a green canopy' },
    ],
    amenities: ['Balcony', 'Gym', 'Lift access', 'Backup power', 'Water storage', 'Secure parking'],
    latitude: -1.2674,
    longitude: 36.7991,
    agent: 'ENKOP Property Team',
    isSample: true,
  },
  {
    id: 'canopy-house',
    slug: 'the-canopy-house',
    title: 'The Canopy House',
    description: 'A residence framed by mature trees, with the ease of a private home and the rhythm of the city nearby.',
    location: 'Kileleshwa, Nairobi',
    neighborhood: 'Kileleshwa',
    city: 'Nairobi',
    propertyType: 'Townhouse',
    listingType: 'sale',
    price: 42000000,
    currency: 'KES',
    bedrooms: 3,
    bathrooms: 3,
    area: 260,
    parking: 2,
    status: 'Sold',
    featured: false,
    images: [
      { src: '/images/karen-villa-day.jpg', alt: 'Contemporary residence set into a mature green landscape' },
      { src: '/images/interior-living-room.jpg', alt: 'Light-filled lounge with warm timber and stone finishes' },
    ],
    amenities: ['Private garden', 'Study', 'Staff quarters', 'Fireplace', 'Secure parking'],
    latitude: -1.2787,
    longitude: 36.7862,
    agent: 'ENKOP Property Team',
    isSample: true,
  },
  {
    id: 'ridgeway-garden-home',
    slug: 'ridgeway-garden-home',
    title: 'Ridgeway Garden Home',
    description: 'A rare, garden-led home with room to gather, settle in and look ahead.',
    location: 'Runda, Nairobi',
    neighborhood: 'Runda',
    city: 'Nairobi',
    propertyType: 'Villa',
    listingType: 'sale',
    price: 88000000,
    currency: 'KES',
    bedrooms: 5,
    bathrooms: 5,
    area: 510,
    parking: 4,
    status: 'Coming Soon',
    featured: false,
    images: [
      { src: '/images/hero-karen-residence.jpg', alt: 'Evening light across a modern garden residence' },
      { src: '/images/karen-villa-day.jpg', alt: 'A contemporary stone villa in a mature landscape' },
      { src: '/images/interior-living-room.jpg', alt: 'Calm, open living space with natural textures' },
    ],
    amenities: ['Landscaped garden', 'Swimming pool', 'Staff quarters', 'Solar power', 'Gated community'],
    latitude: -1.2138,
    longitude: 36.8081,
    agent: 'ENKOP Property Team',
    isSample: true,
  },
];

export const propertyLocations = ['Kilimani', 'Westlands', 'Karen', 'Lavington', 'Runda', 'Kileleshwa', 'Riverside', 'Parklands', 'Gigiri'];

export function getPropertyGalleryImages(property: Property) {
  const images = property.images || [];
  if (!property.heroImage || images.some((image) => image.src === property.heroImage)) return images;
  return [{ src: property.heroImage, alt: `${property.title} · property cover` }, ...images];
}

export function formatPrice(property: Property): string {
  const amount = property.price;
  const compact = amount >= 1_000_000
    ? `${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1)}M`
    : amount >= 1_000
      ? `${Math.round(amount / 1_000)}K`
      : new Intl.NumberFormat('en-KE').format(amount);
  return property.listingType === 'rent'
    ? `${property.currency} ${compact} / month`
    : `${property.currency} ${compact}`;
}

export function formatFullPrice(property: Property): string {
  const full = new Intl.NumberFormat('en-KE').format(property.price);
  return property.listingType === 'rent'
    ? `${property.currency} ${full} per month`
    : `${property.currency} ${full}`;
}
