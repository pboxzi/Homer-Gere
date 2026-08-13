import { JournalArticle, TimelineMilestone, Experience, MembershipTier, GalleryItem, FilmographyEntry, FAQItem } from '../types';
import { IMAGES } from './images';

export const METRICS = [
  { label: 'Projects', value: '3', icon: 'clapperboard' },
  { label: 'Roles', value: '3+', icon: 'star' },
  { label: 'Education', value: 'Brown', icon: 'globe' },
  { label: 'Family', value: 'Gere', icon: 'users' },
];

export const FEATURED_PROJECT = {
  id: 'the-shards',
  title: 'The Shards',
  tagline: 'A Ryan Murphy adaptation of the Bret Easton Ellis novel — Homer\'s first lead role, alongside Kaia Gerber.',
  status: 'Coming Soon • August 2026',
  director: 'Ryan Murphy',
  role: 'Robert Mallory (Lead)',
  image: IMAGES.shardsBanner,
  overview: `The Shards is a television series adapted by Ryan Murphy from Bret Easton Ellis' novel. The story follows a group of privileged high school students whose lives are disrupted by a mysterious new student. Homer Gere stars as Robert Mallory in his first major lead role, marking his breakthrough performance.`,
};

export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    id: 'birth',
    year: '2000',
    title: 'Born in New York',
    description: 'Born Homer James Jigme Gere on February 6, 2000 in New York City.',
    details: 'Named after his paternal grandfather Homer George Gere. His middle name "Jigme" is Tibetan for "fearless" or "courageous," reflecting his father\'s Buddhist faith.',
    iconName: 'user',
  },
  {
    id: 'education',
    year: '2018',
    title: 'Graduated Hackley School',
    description: 'Completed secondary education at Hackley School in Westchester, New York.',
    details: 'Attended the private Hackley School from September 2014 through graduation in June 2018.',
    iconName: 'graduation-cap',
  },
  {
    id: 'brown',
    year: '2019',
    title: 'Brown University',
    description: 'Enrolled at Brown University to study Cognitive Neuroscience and Visual Arts.',
    details: 'Joined Brown University in Providence, Rhode Island, pursuing a Bachelor of Arts degree majoring in Cognitive Neuroscience and Visual Arts.',
    iconName: 'graduation-cap',
  },
  {
    id: 'first-roles',
    year: '2023–2024',
    title: 'Early Film Work',
    description: 'Appeared in short film projects before transitioning to major television roles.',
    details: 'Built early experience through independent short film projects, including credits on IMDB for short films prior to his television debut.',
    iconName: 'clapperboard',
  },
  {
    id: 'euphoria',
    year: '2026',
    title: 'Euphoria Season 3',
    description: 'Cast as Dylan Reid in HBO\'s Euphoria third and final season.',
    details: 'Made his television debut portraying Dylan Reid in 4 episodes. The casting was announced by BBC News in October 2025; the season premiered in May 2026.',
    iconName: 'award',
    highlight: 'TV Debut',
  },
  {
    id: 'the-shards',
    year: '2025–2026',
    title: 'The Shards',
    description: 'Cast as Robert Mallory in Ryan Murphy\'s adaptation of the Bret Easton Ellis novel.',
    details: 'His first major leading role, starring alongside Kaia Gerber. The series is set for release in August 2026 on Disney+.',
    iconName: 'star',
    highlight: 'First Lead Role',
  },
  {
    id: 'white-lies',
    year: '2026',
    title: 'White Lies',
    description: 'Cast in an Oliver Stone film.',
    details: 'Announced in June 2026, Gere was cast in the Oliver Stone film "White Lies." Details about the role and release date are forthcoming.',
    iconName: 'film',
  },
];

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: 'on-set-on-moment',
    category: 'BEHIND THE SCENES',
    title: 'On Set. On Moment.',
    excerpt: 'A look behind the camera and the moments in between takes on the Euphoria set.',
    content: `Stepping onto the set of Euphoria Season 3 was a surreal experience. Working alongside an ensemble cast that includes Zendaya, Sydney Sweeney, and Jacob Elordi pushed me to elevate every scene.\n\nAt the Euphoria premiere, Homer spoke about the guidance he receives from his father: "It's not necessarily related to the craft, but more like how do you carry yourself, how do you make this work in a positive way."`,
    date: 'May 21, 2026',
    image: IMAGES.journalOnset,
    readTime: '4 min read',
  },
  {
    id: 'growth-gratitude-goals',
    category: 'LESSONS',
    title: 'Growth, Gratitude, Goals',
    excerpt: 'Thoughts on growth, gratitude, and staying inspired through every chapter.',
    content: `Acting is as much about listening as it is about speaking. As my career expands, I find that staying grounded requires daily practices of gratitude.\n\nEvery script brings new perspectives, forcing me to empathize with characters who view the world entirely differently from myself. Growth happens in the uncomfortable moments when you let go of ego and trust the story.`,
    date: 'Apr 29, 2026',
    image: IMAGES.journalPortrait,
    readTime: '5 min read',
  },
  {
    id: 'in-conversation',
    category: 'INTERVIEW',
    title: 'In Conversation',
    excerpt: 'Talking about storytelling, new complex roles, and the future of cinema.',
    content: `In a recent sit-down interview with Vogue, Homer discussed making his own name in the industry beyond his famous father's legacy.\n\nAs British Vogue noted: "Though Gere's appeared in Euphoria, that was a relatively minor part in comparison to this one, which is his first major acting role with a capital R."`,
    date: 'Aug 6, 2026',
    image: IMAGES.bwInterview,
    readTime: '6 min read',
  },
  {
    id: 'chasing-stories',
    category: 'JOURNAL',
    title: 'Chasing Stories',
    excerpt: 'Why Brown University and studying neuroscience shaped his approach to acting.',
    content: `Studying Cognitive Neuroscience and Visual Arts at Brown University gave me a unique lens on performance. Understanding how the brain processes emotion and perception has directly influenced how I approach character work.\n\nThe intersection of science and art is where I find the most authentic storytelling.`,
    date: 'Mar 15, 2026',
    image: IMAGES.roadChasing,
    readTime: '3 min read',
  },
];

