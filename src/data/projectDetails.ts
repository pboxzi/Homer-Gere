import { SECTION_IMAGES } from './images';

export interface CastMember {
  name: string;
  role: string;
  profileUrl?: string;
  image?: string;
}

export interface CrewMember {
  name: string;
  role: string;
  profileUrl?: string;
}

export interface ProjectMedia {
  id: string;
  src: string;
  alt: string;
  type: 'still' | 'behind-the-scenes' | 'poster' | 'promotional';
}

export interface ProjectVideo {
  id: string;
  title: string;
  url: string;
  type: 'trailer' | 'teaser' | 'interview' | 'behind-the-scenes';
  thumbnail?: string;
}

export interface Recognition {
  id: string;
  award: string;
  category: string;
  result: 'Winner' | 'Nominated' | 'Selected';
  ceremony?: string;
  year?: string;
}

export interface ProjectDetail {
  slug: string;
  title: string;
  year: string;
  type: 'Film' | 'Television' | 'Short Film';
  status: 'Released' | 'Post-Production' | 'In Production' | 'Announced';
  tagline?: string;
  heroImage: string;
  posterImage?: string;

  // Overview
  synopsis: string;
  genre?: string;
  runtime?: string;
  language?: string;
  country?: string;
  productionCompany?: string;
  distributor?: string;
  releaseDate?: string;
  officialUrl?: string;
  trailerUrl?: string;

  // Homer's Role
  homerRole: {
    character: string;
    description: string;
    episodes?: string;
    notes?: string;
  };

  // Cast & Crew
  cast: CastMember[];
  crew: CrewMember[];

  // Media
  media: ProjectMedia[];

  // Videos
  videos: ProjectVideo[];

  // Recognition
  recognition: Recognition[];

  // Related
  relatedSlugs: string[];
}

