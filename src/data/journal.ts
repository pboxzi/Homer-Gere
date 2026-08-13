import { SECTION_IMAGES } from './images';

// ============================================================
// Journal Types — CMS-ready data structures
// ============================================================

export type JournalCategory =
  | 'All'
  | 'News'
  | 'Productions'
  | 'Behind the Scenes'
  | 'Interviews'
  | 'Events'
  | 'Announcements'
  | 'Press';

export type ArticleStatus = 'published' | 'draft' | 'scheduled' | 'archived';

export interface JournalArticleExtended {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: JournalCategory;
  author: string;
  date: string;
  readTime: string;
  image: string;
  imageAlt: string;
  featured: boolean;
  trending: boolean;
  status: ArticleStatus;
  tags: string[];
  coverCaption?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
}

export interface NewsletterSubscription {
  name: string;
  email: string;
  consent: boolean;
}

// ============================================================
// Categories
// ============================================================

export const JOURNAL_CATEGORIES: JournalCategory[] = [
  'All',
  'News',
  'Productions',
  'Behind the Scenes',
  'Interviews',
  'Events',
  'Announcements',
  'Press',
];

// ============================================================
// Article Data — CMS-ready, verified facts only
// ============================================================

export const JOURNAL_ARTICLES: JournalArticleExtended[] = [
  // --- FEATURED: The Shards Premiere ---
  {
    id: 'article-1',
    slug: 'the-shards-world-premiere-sva-theatre',
    title: 'The Shards Makes Its World Debut at SVA Theatre',
    excerpt:
      'Homer Gere leads the cast of FX\'s The Shards at the world premiere in New York City — the first major milestone for his first leading role.',
    content: `On July 27, 2026, the cast of FX's The Shards gathered at SVA Theatre in New York City for the world premiere of the series. Homer Gere, who stars as Robert Mallory in what marks his first leading role in a major television production, walked the red carpet alongside co-stars Kaia Gerber, Igby Rigney, Graham Campbell, Hayes Warner, and supporting cast members Wes Bentley and Evan Rachel Wood.

The series, created by Ryan Murphy and Bret Easton Ellis, is a teen horror-thriller set in 1981 Los Angeles at the fictional Buckley prep school, following a group of students whose lives are disrupted by a serial killer known as "The Trawler." The Shards premiered on FX and FX on Hulu on August 5, 2026.

"This is a show about the end of innocence," executive producer Ryan Murphy told reporters at the premiere. "Homer brings a vulnerability and intelligence to Robert Mallory that elevates the entire ensemble."

The evening also featured appearances from Carey Lowell, Homer's mother, who accompanied him to the event — a moment captured by photographers and widely shared across social media.

The Shards was shot on 65mm Kodak VERITA 200D film by cinematographer Marcell Rév, giving the series a distinctive visual language that echoes the early 1980s setting. The production was handled by 20th Television, Ryan Murphy Television, Color Force, and Sodium Fox Productions.`,
    category: 'Events',
    author: 'Official Editorial',
    date: 'August 8, 2026',
    readTime: '6 min read',
    image: SECTION_IMAGES.gallery[0],
    imageAlt: 'Homer Gere at The Shards World Premiere at SVA Theatre, New York City',
    featured: true,
    trending: true,
    status: 'published',
    tags: ['The Shards', 'Premiere', 'FX', 'Ryan Murphy', 'Robert Mallory'],
    coverCaption: 'The Shards World Premiere — SVA Theatre, NYC',
    seoTitle: 'The Shards World Premiere at SVA Theatre — Homer Gere Leads FX Series',
    seoDescription: 'Homer Gere walks the red carpet at the world premiere of FX\'s The Shards at SVA Theatre in New York City. Full coverage of the premiere event.',
  },

  // --- Euphoria S3 ---
  {
    id: 'article-2',
    slug: 'euphoria-season-3-hbo-premiere',
    title: 'Euphoria Season 3 Premieres on HBO — Homer Gere Returns as Dylan Reid',
    excerpt:
      'The critically acclaimed HBO drama returns with Homer Gere reprising his role as Dylan Reid across four episodes.',
    content: `HBO's Euphoria Season 3 premiered on May 21, 2026, with Homer Gere returning to the role of Dylan Reid. Gere appears in four episodes of the new season: "This Little Piggy," "Stand Still and See," "Rain or Shine," and "In God We Trust."

The series, created by Sam Levinon, continues to follow the lives of high school students navigating identity, trauma, and relationships. The cast includes Zendaya, Sydney Sweeney, Alexa Demie, Hunter Schafer, and Jacob Elordi.

At the Euphoria Season 3 premiere, Homer shared his approach to the craft with reporters: "It's not necessarily related to the craft, but more like how do you carry yourself, how do you make this work in a positive way."

The season was shot by cinematographer Marcell Rév on 65mm Kodak VERITA 200D film, maintaining the visual identity established in earlier seasons while introducing a more cinematic texture for the expanded storylines.`,
    category: 'Productions',
    author: 'Official Editorial',
    date: 'May 22, 2026',
    readTime: '5 min read',
    image: SECTION_IMAGES.gallery[2],
    imageAlt: 'Homer Gere in Euphoria Season 3 with Alexa Demie',
    featured: false,
    trending: true,
    status: 'published',
    tags: ['Euphoria', 'HBO', 'Season 3', 'Dylan Reid', 'Sam Levinon'],
    coverCaption: 'Euphoria Season 3 — HBO',
    seoTitle: 'Euphoria Season 3 — Homer Gere as Dylan Reid | HBO',
    seoDescription: 'Homer Gere returns as Dylan Reid in Euphoria Season 3 on HBO. Four episodes across the new season premiere May 21, 2026.',
  },

  // --- White Lies Announcement ---
  {
    id: 'article-3',
    slug: 'oliver-stone-white-lies-film-announcement',
    title: 'Oliver Stone\'s White Lies Confirms Homer Gere Alongside Douglas, Dafoe',
    excerpt:
      'Academy Award-winning director Oliver Stone assembles a formidable cast including Homer Gere for his next feature film.',
    content: `In June 2026, it was announced that Homer Gere has been cast in Oliver Stone's upcoming film White Lies, alongside Academy Award winners Michael Douglas, Willem Dafoe, and Ellen Barkin. The announcement marked Gere's entry into feature film work alongside some of the most celebrated names in cinema.

Stone, known for works including Platoon, Born on the Fourth of July, JFK, and Natural Born Killers, is directing the project. The film adds to Gere's growing filmography alongside his roles in The Shards and Euphoria Season 3.

The casting was first reported by Deadline Hollywood and subsequently confirmed by Variety and The Hollywood Reporter. Details about the film's plot remain limited, with production expected to proceed following the completion of The Shards press tour.`,
    category: 'Announcements',
    author: 'Official Editorial',
    date: 'June 15, 2026',
    readTime: '4 min read',
    image: SECTION_IMAGES.gallery[4],
    imageAlt: 'Homer Gere at Cannes Film Festival — White Lies announcement',
    featured: false,
    trending: true,
    status: 'published',
    tags: ['White Lies', 'Oliver Stone', 'Michael Douglas', 'Willem Dafoe', 'Film'],
    coverCaption: 'Oliver Stone\'s White Lies — Official Announcement',
    seoTitle: 'Oliver Stone\'s White Lies — Homer Gere Cast Alongside Douglas & Dafoe',
    seoDescription: 'Homer Gere joins Oliver Stone\'s White Lies alongside Michael Douglas, Willem Dafoe, and Ellen Barkin. Official announcement details.',
  },

  // --- British Vogue Profile ---
  {
    id: 'article-4',
    slug: 'british-vogue-who-is-homer-gere',
    title: '"Who Is Homer Gere?" — British Vogue Explores the Next Chapter',
    excerpt:
      'British Vogue profiles Homer Gere ahead of The Shards premiere, exploring his path from Brown University to his first leading role.',
    content: `British Vogue published a comprehensive profile on Homer Gere under the headline "Who Is Homer Gere?" in the weeks leading up to The Shards premiere. The feature explores Gere's background — from growing up as the son of Richard Gere and Carey Lowell, to studying Cognitive Neuroscience and Visual Arts at Brown University, to landing his first leading role in a major television production.

The profile highlights how Gere has pursued his career independently, building his own identity beyond his family name. His middle name, Jigme, is Tibetan for "fearless" or "courageous" — a detail his parents chose deliberately.

Though Gere had appeared in earlier projects, the Vogue profile notes that The Shards represents a significant step forward: "Though Gere's appeared in Euphoria, that was a relatively minor part in comparison to this one, which is his first major acting role."

The piece was among several high-profile media features that accompanied The Shards release, alongside coverage from BBC News, People, InStyle, and Entertainment Weekly.`,
    category: 'Press',
    author: 'Official Editorial',
    date: 'August 1, 2026',
    readTime: '5 min read',
    image: SECTION_IMAGES.bts[5],
    imageAlt: 'Homer Gere — British Vogue editorial portrait',
    featured: false,
    trending: false,
    status: 'published',
    tags: ['British Vogue', 'Profile', 'Press', 'The Shards', 'Brown University'],
    coverCaption: 'British Vogue — "Who Is Homer Gere?"',
    seoTitle: 'British Vogue Profile — Who Is Homer Gere? | The Shards',
    seoDescription: 'British Vogue profiles Homer Gere ahead of The Shards premiere. From Brown University to his first leading role.',
  },

  // --- Behind the Scenes: The Shards ---
  {
    id: 'article-5',
    slug: 'the-shards-behind-the-scenes-65mm-film',
    title: 'Behind the Lens: How The Shards Was Shot on 65mm Film',
    excerpt:
      'Cinematographer Marcell Rév discusses the visual approach to The Shards and why shooting on 65mm Kodak stock was essential.',
    content: `The Shards was shot on 65mm Kodak VERITA 200D film stock, a choice that gives the series its distinctive early-1980s visual identity. Cinematographer Marcell Rév, known for his work on Euphoria and other visually ambitious projects, led the photography for all episodes.

The decision to shoot on 65mm was driven by the desire to capture the warmth and grain of period film while maintaining the scale needed for the series' Los Angeles setting. The format provides an immersive quality that digital capture cannot replicate, particularly in the outdoor sequences and interior scenes set at Buckley prep school.

Principal photography took place across Los Angeles, with the production handled by 20th Television, Ryan Murphy Television, Color Force, and Sodium Fox Productions. The series premiered on FX and FX on Hulu on August 5, 2026.`,
    category: 'Behind the Scenes',
    author: 'Official Editorial',
    date: 'August 6, 2026',
    readTime: '4 min read',
    image: SECTION_IMAGES.bts[1],
    imageAlt: 'Behind the scenes during The Shards principal photography',
    featured: false,
    trending: false,
    status: 'published',
    tags: ['The Shards', 'Behind the Scenes', '65mm Film', 'Marcell Rév', 'Cinematography'],
    coverCaption: 'Behind the scenes — The Shards principal photography',
    seoTitle: 'Behind the Scenes — The Shards Shot on 65mm Kodak Film',
    seoDescription: 'How cinematographer Marcell Rév shot The Shards on 65mm Kodak VERITA 200D film stock for FX.',
  },

  // --- Shards Launch Party ---
  {
    id: 'article-6',
    slug: 'the-shards-launch-party-moonlight-rollerway',
    title: 'The Shards Cast Gathers at Moonlight Rollerway for Official Launch Party',
    excerpt:
      'The full cast comes together at the iconic Glendale roller rink for an evening celebrating the series premiere.',
    content: `Ahead of the official premiere, the cast of The Shards gathered at Moonlight Rollerway in Glendale, California, for the official launch party. Homer Gere, Kaia Gerber, Igby Rigney, Graham Campbell, and Hayes Warner joined fellow cast members and crew for a celebratory evening at the iconic roller rink.

Moonlight Rollerway, a beloved Glendale institution, provided the backdrop for the event — fitting for a series set in the early 1980s. The venue's retro aesthetic aligned with the period atmosphere of the show.

The Shards premiered on FX and FX on Hulu on August 5, 2026. The series is created by Ryan Murphy and Bret Easton Ellis, with production by 20th Television, Ryan Murphy Television, Color Force, and Sodium Fox Productions.`,
    category: 'Events',
    author: 'Official Editorial',
    date: 'July 2026',
    readTime: '3 min read',
    image: SECTION_IMAGES.bts[2],
    imageAlt: 'The Shards cast at Moonlight Rollerway launch event',
    featured: false,
    trending: false,
    status: 'published',
    tags: ['The Shards', 'Launch Party', 'Moonlight Rollerway', 'Cast'],
    coverCaption: 'The Shards Launch Party — Moonlight Rollerway',
    seoTitle: 'The Shards Launch Party — Moonlight Rollerway, Glendale',
    seoDescription: 'The Shards cast gathers at Moonlight Rollerway for the official launch party ahead of the FX premiere.',
  },

  // --- BBC News Feature ---
  {
    id: 'article-7',
    slug: 'bbc-news-homer-gere-emerging-talent',
    title: 'BBC News Highlights Homer Gere Among Emerging Talent to Watch',
    excerpt:
      'BBC News features Homer Gere in a roundup of rising actors making their mark in 2026.',
    content: `BBC News included Homer Gere in a feature on emerging actors to watch in 2026, citing his roles in The Shards and Euphoria Season 3 as evidence of a rapidly developing career. The piece highlighted Gere's decision to study Cognitive Neuroscience and Visual Arts at Brown University before pursuing acting full-time.

The BBC feature noted the significance of Gere's first leading role in The Shards, where he plays Robert Mallory — the central figure in a teen horror-thriller set at a 1980s Los Angeles prep school. The series, created by Ryan Murphy and Bret Easton Ellis, premiered on FX and FX on Hulu on August 5, 2026.

Other media outlets covering Gere's emergence include The Hollywood Reporter, Deadline, Variety, People, and Entertainment Weekly.`,
    category: 'Press',
    author: 'Official Editorial',
    date: 'July 2026',
    readTime: '3 min read',
    image: SECTION_IMAGES.bts[4],
    imageAlt: 'Homer Gere — BBC News press portrait',
    featured: false,
    trending: false,
    status: 'published',
    tags: ['BBC News', 'Press', 'Emerging Talent', 'Profile'],
    coverCaption: 'BBC News — Emerging Talent Feature',
    seoTitle: 'BBC News — Homer Gere Among Emerging Talent to Watch in 2026',
    seoDescription: 'BBC News highlights Homer Gere as one of the emerging actors to watch, citing The Shards and Euphoria Season 3.',
  },

  // --- Brown University (Evergreen) ---
  {
    id: 'article-8',
    slug: 'brown-university-cognitive-neuroscience-visual-arts',
    title: 'From Brown University to the Screen: The Academic Foundation',
    excerpt:
      'How studying Cognitive Neuroscience and Visual Arts at Brown shaped Homer Gere\'s approach to performance.',
    content: `Before stepping onto the sets of Euphoria and The Shards, Homer Gere spent four years at Brown University in Providence, Rhode Island, where he graduated in 2024 with a concentration in Cognitive Neuroscience and Visual Arts.

The interdisciplinary program combined coursework in brain science with studio art and film studies — a combination that Gere has described as foundational to his approach to acting. Understanding how the brain processes emotion, memory, and perception has provided a framework for the psychological depth he brings to characters like Robert Mallory and Dylan Reid.

Brown University's Open Curriculum allowed Gere to explore both the scientific and creative dimensions of human experience, an education that continues to inform his work on screen.

Gere attended Hackley School in Tarrytown, New York, before enrolling at Brown, completing his secondary education in 2018.`,
    category: 'News',
    author: 'Official Editorial',
    date: 'March 15, 2026',
    readTime: '4 min read',
    image: SECTION_IMAGES.journal[3],
    imageAlt: 'Homer Gere — Brown University editorial portrait',
    featured: false,
    trending: false,
    status: 'published',
    tags: ['Brown University', 'Education', 'Neuroscience', 'Visual Arts'],
    coverCaption: 'Brown University — Academic Foundation',
    seoTitle: 'Brown University — Homer Gere\'s Academic Background in Neuroscience',
    seoDescription: 'How Homer Gere\'s studies in Cognitive Neuroscience and Visual Arts at Brown University shaped his acting career.',
  },
];