export const EXPERIENCES: Experience[] = [
  {
    id: 'meet-greet',
    title: 'Meet & Greet',
    description: 'Meet Homer in person at an exclusive event.',
    details: 'Get personal backstage or premiere access to meet Homer in person, take photos, and receive a personalized signed gift.',
    price: '$250',
    iconName: 'users',
    type: 'meet',
  },
  {
    id: 'personalized-video',
    title: 'Personalized Video',
    description: 'Get a custom video message just for you.',
    details: 'Receive a personalized HD video message from Homer for birthdays, milestone celebrations, pep talks, or special requests.',
    price: '$120',
    iconName: 'video',
    type: 'video',
  },
  {
    id: 'virtual-meet',
    title: 'Virtual Meet',
    description: 'Have a 1-on-1 video call with Homer.',
    details: 'Enjoy a private 15-minute 1-on-1 video call with Homer to discuss acting, film recommendations, or career advice.',
    price: '$180',
    iconName: 'user-check',
    type: 'virtual',
  },
  {
    id: 'signed-memorabilia',
    title: 'Signed Memorabilia',
    description: 'Own an autographed collectible item.',
    details: 'Receive an authentic, hand-signed movie script, official film poster, or custom polaroid shipped directly to you.',
    price: '$85',
    iconName: 'pen-tool',
    type: 'memorabilia',
  },
  {
    id: 'vip-event-access',
    title: 'VIP Event Access',
    description: 'Get access to select VIP film experiences.',
    details: 'Exclusive invitation to upcoming film festival screenings, private viewings, and premiere red carpet afterparties.',
    price: '$500',
    iconName: 'star',
    type: 'vip',
  },
  {
    id: 'more-experiences',
    title: 'More Experiences',
    description: 'Explore all unique custom experiences.',
    details: 'Custom collaboration requests, masterclass Q&A sessions for drama schools, and bespoke community events.',
    price: 'Custom',
    iconName: 'grid',
    type: 'custom',
  },
];

export const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    id: 'silver',
    name: 'SILVER',
    price: 19,
    period: '/month',
    features: [
      'Exclusive Updates & Newsletter',
      'Members-Only Behind-the-Scenes',
      'Early Access to Project News',
      'Private Discord Community Access',
    ],
    ctaText: 'Join Silver',
  },
  {
    id: 'gold',
    name: 'GOLD',
    price: 49,
    period: '/month',
    badge: 'MOST POPULAR',
    isPopular: true,
    features: [
      'All Silver Benefits Included',
      'Priority Access to Experiences',
      'Behind-the-Scenes Video Vlogs',
      'Members-Only Monthly Giveaways',
      'Exclusive Digital Script Downloads',
    ],
    ctaText: 'Join Gold',
  },
  {
    id: 'platinum',
    name: 'PLATINUM',
    price: 99,
    period: '/month',
    features: [
      'All Gold Benefits Included',
      'VIP Film Event & Premiere Invitations',
      'Personalized Video Shoutout Annually',
      'Direct Message Priority Support',
      'Name Credited in Special Releases',
    ],
    ctaText: 'Join Platinum',
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gallery-1',
    title: 'Euphoria Season 3 Premiere',
    caption: 'Los Angeles premiere event, May 2026',
    category: 'Events',
    image: IMAGES.gallerySuit,
  },
  {
    id: 'gallery-2',
    title: 'On Set Portrait',
    caption: 'Between takes on Euphoria Season 3',
    category: 'Film Set',
    image: IMAGES.journalOnset,
  },
  {
    id: 'gallery-3',
    title: 'Dramatic Studio Shot',
    caption: 'Artistic black and white photography',
    category: 'Portraits',
    image: IMAGES.bwInterview,
  },
  {
    id: 'gallery-4',
    title: 'The Shards Set',
    caption: 'Behind the scenes with the cast',
    category: 'Travel',
    image: IMAGES.roadChasing,
  },
  {
    id: 'gallery-5',
    title: 'Thoughtful Moments',
    caption: 'Morning script review session',
    category: 'Personal',
    image: IMAGES.journalPortrait,
  },
  {
    id: 'gallery-6',
    title: 'Vintage Cafe Session',
    caption: 'Quiet afternoon writing in Brooklyn',
    category: 'Lifestyle',
    image: IMAGES.galleryCafe,
  },
];

