import { JournalArticle, TimelineMilestone, Experience, MembershipTier, GalleryItem } from '../types';
import { IMAGES } from './images';

export const METRICS = [
  { label: 'Projects', value: '12+', icon: 'clapperboard' },
  { label: 'Journal', value: '48+', icon: 'star' },
  { label: 'Experiences', value: '6', icon: 'globe' },
  { label: 'Members', value: '250K+', icon: 'users' },
];

export const FEATURED_PROJECT = {
  id: 'the-shards',
  title: 'The Shards',
  tagline: 'An intense coming-of-age drama set in 1980s New York about friendship, secrets, and the weight of the past.',
  status: 'Coming Soon • 2026',
  director: 'Elena Vance',
  role: 'Bret Ellis (Lead)',
  image: IMAGES.shardsBanner,
  overview: `Set during the hot summer of 1981 in New York City, 'The Shards' follows a group of privileged high school seniors whose lives are upended by the arrival of a mysterious new student and a string of chilling events. Homer Gere stars as Bret, delivering a haunting and nuanced performance that captures the tension between youth, ambition, and dark secrets.`,
};

export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    id: 'early-years',
    year: '2000',
    title: 'Early Years',
    description: 'Born with a passion for classic cinema and stage performance.',
    details: 'Discovered a love for storytelling early on, spending childhood reading plays and watching 1970s film classics.',
    iconName: 'user',
  },
  {
    id: 'first-audition',
    year: '2013',
    title: 'First Audition',
    description: 'Landed first regional stage role in a local theater production.',
    details: 'At age 13, stepped onto the stage for the first time in a regional production of "Our Town", confirming a lifelong calling.',
    iconName: 'users',
  },
  {
    id: 'training',
    year: '2015',
    title: 'Training',
    description: 'Enrolled in intensive drama training studio in New York.',
    details: 'Immersed in Meisner and Stanislavski techniques under renowned coaches, refining physical and vocal precision.',
    iconName: 'graduation-cap',
  },
  {
    id: 'first-role',
    year: '2017',
    title: 'First Role',
    description: 'Cast in critically acclaimed indie short premiered at Tribeca.',
    details: 'Made screen debut in "Shadows in Light", which earned awards across regional film festivals and festival praise.',
    iconName: 'clapperboard',
  },
  {
    id: 'breakthrough',
    year: '2020',
    title: 'Breakthrough',
    description: 'Breakout performance in feature drama "Echoes of Midnight".',
    details: 'Captured critical acclaim with a compelling lead performance, establishing Homer as one of cinema\'s most promising young talents.',
    iconName: 'award',
    highlight: 'Breakout Star',
  },
  {
    id: 'today',
    year: '2024',
    title: 'Today',
    description: 'Leading major studio feature films and global creative projects.',
    details: 'Currently filming "The Shards" in New York while connecting with a global community of over 250,000 film enthusiasts.',
    iconName: 'star',
    highlight: 'Present Day',
  },
  {
    id: 'whats-next',
    year: 'The Future',
    title: "What's Next",
    description: 'Expanding into film production and directorial ventures.',
    details: 'Developing original screenplays, independent production label, and international storytelling collaborations.',
    iconName: 'heart',
  },
];

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: 'on-set-on-moment',
    category: 'BEHIND THE SCENES',
    title: 'On Set. On Moment.',
    excerpt: 'A look behind the camera and the moments in between takes on 1980s New York set.',
    content: `Filming 'The Shards' has been an exhilarating journey. Transporting ourselves back to 1981 New York requires more than just costume and set design—it demands stepping into the mindset of a generation living on the edge of transformation.\n\nBetween camera setups, I often sit with the director and cinematography crew discussing lighting choices and shot compositions. There is an unmistakable magic in the quiet space before the director calls 'Action'.`,
    date: 'May 12, 2024',
    image: IMAGES.journalOnset,
    readTime: '4 min read',
  },
  {
    id: 'growth-gratitude-goals',
    category: 'LESSONS',
    title: 'Growth, Gratitude, Goals',
    excerpt: 'Thoughts on growth, gratitude, and staying inspired through every chapter.',
    content: `Acting is as much about listening as it is about speaking. As my career expands, I find that staying grounded requires daily practices of gratitude.\n\nEvery script brings new perspectives, forcing me to empathize with characters who view the world entirely differently from myself. Growth happens in the uncomfortable moments when you let go of ego and trust the story.`,
    date: 'May 6, 2024',
    image: IMAGES.journalPortrait,
    readTime: '5 min read',
  },
  {
    id: 'in-conversation',
    category: 'INTERVIEW',
    title: 'In Conversation',
    excerpt: 'Talking about storytelling, new complex roles, and the future of cinema.',
    content: `In a recent sit-down interview with Cinema Quarterly, we discussed the evolving landscape of independent drama and character study films.\n\n"I want to make films that linger in your mind days after the credits roll," Homer shared. "Stories that ask difficult questions rather than giving easy answers."`,
    date: 'Apr 28, 2024',
    image: IMAGES.bwInterview,
    readTime: '6 min read',
  },
  {
    id: 'chasing-stories',
    category: 'JOURNAL',
    title: 'Chasing Stories',
    excerpt: 'Why travel and open road journeys continue to shape my artistic perspective.',
    content: `Traveling across vast open highways offers unmatched mental clarity. When I took a road trip through the Southwest desert last spring, I realized how physical landscapes mirror our inner emotional states.\n\nObserving people, local accents, and quiet roadside diners fuels the mental library I pull from when creating authentic characters.`,
    date: 'Apr 26, 2024',
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
    title: 'Red Carpet Premiere',
    caption: 'Evening gala event in New York City',
    category: 'Events',
    image: IMAGES.gallerySuit,
  },
  {
    id: 'gallery-2',
    title: 'On Set Portrait',
    caption: 'Between takes filming The Shards',
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
    title: 'Desert Open Road',
    caption: 'Location scouting in the American Southwest',
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
