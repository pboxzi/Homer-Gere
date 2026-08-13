import { SECTION_IMAGES } from './images';

// ============================================================
// Gallery Types — CMS-ready data structures
// ============================================================

export type GalleryCategory =
  | 'All'
  | 'Portraits'
  | 'Behind The Scenes'
  | 'Productions'
  | 'Premieres'
  | 'Editorial'
  | 'Events'
  | 'Press';

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  caption: string;
  date: string;
  category: GalleryCategory;
  event?: string;
  photographer?: string;
  featured?: boolean;
  collectionId?: string;
  order: number;
}

export interface GalleryCollection {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  date: string;
  photoCount: number;
}

export interface FeaturedStory {
  photoId: string;
  headline: string;
  story: string;
  attribution?: string;
}

// ============================================================
// Categories
// ============================================================

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  'All',
  'Portraits',
  'Behind The Scenes',
  'Productions',
  'Premieres',
  'Editorial',
  'Events',
  'Press',
];

// ============================================================
// Photo Data — CMS-ready, sorted by order
// ============================================================

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  // Premieres
  {
    id: 'photo-1',
    src: SECTION_IMAGES.gallery[0],
    alt: 'Homer Gere at The Shards World Premiere at SVA Theatre',
    caption: 'The Shards World Premiere',
    date: 'July 27, 2026',
    category: 'Premieres',
    event: 'The Shards World Premiere — SVA Theatre, NYC',
    photographer: 'FX Networks',
    featured: true,
    collectionId: 'shards-premiere',
    order: 1,
  },
  {
    id: 'photo-2',
    src: SECTION_IMAGES.gallery[3],
    alt: 'Homer Gere at The Shards launch party at Moonlight Rollerway',
    caption: 'The Shards Launch Party',
    date: 'July 2026',
    category: 'Events',
    event: 'The Shards Launch Party — Moonlight Rollerway, Glendale',
    photographer: 'FX Networks',
    collectionId: 'shards-premiere',
    order: 2,
  },
  {
    id: 'photo-3',
    src: SECTION_IMAGES.bts[0],
    alt: 'Homer Gere with mother Carey Lowell at The Shards premiere',
    caption: 'Arriving with Carey Lowell',
    date: 'July 27, 2026',
    category: 'Premieres',
    event: 'The Shards World Premiere — SVA Theatre, NYC',
    photographer: 'Getty Images',
    order: 3,
  },
  // Behind The Scenes
  {
    id: 'photo-4',
    src: SECTION_IMAGES.gallery[1],
    alt: 'Homer Gere as Robert Mallory — The Shards character still',
    caption: 'Robert Mallory — Character Still',
    date: '2026',
    category: 'Behind The Scenes',
    event: 'The Shards — Principal Photography',
    photographer: 'FX Networks',
    featured: true,
    collectionId: 'shards-bts',
    order: 4,
  },
  {
    id: 'photo-5',
    src: SECTION_IMAGES.bts[1],
    alt: 'Behind the scenes during The Shards principal photography',
    caption: 'On Set — Principal Photography',
    date: '2026',
    category: 'Behind The Scenes',
    event: 'The Shards — Los Angeles',
    photographer: 'FX Networks',
    collectionId: 'shards-bts',
    order: 5,
  },
  {
    id: 'photo-6',
    src: SECTION_IMAGES.bts[2],
    alt: 'The Shards cast at Moonlight Rollerway launch event',
    caption: 'Cast at Launch Event',
    date: 'July 2026',
    category: 'Behind The Scenes',
    event: 'The Shards Launch Party',
    photographer: 'FX Networks',
    collectionId: 'shards-bts',
    order: 6,
  },
  // Productions
  {
    id: 'photo-7',
    src: SECTION_IMAGES.gallery[2],
    alt: 'Homer Gere in Euphoria Season 3 with Alexa Demie',
    caption: 'Euphoria Season 3 — Scene with Alexa Demie',
    date: 'May 2026',
    category: 'Productions',
    event: 'Euphoria Season 3 — HBO',
    photographer: 'HBO',
    featured: true,
    collectionId: 'euphoria-s3',
    order: 7,
  },
  // Editorial
  {
    id: 'photo-8',
    src: SECTION_IMAGES.hero.projects,
    alt: 'Homer Gere editorial portrait — The Shards press tour',
    caption: 'Editorial Portrait',
    date: 'July 2026',
    category: 'Editorial',
    event: 'The Shards Press Tour',
    photographer: 'Vogue',
    featured: true,
    order: 8,
  },
  {
    id: 'photo-9',
    src: SECTION_IMAGES.gallery[5],
    alt: 'Homer Gere at agency event at MoMA',
    caption: 'Agency Premiere — MoMA',
    date: '2025',
    category: 'Editorial',
    event: 'Agency Event — Museum of Modern Art',
    photographer: 'PMC',
    order: 9,
  },
  // Events
  {
    id: 'photo-10',
    src: SECTION_IMAGES.gallery[4],
    alt: 'Homer Gere at Cannes Film Festival',
    caption: 'Cannes Film Festival',
    date: 'May 2024',
    category: 'Events',
    event: 'Cannes Film Festival — Palais des Festivals',
    photographer: 'Getty Images',
    featured: true,
    order: 10,
  },
  {
    id: 'photo-11',
    src: SECTION_IMAGES.bts[3],
    alt: 'Homer Gere at Venice Film Festival',
    caption: 'Venice Film Festival',
    date: '2024',
    category: 'Events',
    event: 'Venice Film Festival',
    photographer: 'Getty Images',
    order: 11,
  },
  {
    id: 'photo-12',
    src: SECTION_IMAGES.gallery[3],
    alt: 'The Shards cast at Disney+ Upfront Presentation',
    caption: 'Disney+ Upfront',
    date: '2026',
    category: 'Events',
    event: 'Disney+ Upfront Presentation — NYC',
    photographer: 'Disney',
    order: 12,
  },
  // Press
  {
    id: 'photo-13',
    src: SECTION_IMAGES.bts[4],
    alt: 'Homer Gere — press portrait',
    caption: 'Press Portrait',
    date: '2026',
    category: 'Press',
    event: 'BBC News Interview',
    photographer: 'BBC',
    order: 13,
  },
  {
    id: 'photo-14',
    src: SECTION_IMAGES.bts[5],
    alt: 'Homer Gere — Vogue editorial shoot',
    caption: 'British Vogue Feature',
    date: '2026',
    category: 'Press',
    event: '"Who Is Homer Gere" — British Vogue',
    photographer: 'Vogue',
    featured: true,
    order: 14,
  },
  // Portraits
  {
    id: 'photo-15',
    src: SECTION_IMAGES.hero.journey,
    alt: 'Homer Gere — luxury editorial portrait',
    caption: 'Editorial Portrait — Luxury Series',
    date: '2026',
    category: 'Portraits',
    event: 'Editorial Shoot',
    photographer: 'Studio',
    featured: true,
    order: 15,
  },
  {
    id: 'photo-16',
    src: SECTION_IMAGES.hero.homepage,
    alt: 'Homer Gere — GQ lifestyle studio portrait',
    caption: 'GQ Lifestyle Portrait',
    date: '2026',
    category: 'Portraits',
    event: 'GQ Editorial',
    photographer: 'GQ',
    order: 16,
  },
];