// ============================================================
// Featured Article (editor-selected)
// ============================================================

export const FEATURED_ARTICLE: JournalArticleExtended =
  JOURNAL_ARTICLES.find((a) => a.featured) ?? JOURNAL_ARTICLES[0];

// ============================================================
// Trending Articles (editor-selected)
// ============================================================

export const TRENDING_ARTICLES: JournalArticleExtended[] = JOURNAL_ARTICLES.filter(
  (a) => a.trending
);

// ============================================================
// Helper Functions — CMS-ready queries
// ============================================================

export const getArticlesByCategory = (category: JournalCategory): JournalArticleExtended[] => {
  if (category === 'All') return JOURNAL_ARTICLES.filter((a) => a.status === 'published');
  return JOURNAL_ARTICLES.filter((a) => a.status === 'published' && a.category === category);
};

export const getPublishedArticles = (): JournalArticleExtended[] => {
  return JOURNAL_ARTICLES.filter((a) => a.status === 'published');
};

export const getArticleBySlug = (slug: string): JournalArticleExtended | undefined => {
  return JOURNAL_ARTICLES.find((a) => a.slug === slug && a.status === 'published');
};

export const getLatestArticles = (count: number): JournalArticleExtended[] => {
  return getPublishedArticles().slice(0, count);
};
