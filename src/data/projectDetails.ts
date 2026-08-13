import { PROJECT_IMAGES, SECTION_IMAGES } from './images';

export interface CastMember {
  name: string;
  role: string;
  profileUrl?: string;
  image?: string;
  bio?: string;
}

export interface CrewMember {
  name: string;
  role: string;
  profileUrl?: string;
  bio?: string;
}

export interface ProjectMedia {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  type: 'still' | 'behind-the-scenes' | 'poster' | 'promotional' | 'premiere';
}

export interface ProjectVideo {
  id: string;
  title: string;
  url: string;
  type: 'trailer' | 'teaser' | 'interview' | 'behind-the-scenes' | 'featurette';
  thumbnail?: string;
  duration?: string;
  description?: string;
}

export interface Recognition {
  id: string;
  award: string;
  category: string;
  result: 'Winner' | 'Nominated' | 'Selected' | 'Featured';
  ceremony?: string;
  year?: string;
  url?: string;
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
  expandedSynopsis?: string;
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
    expandedDescription?: string;
    episodes?: string;
    notes?: string;
    quotes?: string[];
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

const IMG = PROJECT_IMAGES;

export const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  'the-shards': {
    slug: 'the-shards',
    title: 'The Shards',
    year: '2026',
    type: 'Television',
    status: 'Released',
    tagline: 'Hot. Rich. Dangerous.',
    heroImage: IMG['the-shards'].hero,
    posterImage: IMG['the-shards'].poster,

    synopsis: `Set in 1981 Los Angeles, The Shards is a seductive drama series based on Bret Easton Ellis' acclaimed bestselling novel of the same name. The series follows Bret, an aspiring writer and observant teenager at the elite Buckley prep school, and his glamorous social circle as they navigate identity, sex, jealousy, obsession, and the dangers beneath American adolescence. Their privileged world of wealth, beauty, parties, and excess begins to unravel with the arrival of Robert Mallory — a mysterious and magnetic new student whose appearance coincides with the terror of The Trawler, a serial killer targeting teenagers across the city.`,

    expandedSynopsis: `Created by Ryan Murphy and Bret Easton Ellis, The Shards is part teenage coming-of-age story, part erotic thriller, and part exploration of the untamed and mysterious era of Los Angeles in 1981. The series tracks a group of privileged high school friends — Bret, Susan Reynolds, Debbie Schaffer, and Thom Wright — as they navigate the complex dynamics of adolescence against the vivid backdrop of 1980s Los Angeles.

At its center is Bret, an aspiring writer whose reality begins to unravel with the arrival of Robert Mallory. Transferring in just before his senior year, Robert's appearance coincides with the growing terror of The Trawler. As Bret becomes increasingly obsessed with both the serial killer and the enigmatic newcomer, he begins to suspect that Robert may be hiding dark secrets.

The series explores themes of privilege, identity, obsession, and the corruption of innocence, set against a world of cocaine-fueled parties, sun-drenched California landscapes, and the dark underbelly of American adolescence. With its ensemble cast and visually stunning 1980s aesthetic, The Shards is both a love letter to and a deconstruction of the coming-of-age genre.`,

    genre: 'Teen Drama / Horror / Thriller / Coming-of-Age',
    runtime: '~55 min per episode',
    language: 'English',
    country: 'United States',
    productionCompany: '20th Television, Ryan Murphy Television, Color Force, Sodium Fox Productions',
    distributor: 'FX / FX on Hulu / Disney+ (International)',
    releaseDate: 'August 5, 2026',
    officialUrl: 'https://www.fxnetworks.com/shows/the-shards',
    trailerUrl: 'https://www.youtube.com/watch?v=2uYeXRSm2Zo',

    homerRole: {
      character: 'Robert Mallory',
      description: `Homer stars as Robert Mallory, the enigmatic and potentially nefarious newcomer to Buckley prep school. Described as "magnetic and mysterious," Robert is a transfer student whose arrival disrupts the social dynamics of the friend group and coincides with the emergence of a serial killer known as The Trawler.`,
      expandedDescription: `Robert Mallory is the central mystery of The Shards. A new student who transfers to Buckley prep school just before his senior year, Robert immediately captivates everyone around him with his striking looks, effortless charisma, and an air of danger that sets him apart from the privileged teenagers who populate Bret's social circle.

As the series progresses, Robert becomes increasingly entangled in the lives of Bret, Susan, Debbie, and Thom — while also becoming the primary suspect in The Trawler killings. His true intentions remain ambiguous throughout: is he a predatory killer hiding in plain sight, or simply a misunderstood outsider caught up in circumstances beyond his control?

Homer's portrayal of Robert required balancing charm with menace, creating a character who is simultaneously alluring and deeply unsettling. The role demanded a nuanced performance that could shift between romantic lead and potential antagonist, keeping audiences guessing about Robert's true nature until the very end.`,
      episodes: 'Main cast — all episodes',
      notes: `This marks Homer's first major leading role and his biggest career step to date. The character of Robert Mallory is central to the series' mystery, with his true intentions remaining ambiguous throughout. Homer was cast in July 2025 alongside Igby Rigney and Graham Campbell, with the casting announcement generating significant media attention given his famous parentage.`,
      quotes: [
        "It's not necessarily related to like the craft, but more like how do you carry yourself, how do you make this work in a positive way.",
      ],
    },

    cast: [
      { name: 'Homer Gere', role: 'Robert Mallory — The mysterious new student at Buckley whose arrival coincides with The Trawler killings', image: IMG['the-shards'].cast.homerGere, bio: 'Homer James Jigme Gere makes his breakthrough leading role as Robert Mallory. The son of Richard Gere and Carey Lowell, Homer graduated from Brown University in 2024 with a degree in Cognitive Neuroscience before pursuing acting full-time.' },
      { name: 'Igby Rigney', role: 'Bret — A fictionalized version of author Bret Easton Ellis, an aspiring writer and keenly observant teenager', image: IMG['the-shards'].cast.igbyRigney, profileUrl: 'https://en.wikipedia.org/wiki/Igby_Rigney', bio: 'Igby Rigney is known for his roles in Mike Flanagan\'s Netflix horror universe, including Midnight Mass, The Fall of the House of Usher, and The Midnight Club.' },
      { name: 'Kaia Gerber', role: 'Susan Reynolds — A member of Bret\'s elite social circle at Buckley prep school', image: IMG['the-shards'].cast.kaiaGerber, profileUrl: 'https://en.wikipedia.org/wiki/Kaia_Gerber', bio: 'Kaia Gerber is an American model and actress, daughter of supermodel Cindy Crawford and businessman Rande Gerber. She was the first casting announcement for The Shards.' },
      { name: 'Hayes Warner', role: 'Debbie Schaffer — Part of the glamorous social circle navigating 1980s Los Angeles', image: IMG['the-shards'].cast.hayesWarner, bio: 'Hayes Warner also contributes original music to the series alongside Troye Sivan and Leland.' },
      { name: 'Graham Campbell', role: 'Thom Wright — A member of the privileged friend group at Buckley', image: IMG['the-shards'].cast.grahamCampbell, bio: 'Graham Campbell was announced alongside Homer Gere and Igby Rigney when the series was greenlit in July 2025.' },
      { name: 'Wes Bentley', role: 'Terry Schaffer — An adult figure in the dark world surrounding the teenagers', image: IMG['the-shards'].cast.wesBentley, profileUrl: 'https://en.wikipedia.org/wiki/Wes_Bentley', bio: 'Wes Bentley is known for his breakout role in American Beauty and his portrayal of Sen. Crane in The Hunger Games franchise.' },
      { name: 'Evan Rachel Wood', role: 'Liz Schaffer — Part of the adult world surrounding the teenagers', image: IMG['the-shards'].cast.evanRachelWood, profileUrl: 'https://en.wikipedia.org/wiki/Evan_Rachel_Wood', bio: 'Evan Rachel Wood is an Academy Award-nominated actress known for Westworld, Thirteen, and Across the Universe.' },
    ],

    crew: [
      { name: 'Ryan Murphy', role: 'Creator / Executive Producer / Director', profileUrl: 'https://en.wikipedia.org/wiki/Ryan_Murphy_(producer)', bio: 'Ryan Murphy is the Emmy-winning creator of American Horror Story, Pose, Dahmer, and Monster. He revived The Shards at FX after the project stalled at HBO.' },
      { name: 'Bret Easton Ellis', role: 'Creator / Executive Producer / Writer', profileUrl: 'https://en.wikipedia.org/wiki/Bret_Easton_Ellis', bio: 'Bret Easton Ellis is the bestselling author of American Psycho, Less Than Zero, and The Shards, which was originally serialized as a podcast before traditional publication in 2021.' },
      { name: 'Max Winkler', role: 'Executive Producer / Director', profileUrl: 'https://en.wikipedia.org/wiki/Max_Winkler', bio: 'Max Winkler directed the pilot and multiple episodes of the series. He is known for his work on Flowers and Jungle Cruise.' },
      { name: 'Nina Jacobson', role: 'Executive Producer', bio: 'Nina Jacobson is the producer behind The Hunger Games franchise and American Crime Story.' },
      { name: 'Brad Simpson', role: 'Executive Producer', bio: 'Brad Simpson has produced numerous television series alongside Nina Jacobson, including Pose and American Crime Story.' },
      { name: 'Michael Uppendahl', role: 'Executive Producer / Director', profileUrl: 'https://en.wikipedia.org/wiki/Michael_Uppendahl', bio: 'Michael Uppendahl is known for directing episodes of Fargo, The Americans, and American Horror Story.' },
    ],

    media: [
      { id: 'shards-1', src: IMG['the-shards'].gallery[0].src, alt: IMG['the-shards'].gallery[0].alt, caption: 'The Shards World Premiere at SVA Theatre, New York City — July 27, 2026', type: 'premiere' },
      { id: 'shards-2', src: IMG['the-shards'].gallery[1].src, alt: IMG['the-shards'].gallery[1].alt, caption: 'Homer Gere as Robert Mallory — Official FX character still', type: 'still' },
      { id: 'shards-3', src: IMG['the-shards'].gallery[2].src, alt: IMG['the-shards'].gallery[2].alt, caption: 'Behind the scenes during principal photography in Los Angeles', type: 'behind-the-scenes' },
      { id: 'shards-4', src: IMG['the-shards'].gallery[3].src, alt: IMG['the-shards'].gallery[3].alt, caption: 'The Shards launch party at Moonlight Rollerway, Los Angeles', type: 'promotional' },
      { id: 'shards-5', src: IMG['the-shards'].gallery[4].src, alt: IMG['the-shards'].gallery[4].alt, caption: 'Homer Gere with mother Carey Lowell at The Shards world premiere', type: 'premiere' },
      { id: 'shards-6', src: IMG['the-shards'].gallery[5].src, alt: IMG['the-shards'].gallery[5].alt, caption: 'The Shards cast at Disney+ Upfront Presentation', type: 'promotional' },
    ],

    videos: [
      { id: 'trailer-1', title: 'The Shards — Official Season 1 Trailer', url: 'https://www.youtube.com/watch?v=2uYeXRSm2Zo', type: 'trailer', duration: '2:00', description: 'Watch the official trailer for FX\'s The Shards, premiering August 5, 2026.' },
      { id: 'interview-1', title: 'Homer Gere on Ditching Social Media & Famous Family', url: 'https://www.youtube.com/watch?v=sx6j4ZQWsK8', type: 'interview', description: 'Homer Gere discusses his approach to fame, social media, and the guidance he receives from his father Richard Gere.' },
    ],

    recognition: [
      { id: 'rec-1', award: 'British Vogue', category: '"Who Is Homer Gere" — Profile Feature', result: 'Featured', year: '2026', url: 'https://www.vogue.com/article/exclusive-first-look-the-shards-ryan-murphy-bret-easton-ellis-kaia-gerber-homer-gere' },
      { id: 'rec-2', award: 'BBC News', category: 'New cast members announced for The Shards', result: 'Featured', year: '2025', url: 'https://www.bbc.com/news' },
      { id: 'rec-3', award: 'People Magazine', category: '"Kaia Gerber and Homer Gere Are the Spitting Image of Famous Parents"', result: 'Featured', year: '2025', url: 'https://people.com/cindy-crawford-richard-geres-kids-kaia-gerber-homer-gere-shards-photos-11842264' },
      { id: 'rec-4', award: 'TV Insider', category: '"The Shards Series Reveals Premiere Date & Sultry Cast Photo"', result: 'Featured', year: '2026' },
      { id: 'rec-5', award: 'Deadline Hollywood', category: '"Ryan Murphy\'s The Shards Sets Release Date At FX"', result: 'Featured', year: '2026', url: 'https://deadline.com/2026/06/ryan-murphy-the-shards-release-date-fx-bret-easton-ellis-1236952697/' },
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
    heroImage: IMG['euphoria'].hero,
    posterImage: IMG['euphoria'].poster,

    synopsis: `Euphoria follows a group of high school students as they navigate love and friendships in a world of drugs, sex, trauma, and social media. Created by Sam Levinson, the series explores the human condition through the eyes of its characters as they grapple with contemporary issues facing today's youth. Season 3, the acclaimed final season, continues to push boundaries with its unflinching exploration of adolescence.`,

    expandedSynopsis: `Euphoria Season 3, the long-awaited final chapter of Sam Levinson's groundbreaking HBO series, premiered on May 21, 2026 after years of anticipation. The season picks up in the aftermath of the previous season's events, with Rue Bennett (Zendaya) and her friends confronting new challenges as they transition from high school into adulthood.

The season features 8 episodes and introduces several new characters and storylines, including Homer Gere's portrayal of Dylan Reid, a rising young actor who becomes entangled in Cassie Howard's (Sydney Sweeney) ongoing quest for superstardom. Shot on 65mm film with a lush visual palette that became Kodak's innovative VERITA 200D stock, the season has been described by Jacob Elordi as "incredibly clever and cinematic."

The final season also pays tribute to the late Angus Cloud, who passed away in July 2023 before production began. Creator Sam Levinson acknowledged that Cloud's character Fezco "has an arc this season that is really kind of amazing, despite the fact that he's in prison and we don't see him."`,

    genre: 'Teen Drama',
    runtime: '~55 min per episode',
    language: 'English',
    country: 'United States',
    productionCompany: 'A24, HBO Entertainment, The Reasonable Bunch, Little Lamb, DreamCrew',
    distributor: 'HBO / HBO Max',
    releaseDate: 'May 21, 2026 (Season 3 — Series Finale)',
    officialUrl: 'https://www.hbo.com/euphoria',

    homerRole: {
      character: 'Dylan Reid',
      description: `Homer portrays Dylan Reid, a rising young actor and Hollywood up-and-comer. Dylan becomes an unwitting pawn in Cassie Howard's (Sydney Sweeney) ongoing quest for superstardom, leading to a pivotal storyline in the season.`,
      expandedDescription: `Dylan Reid is a charismatic young Hollywood actor who becomes the center of one of Euphoria Season 3's most talked-about storylines. Managed by none other than Maddy Perez (Alexa Demie), Dylan represents the intersection of celebrity culture and the personal dramas that define the Euphoria universe.

His relationship with Cassie Howard (Sydney Sweeney) becomes a major plotline, culminating in scenes that generated significant media attention and fan discussion. The character required Homer to balance charm and vulnerability while navigating the complex dynamics of a show known for its intense emotional demands.

As Homer described at the Euphoria premiere, the guidance he received from his father Richard Gere was "not necessarily related to like the craft, but more like how do you carry yourself, how do you make this work in a positive way." This approach served him well in handling the pressures of joining one of television's most high-profile casts.`,
      episodes: '4 episodes — "This Little Piggy," "Stand Still and See," "Rain or Shine," "In God We Trust"',
      notes: `This marked Homer's television debut. His casting was announced by BBC News in October 2025, generating significant media attention. The role required working alongside some of television's biggest names, including Zendaya, Sydney Sweeney, and Alexa Demie.`,
      quotes: [
        "It's not necessarily related to like the craft, but more like how do you carry yourself, how do you make this work in a positive way.",
      ],
    },

    cast: [
      { name: 'Homer Gere', role: 'Dylan Reid — A rising young actor and Hollywood up-and-comer', image: IMG['euphoria'].cast.homerGere, bio: 'Homer James Jigme Gere makes his television debut as Dylan Reid. The son of Richard Gere and Carey Lowell, Homer graduated from Brown University in 2024.' },
      { name: 'Zendaya', role: 'Rue Bennett — The series protagonist navigating addiction and identity', image: IMG['euphoria'].cast.zendaya, profileUrl: 'https://en.wikipedia.org/wiki/Zendaya', bio: 'Zendaya is an Emmy-winning actress and producer who also serves as an executive producer on Euphoria.' },
      { name: 'Sydney Sweeney', role: 'Cassie Howard — A young woman navigating fame and relationships', image: IMG['euphoria'].cast.sydneySweeney, profileUrl: 'https://en.wikipedia.org/wiki/Sydney_Sweeney', bio: 'Sydney Sweeney is an Emmy-nominated actress known for Euphoria, The White Lotus, and Anyone But You.' },
      { name: 'Alexa Demie', role: 'Maddy Perez — A fierce and loyal friend who manages Dylan\'s career', image: IMG['euphoria'].cast.alexaDemie, profileUrl: 'https://en.wikipedia.org/wiki/Alexa_Demie', bio: 'Alexa Demie is an actress and singer known for her portrayal of Maddy Perez on Euphoria.' },
      { name: 'Hunter Schafer', role: 'Jules Vaughn — Rue\'s complex love interest and close friend', image: IMG['euphoria'].cast.hunterSchafer, profileUrl: 'https://en.wikipedia.org/wiki/Hunter_Schafer', bio: 'Hunter Schafer is an actress, model, and activist known for her groundbreaking portrayal of Jules Vaughn.' },
      { name: 'Jacob Elordi', role: 'Nate Jacobs — A troubled young man with a complex relationship with power', image: IMG['euphoria'].cast.jacobElordi, profileUrl: 'https://en.wikipedia.org/wiki/Jacob_Elordi', bio: 'Jacob Elordi is an Australian actor known for The Kissing Booth franchise and Priscilla.' },
    ],

    crew: [
      { name: 'Sam Levinson', role: 'Creator / Showrunner / Writer / Director', profileUrl: 'https://en.wikipedia.org/wiki/Sam_Levinson', bio: 'Sam Levinson is the creator of Euphoria and directed all episodes of Season 3. He also created The Idol for HBO.' },
      { name: 'Zendaya', role: 'Executive Producer', profileUrl: 'https://en.wikipedia.org/wiki/Zendaya', bio: 'Zendaya serves as an executive producer on Euphoria in addition to her starring role as Rue Bennett.' },
      { name: 'Drake', role: 'Executive Producer', profileUrl: 'https://en.wikipedia.org/wiki/Drake_(musician)', bio: 'Drake serves as an executive producer through his DreamCrew production company.' },
      { name: 'Ron Leshem', role: 'Executive Producer', profileUrl: 'https://en.wikipedia.org/wiki/Ron_Leshem', bio: 'Ron Leshem created the original Israeli series Euphoria that inspired the American adaptation.' },
      { name: 'Marcell Rév', role: 'Director of Photography', profileUrl: 'https://en.wikipedia.org/wiki/Marcell_R%C3%A9v', bio: 'Marcell Rév shot Season 3 on 65mm film, creating the season\'s distinctive visual palette using Kodak\'s innovative VERITA 200D stock.' },
    ],

    media: [
      { id: 'euphoria-1', src: IMG['euphoria'].gallery[0].src, alt: IMG['euphoria'].gallery[0].alt, caption: 'Homer Gere and Alexa Demie in Euphoria Season 3', type: 'still' },
      { id: 'euphoria-2', src: IMG['euphoria'].gallery[1].src, alt: IMG['euphoria'].gallery[1].alt, caption: 'Euphoria Season 3 premiere at TCL Chinese Theatre, Hollywood', type: 'premiere' },
      { id: 'euphoria-3', src: IMG['euphoria'].gallery[2].src, alt: IMG['euphoria'].gallery[2].alt, caption: 'Behind the scenes on the Euphoria set', type: 'behind-the-scenes' },
      { id: 'euphoria-4', src: IMG['euphoria'].gallery[3].src, alt: IMG['euphoria'].gallery[3].alt, caption: 'Homer Gere at HBO press event for Euphoria Season 3', type: 'promotional' },
    ],

    videos: [
      { id: 'euphoria-trailer', title: 'Euphoria Season 3 — Official Trailer', url: 'https://www.youtube.com/watch?v=sx6j4ZQWsK8', type: 'trailer', duration: '2:30', description: 'The official trailer for Euphoria Season 3, the acclaimed final season premiering May 21, 2026 on HBO.' },
    ],

    recognition: [
      { id: 'euphoria-rec-1', award: 'BBC News', category: 'New cast members announced for Euphoria Season 3', result: 'Featured', year: '2025' },
      { id: 'euphoria-rec-2', award: 'Entertainment Weekly', category: '"Homer Gere debuts as Dylan Reid in Euphoria Season 3"', result: 'Featured', year: '2026' },
      { id: 'euphoria-rec-3', award: 'Variety', category: 'Full Season 3 Cast Revealed — Homer Gere among 18 new additions', result: 'Featured', year: '2025', url: 'https://variety.com/2025/tv/news/euphoria-season-3-cast-trisha-paytas-natasha-lyonne-1236555183/' },
      { id: 'euphoria-rec-4', award: 'The Hollywood Reporter', category: 'Euphoria shares first Season 3 photo as production gets underway', result: 'Featured', year: '2025' },
      { id: 'euphoria-rec-5', award: 'Page Six', category: 'Richard Gere reveals whether he\'s seen son Homer\'s Euphoria scenes', result: 'Featured', year: '2026' },
    ],

    relatedSlugs: ['the-shards', 'white-lies'],
  },

  'white-lies': {
    slug: 'white-lies',
    title: 'White Lies',
    year: 'TBA',
    type: 'Film',
    status: 'Announced',
    tagline: undefined,
    heroImage: IMG['white-lies'].hero,
    posterImage: IMG['white-lies'].poster,

    synopsis: `White Lies is an upcoming drama-thriller film directed by acclaimed filmmaker Oliver Stone. Details about the plot remain closely guarded, but the film has generated significant industry attention with its stellar ensemble cast.`,

    expandedSynopsis: `Announced in June 2026, White Lies marks Oliver Stone's return to narrative filmmaking with a project that has already attracted some of Hollywood's most distinguished actors. The film represents a significant milestone in Homer Gere's career, placing him alongside Academy Award winners and nominees in what promises to be a prestige production.

Stone, known for his politically charged dramas and visually distinctive filmmaking style, has assembled a cast that includes Michael Douglas (with whom he previously collaborated on The Basic Instinct and华尔街), Willem Dafoe, and Ellen Barkin. While specific plot details remain under wraps, the film's title and Stone's filmography suggest a story exploring themes of deception, moral ambiguity, and the consequences of concealed truths.`,

    genre: 'Drama / Thriller',
    language: 'English',
    country: 'United States',
    productionCompany: 'TBA',
    distributor: 'TBA',
    releaseDate: 'TBA',

    homerRole: {
      character: 'Role TBA',
      description: `Homer has been cast in an unspecified role in Oliver Stone's upcoming film White Lies. Details about his character and the extent of his involvement have not yet been officially announced.`,
      expandedDescription: `Homer's casting in White Lies represents a significant step in his rapidly ascending career. Being cast alongside Michael Douglas, Willem Dafoe, and Ellen Barkin in an Oliver Stone film places him firmly in the company of Hollywood's elite.

The casting was first reported in June 2026, and while specific details about his role remain保密, the fact that he was cast in a film with such a distinguished ensemble suggests that Stone saw something special in his performances in The Shards and Euphoria.

This role follows Homer's breakthrough year in 2026, which saw him starring as the lead in FX's The Shards and appearing in HBO's Euphoria Season 3. The combination of these high-profile projects has established him as one of the most exciting young talents in Hollywood.`,
      notes: `Announced June 2026. The film also stars Michael Douglas, Willem Dafoe, and Ellen Barkin. Oliver Stone directs.`,
    },

    cast: [
      { name: 'Homer Gere', role: 'TBA', image: IMG['white-lies'].cast.homerGere, bio: 'Homer Gere continues his rapid career ascent with this high-profile film role following his breakout year in television.' },
      { name: 'Michael Douglas', role: 'TBA', profileUrl: 'https://en.wikipedia.org/wiki/Michael_Douglas', bio: 'Michael Douglas is an Academy Award-winning actor and producer known for Wall Street, Basic Instinct, and Behind the Candelabra.' },
      { name: 'Willem Dafoe', role: 'TBA', profileUrl: 'https://en.wikipedia.org/wiki/Willem_Dafoe', bio: 'Willem Dafoe is an Academy Award-nominated actor known for his versatile performances in films ranging from Platoon to The Lighthouse.' },
      { name: 'Ellen Barkin', role: 'TBA', profileUrl: 'https://en.wikipedia.org/wiki/Ellen_Barkin', bio: 'Ellen Barkin is an Emmy-winning actress known for her roles in Sea of Love, This Boy\'s Life, and The Portuguese Woman.' },
    ],

    crew: [
      { name: 'Oliver Stone', role: 'Director / Writer', profileUrl: 'https://en.wikipedia.org/wiki/Oliver_Stone', bio: 'Oliver Stone is an Academy Award-winning filmmaker known for Platoon, JFK, Nixon, and Wall Street. He is one of Hollywood\'s most politically engaged and visually distinctive directors.' },
    ],

    media: [
      { id: 'white-lies-1', src: IMG['white-lies'].gallery[0].src, alt: IMG['white-lies'].gallery[0].alt, caption: 'Homer Gere at Cannes Film Festival — announced as part of Oliver Stone\'s White Lies', type: 'promotional' },
      { id: 'white-lies-2', src: IMG['white-lies'].gallery[1].src, alt: IMG['white-lies'].gallery[1].alt, caption: 'Red carpet event', type: 'promotional' },
    ],

    videos: [],

    recognition: [
      { id: 'white-lies-rec-1', award: 'Deadline Hollywood', category: 'Oliver Stone\'s White Lies announces cast including Homer Gere', result: 'Featured', year: '2026' },
    ],

    relatedSlugs: ['the-shards', 'euphoria'],
  },

  'american-pledge': {
    slug: 'american-pledge',
    title: 'American Pledge',
    year: '2024',
    type: 'Short Film',
    status: 'Released',
    heroImage: IMG['american-pledge'].hero,
    posterImage: IMG['american-pledge'].poster,

    synopsis: `American Pledge is a short film featuring Homer Gere in the role of Jake. Part of his early screen work, the project demonstrates the foundational acting skills that would later earn him roles in major television productions.`,

    expandedSynopsis: `American Pledge represents one of Homer Gere's earliest acting credits, providing valuable screen experience before his breakthrough roles in Euphoria and The Shards. The short film format allowed Homer to explore character work in an intimate setting, developing the skills that would later define his portrayal of Robert Mallory and Dylan Reid.

While details about the short film's plot and production remain limited, it is listed on Homer's IMDb filmography and represents an important step in his transition from university-educated cognitive neuroscience graduate to working actor.`,

    genre: 'Drama',
    language: 'English',
    country: 'United States',

    homerRole: {
      character: 'Jake',
      description: `Homer plays Jake in this short film, part of his early acting credits that helped build foundational screen experience before his breakout television roles.`,
      expandedDescription: `The role of Jake in American Pledge was one of Homer Gere's first professional acting credits. Following his graduation from Brown University in 2024, where he studied Cognitive Neuroscience with a Visual Arts concentration, Homer began pursuing acting roles to build his portfolio.

This short film experience gave him hands-on experience with on-set dynamics, character development, and the collaborative nature of filmmaking — skills that would prove invaluable when he was cast in Euphoria Season 3 later that year and subsequently landed the leading role in FX's The Shards.`,
    },

    cast: [
      { name: 'Homer Gere', role: 'Jake', image: IMG['american-pledge'].cast.homerGere, bio: 'Homer Gere in one of his earliest professional acting credits.' },
    ],

    crew: [],

    media: [
      { id: 'pledge-1', src: IMG['american-pledge'].gallery[0].src, alt: IMG['american-pledge'].gallery[0].alt, caption: 'American Pledge — promotional still', type: 'still' },
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