export const FOOTER_LINKS = {
  Site: [
    { label: 'Home', href: '#home' },
    { label: 'Journey', href: '#journey' },
    { label: 'Projects', href: '#projects' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Journal', href: '#journal' },
  ],
  Experiences: [
    { label: 'All Experiences', href: '#experiences' },
    { label: 'How It Works', href: '#experiences' },
    { label: 'Gift an Experience', href: '#experiences' },
    { label: 'FAQs', href: '#experiences' },
  ],
  Membership: [
    { label: 'Membership Plans', href: '#membership' },
    { label: 'Benefits', href: '#membership' },
    { label: 'Compare Plans', href: '#membership' },
    { label: 'Member Login', href: '#membership' },
  ],
  Connect: [
    { label: 'Chat with Homer', href: '#chat' },
    { label: 'Contact', href: '#chat' },
    { label: 'Help Center', href: '#chat' },
  ],
};

export const FILMOGRAPHY: FilmographyEntry[] = [
  {
    id: 'white-lies',
    title: 'White Lies',
    role: 'TBA',
    year: 'TBA',
    status: 'Announced',
    description: 'An upcoming film directed by Oliver Stone. Announced in June 2026.',
    type: 'film',
    image: IMAGES.shardsBanner,
  },
  {
    id: 'the-shards',
    title: 'The Shards',
    role: 'Robert Mallory (Lead)',
    year: '2026',
    status: 'Post-Production',
    description: 'A television series adaptation of the Bret Easton Ellis novel, created by Ryan Murphy. Stars alongside Kaia Gerber. Set for release in August 2026.',
    type: 'television',
    image: IMAGES.shardsBanner,
  },
  {
    id: 'euphoria',
    title: 'Euphoria',
    role: 'Dylan Reid',
    year: '2026',
    status: 'Released',
    description: 'HBO\'s critically acclaimed series created by Sam Levinson. Portrays Dylan Reid, a rising actor, in 4 episodes of the third and final season.',
    type: 'television',
    image: IMAGES.journalOnset,
  },
  {
    id: 'american-pledge',
    title: 'American Pledge',
    role: 'Jake',
    year: '2024',
    status: 'Released',
    description: 'Short film. Listed on Homer Gere\'s IMDB filmography.',
    type: 'film',
  },
];

export const JOURNEY_FAQ: FAQItem[] = [
  {
    id: 'who-is-homer',
    question: 'Who is Homer Gere?',
    answer: 'Homer James Jigme Gere (born February 6, 2000) is an American actor. He is the son of actors Richard Gere and Carey Lowell. He made his television debut in Euphoria Season 3 (2026) and stars as Robert Mallory in The Shards, a Ryan Murphy series adaptation of the Bret Easton Ellis novel, set for release in August 2026.',
  },
  {
    id: 'education',
    question: 'Where did Homer go to school?',
    answer: 'Homer attended Hackley School in Westchester, New York, graduating in 2018. He then enrolled at Brown University in Providence, Rhode Island, where he studied Cognitive Neuroscience and Visual Arts.',
  },
  {
    id: 'appearances',
    question: 'What are Homer\'s notable roles?',
    answer: 'His most notable roles include Dylan Reid in Euphoria Season 3 (HBO, 2026), Robert Mallory in The Shards (Disney+, 2026), and a role in the upcoming Oliver Stone film White Lies.',
  },
  {
    id: 'contact-management',
    question: 'How can I contact management?',
    answer: 'For professional inquiries, media requests, and management contact, please use the Business Chat feature or reach out through the official contact channels listed on this website.',
  },
];