// ============================================================
// Featured Collection
// ============================================================

export const FEATURED_COLLECTION: GalleryCollection = {
  id: 'shards-premiere',
  title: 'The Shards — World Premiere',
  description: 'From the red carpet at SVA Theatre to the official launch party at Moonlight Rollerway, explore the complete visual archive of Homer Gere\'s first lead role premiere.',
  coverImage: SECTION_IMAGES.gallery[0],
  date: 'July 2026',
  photoCount: GALLERY_PHOTOS.filter((p) => p.collectionId === 'shards-premiere').length,
};

// ============================================================
// Collections
// ============================================================

export const GALLERY_COLLECTIONS: GalleryCollection[] = [
  FEATURED_COLLECTION,
  {
    id: 'shards-bts',
    title: 'The Shards — Behind the Scenes',
    description: 'Exclusive behind-the-scenes photography from the set of FX\'s The Shards.',
    coverImage: SECTION_IMAGES.bts[1],
    date: '2026',
    photoCount: GALLERY_PHOTOS.filter((p) => p.collectionId === 'shards-bts').length,
  },
  {
    id: 'euphoria-s3',
    title: 'Euphoria Season 3',
    description: 'Official photography from HBO\'s Euphoria Season 3.',
    coverImage: SECTION_IMAGES.gallery[2],
    date: '2026',
    photoCount: GALLERY_PHOTOS.filter((p) => p.collectionId === 'euphoria-s3').length,
  },
];

// ============================================================
// Featured Story
// ============================================================

export const FEATURED_STORY: FeaturedStory = {
  photoId: 'photo-1',
  headline: 'The Night Everything Changed',
  story: `July 27, 2026 — SVA Theatre, New York City. Homer Gere stepped onto the red carpet for the world premiere of The Shards, his first leading role in a major television production. Alongside co-stars Kaia Gerber, Igby Rigney, and Graham Campbell, he faced the flashbulbs of hundreds of photographers — a moment that marked the official arrival of a new generation's most discussed actor.

"I think the most important thing my dad taught me," Homer told reporters that evening, "is not necessarily related to the craft, but more like how do you carry yourself, how do you make this work in a positive way."

The series, created by Ryan Murphy and Bret Easton Ellis, would premiere on FX and Hulu on August 5, 2026 — but this night belonged to the cast, the crew, and a young man stepping fully into the spotlight.`,
  attribution: 'Coverage via Vogue, People, and Deadline Hollywood',
};

// ============================================================
// Helper Functions — CMS-ready queries
// ============================================================

export const getPhotosByCategory = (category: GalleryCategory): GalleryPhoto[] => {
  if (category === 'All') return GALLERY_PHOTOS;
  return GALLERY_PHOTOS.filter((p) => p.category === category);
};

export const getFeaturedPhotos = (): GalleryPhoto[] => {
  return GALLERY_PHOTOS.filter((p) => p.featured);
};

export const getLatestPhotos = (count: number): GalleryPhoto[] => {
  return [...GALLERY_PHOTOS].sort((a, b) => a.order - b.order).slice(0, count);
};

export const getCollectionPhotos = (collectionId: string): GalleryPhoto[] => {
  return GALLERY_PHOTOS.filter((p) => p.collectionId === collectionId);
};