export const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  'the-shards': {
    slug: 'the-shards',
    title: 'The Shards',
    year: '2026',
    type: 'Television',
    status: 'Released',
    tagline: 'Hot. Rich. Dangerous.',
    heroImage: SECTION_IMAGES.hero.projects,
    posterImage: SECTION_IMAGES.filmography.theShards,

    synopsis: 'Set in 1981 Los Angeles, The Shards follows a group of privileged high school seniors at the elite Buckley prep school as they navigate identity, obsession, and the dangers of adolescence. When a magnetic and mysterious transfer student named Robert Mallory arrives, his presence coincides with the emergence of a serial killer known as The Trawler, throwing the group\'s carefully curated world into chaos.',
    genre: 'Teen Drama / Horror / Thriller',
    runtime: '~55 min per episode',
    language: 'English',
    country: 'United States',
    productionCompany: '20th Television, Ryan Murphy Television, Color Force, Sodium Fox Productions',
    distributor: 'FX / Hulu / Disney+',
    releaseDate: 'August 5, 2026',
    officialUrl: 'https://www.fxnetworks.com/shows/the-shards',
    trailerUrl: 'https://www.youtube.com/watch?v=2uYeXRSm2Zo',

    homerRole: {
      character: 'Robert Mallory',
      description: 'Homer stars as Robert Mallory, the enigmatic and potentially nefarious newcomer to Buckley prep school. Described as "magnetic and mysterious," Robert is a transfer student whose arrival disrupts the social dynamics of the friend group and coincides with the emergence of a serial killer known as The Trawler.',
      episodes: 'Main role — all episodes',
      notes: 'This marks Homer\'s first major leading role. The character of Robert Mallory is central to the series\' mystery, with his true intentions remaining ambiguous throughout.',
    },

    cast: [
      { name: 'Homer Gere', role: 'Robert Mallory', image: SECTION_IMAGES.hero.projects },
      { name: 'Igby Rigney', role: 'Bret (fictionalized version of Bret Easton Ellis)', image: SECTION_IMAGES.filmography.theShards },
      { name: 'Kaia Gerber', role: 'Susan Reynolds', image: SECTION_IMAGES.gallery[3] },
      { name: 'Hayes Warner', role: 'Debbie Schaffer', image: SECTION_IMAGES.bts[2] },
      { name: 'Graham Campbell', role: 'Thom Wright', image: SECTION_IMAGES.bts[0] },
      { name: 'Wes Bentley', role: 'Supporting Role', image: SECTION_IMAGES.gallery[4] },
      { name: 'Evan Rachel Wood', role: 'Supporting Role', image: SECTION_IMAGES.bts[3] },
    ],

    crew: [
      { name: 'Ryan Murphy', role: 'Creator / Executive Producer / Director', profileUrl: 'https://en.wikipedia.org/wiki/Ryan_Murphy_(producer)' },
      { name: 'Bret Easton Ellis', role: 'Creator / Executive Producer / Writer', profileUrl: 'https://en.wikipedia.org/wiki/Bret_Easton_Ellis' },
      { name: 'Nina Jacobson', role: 'Executive Producer' },
      { name: 'Brad Simpson', role: 'Executive Producer' },
      { name: 'Michael Uppendahl', role: 'Executive Producer / Director' },
    ],

    media: [
      { id: 'shards-1', src: SECTION_IMAGES.hero.projects, alt: 'The Shards World Premiere at SVA Theatre', type: 'poster' },
      { id: 'shards-2', src: SECTION_IMAGES.filmography.theShards, alt: 'Homer Gere as Robert Mallory', type: 'still' },
      { id: 'shards-3', src: SECTION_IMAGES.bts[0], alt: 'The Shards cast at premiere after party', type: 'behind-the-scenes' },
      { id: 'shards-4', src: SECTION_IMAGES.bts[1], alt: 'On set during principal photography', type: 'behind-the-scenes' },
      { id: 'shards-5', src: SECTION_IMAGES.gallery[3], alt: 'The Shards launch party at Moonlight Rollerway', type: 'promotional' },
      { id: 'shards-6', src: SECTION_IMAGES.bts[2], alt: 'Homer Gere at The Shards event', type: 'behind-the-scenes' },
    ],

    videos: [
      { id: 'trailer-1', title: 'Official Trailer', url: 'https://www.youtube.com/watch?v=2uYeXRSm2Zo', type: 'trailer' },
      { id: 'interview-1', title: 'Homer Gere on Ditching Social Media & Famous Family', url: 'https://www.youtube.com/watch?v=sx6j4ZQWsK8', type: 'interview' },
    ],

    recognition: [
      { id: 'rec-1', award: 'Featured in', category: 'British Vogue — "Who Is Homer Gere"', result: 'Selected', year: '2026' },
      { id: 'rec-2', award: 'Featured in', category: 'BBC News — Euphoria cast announcement', result: 'Selected', year: '2025' },
    ],

    relatedSlugs: ['euphoria', 'white-lies'],
  },

  'euphoria': {
    slug: 'euphoria',
    title: 'Euphoria',
    year: '2026',
    type: 'Television',
    status: 'Released',
    tagline: 'Remember, this is just the beginning.',
    heroImage: SECTION_IMAGES.filmography.euphoria,
    posterImage: SECTION_IMAGES.filmography.euphoria,

    synopsis: 'Euphoria follows a group of high school students as they navigate love and friendships in a world of drugs, sex, trauma, and social media. Created by Sam Levinson, the series explores the human condition through the eyes of its characters as they grapple with contemporary issues facing today\'s youth.',
    genre: 'Teen Drama',
    runtime: '~55 min per episode',
    language: 'English',
    country: 'United States',
    productionCompany: 'A24, HBO Entertainment, The Reasonable Bunch, Little Lamb, DreamCrew',
    distributor: 'HBO / HBO Max',
    releaseDate: 'May 21, 2026 (Season 3)',
    officialUrl: 'https://www.hbo.com/euphoria',

    homerRole: {
      character: 'Dylan Reid',
      description: 'Homer portrays Dylan Reid, a rising young actor and Hollywood up-and-comer. Dylan becomes an unwitting pawn in Cassie Howard\'s (Sydney Sweeney) ongoing quest for superstardom, leading to a pivotal storyline in the season.',
      episodes: '4 episodes (Recurring Guest)',
      notes: 'This marked Homer\'s television debut. His casting was announced by BBC News in October 2025.',
    },

    cast: [
      { name: 'Homer Gere', role: 'Dylan Reid', image: SECTION_IMAGES.filmography.euphoria },
      { name: 'Zendaya', role: 'Rue Bennett', profileUrl: 'https://en.wikipedia.org/wiki/Zendaya' },
      { name: 'Sydney Sweeney', role: 'Cassie Howard', profileUrl: 'https://en.wikipedia.org/wiki/Sydney_Sweeney' },
      { name: 'Alexa Demie', role: 'Maddy Perez', profileUrl: 'https://en.wikipedia.org/wiki/Alexa_Demie' },
      { name: 'Hunter Schafer', role: 'Jules Vaughn', profileUrl: 'https://en.wikipedia.org/wiki/Hunter_Schafer' },
      { name: 'Jacob Elordi', role: 'Nate Jacobs', profileUrl: 'https://en.wikipedia.org/wiki/Jacob_Elordi' },
    ],

    crew: [
      { name: 'Sam Levinson', role: 'Creator / Showrunner / Director', profileUrl: 'https://en.wikipedia.org/wiki/Sam_Levinson' },
      { name: 'Zendaya', role: 'Executive Producer', profileUrl: 'https://en.wikipedia.org/wiki/Zendaya' },
      { name: 'Drake', role: 'Executive Producer' },
      { name: 'Ron Leshem', role: 'Executive Producer' },
    ],

    media: [
      { id: 'euphoria-1', src: SECTION_IMAGES.filmography.euphoria, alt: 'Homer Gere and Alexa Demie in Euphoria Season 3', type: 'still' },
      { id: 'euphoria-2', src: SECTION_IMAGES.bts[2], alt: 'Behind the scenes on the Euphoria set', type: 'behind-the-scenes' },
      { id: 'euphoria-3', src: SECTION_IMAGES.gallery[0], alt: 'Euphoria Season 3 premiere event', type: 'promotional' },
    ],

    videos: [
      { id: 'euphoria-trailer', title: 'Euphoria Season 3 Official Trailer', url: 'https://www.youtube.com/watch?v=sx6j4ZQWsK8', type: 'trailer' },
    ],

    recognition: [
      { id: 'euphoria-rec-1', award: 'Featured in', category: 'BBC News — New cast members announced', result: 'Selected', year: '2025' },
      { id: 'euphoria-rec-2', award: 'Featured in', category: 'Entertainment Weekly — Homer Gere debuts first leading role', result: 'Selected', year: '2026' },
    ],

    relatedSlugs: ['the-shards', 'white-lies'],
  },

  'white-lies': {
    slug: 'white-lies',
    title: 'White Lies',
    year: 'TBA',
    type: 'Film',
    status: 'Announced',
    heroImage: SECTION_IMAGES.gallery[4],
    posterImage: SECTION_IMAGES.gallery[4],

    synopsis: 'Details about the plot of White Lies have not yet been publicly disclosed. The film is an upcoming project directed by acclaimed filmmaker Oliver Stone.',
    genre: 'Drama / Thriller (Speculated)',
    language: 'English',
    country: 'United States',
    productionCompany: 'TBA',
    distributor: 'TBA',
    releaseDate: 'TBA',

    homerRole: {
      character: 'Role TBA',
      description: 'Homer has been cast in an unspecified role in Oliver Stone\'s upcoming film White Lies. Details about his character and the extent of his involvement have not yet been officially announced.',
      notes: 'Announced June 2026. The film also stars Michael Douglas, Willem Dafoe, and Ellen Barkin.',
    },

    cast: [
      { name: 'Homer Gere', role: 'TBA', image: SECTION_IMAGES.gallery[4] },
      { name: 'Michael Douglas', role: 'TBA', profileUrl: 'https://en.wikipedia.org/wiki/Michael_Douglas' },
      { name: 'Willem Dafoe', role: 'TBA', profileUrl: 'https://en.wikipedia.org/wiki/Willem_Dafoe' },
      { name: 'Ellen Barkin', role: 'TBA', profileUrl: 'https://en.wikipedia.org/wiki/Ellen_Barkin' },
    ],

    crew: [
      { name: 'Oliver Stone', role: 'Director / Writer', profileUrl: 'https://en.wikipedia.org/wiki/Oliver_Stone' },
    ],

    media: [
      { id: 'white-lies-1', src: SECTION_IMAGES.gallery[4], alt: 'Homer Gere at Cannes Film Festival', type: 'promotional' },
    ],

    videos: [],

    recognition: [],

    relatedSlugs: ['the-shards', 'euphoria'],
  },

  'american-pledge': {
    slug: 'american-pledge',
    title: 'American Pledge',
    year: '2024',
    type: 'Short Film',
    status: 'Released',
    heroImage: SECTION_IMAGES.filmography.shortFilms,
    posterImage: SECTION_IMAGES.filmography.shortFilms,

    synopsis: 'American Pledge is a short film featuring Homer Gere in the role of Jake. The project is listed on Homer Gere\'s IMDB filmography as part of his early screen work.',
    genre: 'Drama',
    language: 'English',
    country: 'United States',

    homerRole: {
      character: 'Jake',
      description: 'Homer plays Jake in this short film, part of his early acting credits that helped build foundational screen experience before his breakout television roles.',
    },

    cast: [
      { name: 'Homer Gere', role: 'Jake', image: SECTION_IMAGES.filmography.shortFilms },
    ],

    crew: [],

    media: [
      { id: 'pledge-1', src: SECTION_IMAGES.filmography.shortFilms, alt: 'American Pledge short film', type: 'still' },
    ],

    videos: [],

    recognition: [],

    relatedSlugs: ['euphoria', 'the-shards'],
  },
};

export const getProjectBySlug = (slug: string): ProjectDetail | undefined => {
  return PROJECT_DETAILS[slug];
};

export const getAllProjectSlugs = (): string[] => {
  return Object.keys(PROJECT_DETAILS);
};
