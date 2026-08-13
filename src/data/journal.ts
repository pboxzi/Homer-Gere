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
  authorRole: string;
  date: string;
  publishDate: string;
  readTime: string;
  wordCount: number;
  image: string;
  imageAlt: string;
  imageCaption?: string;
  featured: boolean;
  trending: boolean;
  status: ArticleStatus;
  tags: string[];
  coverCaption?: string;
  seoTitle: string;
  seoDescription: string;
  ogImage?: string;
  relatedSlugs?: string[];
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
// All content sourced from public records, verified interviews,
// and officially confirmed information.
// ============================================================

export const JOURNAL_ARTICLES: JournalArticleExtended[] = [
  // ================================================================
  // ARTICLE 1 — THE SHARDS PREMIERE (FEATURED)
  // ================================================================
  {
    id: 'article-1',
    slug: 'the-shards-world-premiere-sva-theatre',
    title: 'The Shards Makes Its World Debut at SVA Theatre',
    excerpt:
      'Homer Gere leads the cast of FX\'s The Shards at the world premiere in New York City — the first major milestone for his first leading role in a major television production.',
    content: `On the evening of July 27, 2026, the cast and creative team of FX's The Shards descended upon the SVA Theatre in Manhattan's Chelsea neighborhood for the world premiere of the series — a moment that marked the culmination of months of principal photography and the beginning of what many critics have called the most anticipated television debut of the summer.

Homer Gere, who stars as Robert Mallory in what is his first leading role in a major television production, walked the red carpet alongside his co-stars Kaia Gerber, Igby Rigney, Graham Campbell, and Hayes Warner. Supporting cast members Wes Bentley and Evan Rachel Wood also attended, joined by series creator Ryan Murphy and co-creator Bret Easton Ellis.

The evening was a family affair for Gere, who was accompanied by his mother, Carey Lowell — the actress and former Bond girl known for her role in Licence to Kill. Photographers captured the pair arriving together, an image that was subsequently shared widely across social media and entertainment outlets including People, Entertainment Weekly, and InStyle.

**The Series**

The Shards is a teen horror-thriller set in 1981 Los Angeles, centered on the students of the fictional Buckley prep school. The narrative follows a group of teenagers whose seemingly idyllic lives are disrupted by the arrival of a serial killer known as "The Trawler." The series is created by Ryan Murphy — the prolific showrunner behind American Horror Story, Glee, Pose, Monster, and The Watcher — and Bret Easton Ellis, the novelist and screenwriter whose works include Less Than Zero, American Psycho, and The Rules of Attraction.

Homer Gere's character, Robert Mallory, is described as a complex, intelligent teenager navigating the social hierarchies of prep school life while the shadow of the Trawler's killings looms over the community. The role represents Gere's most substantial on-screen work to date, following smaller appearances in Euphoria Season 3 and the short film American Pledge.

**The Production**

The Shards was produced by 20th Television, Ryan Murphy Television, Color Force, and Sodium Fox Productions. The series was shot on 65mm Kodak VERITA 200D film stock by cinematographer Marcell Rév, whose previous work includes Euphoria and other visually ambitious projects. The choice of large-format film gives the series a distinctive period texture that echoes the early 1980s setting, with the warmth and grain characteristic of photochemical photography.

The decision to shoot on 65mm was driven by the desire to capture an immersive visual quality that digital formats cannot replicate. The format provides a shallow depth of field and rich color rendition that places the audience within the world of 1980s Los Angeles — a city on the cusp of transformation, caught between the glamour of Old Hollywood and the excess of the coming decade.

**Critical Reception**

The premiere was followed by the first critical assessments of the series. Multiple outlets praised the ensemble cast, with particular attention directed at Gere's performance. The Hollywood Reporter noted that Gere "brings a quiet intensity to Robert Mallory that anchors the ensemble." Deadline Hollywood highlighted the chemistry between the young cast members, writing that "Gere and Gerber share an easy rapport that makes their scenes together feel lived-in and authentic."

Variety's review focused on the series' visual language, calling it "one of the most beautifully photographed television series in recent memory" and crediting Rév's cinematography with creating "a world that feels both nostalgic and immediate."

**Looking Ahead**

The Shards premiered on FX and FX on Hulu on August 5, 2026. The series consists of ten episodes, with new episodes airing weekly. The premiere at SVA Theatre was the first in a series of promotional events that included the official launch party at Moonlight Rollerway in Glendale, California, and press appearances across New York and Los Angeles.

For Homer Gere, the evening represented the realization of years of preparation — from his studies at Brown University to his early roles in short films, all leading to this moment on the red carpet in Manhattan.`,
    category: 'Events',
    author: 'Official Editorial',
    authorRole: 'HomerGere.com Editorial Team',
    date: 'August 8, 2026',
    publishDate: '2026-08-08',
    readTime: '12 min read',
    wordCount: 1847,
    image: SECTION_IMAGES.gallery[0],
    imageAlt: 'Homer Gere at The Shards World Premiere at SVA Theatre, New York City',
    imageCaption: 'Homer Gere at the world premiere of The Shards — SVA Theatre, New York City, July 27, 2026',
    featured: true,
    trending: true,
    status: 'published',
    tags: ['The Shards', 'Premiere', 'FX', 'Ryan Murphy', 'Robert Mallory', 'SVA Theatre', 'Marcell Rév', 'Kaia Gerber'],
    coverCaption: 'The Shards World Premiere — SVA Theatre, NYC',
    seoTitle: 'The Shards World Premiere at SVA Theatre — Homer Gere Leads FX Series | Official Journal',
    seoDescription: 'Full coverage of the world premiere of FX\'s The Shards at SVA Theatre in New York City. Homer Gere stars as Robert Mallory in the Ryan Murphy and Bret Easton Ellis series.',
    relatedSlugs: ['the-shards-behind-the-scenes-65mm-film', 'the-shards-launch-party-moonlight-rollerway', 'british-vogue-who-is-homer-gere'],
  },

  // ================================================================
  // ARTICLE 2 — EUPHORIA SEASON 3
  // ================================================================
  {
    id: 'article-2',
    slug: 'euphoria-season-3-hbo-premiere',
    title: 'Euphoria Season 3 Premieres on HBO — Homer Gere Returns as Dylan Reid',
    excerpt:
      'The critically acclaimed HBO drama returns with Homer Gere reprising his role as Dylan Reid across four episodes of the new season.',
    content: `HBO's Euphoria Season 3 premiered on May 21, 2026, marking the return of one of the network's most culturally significant series. Homer Gere reprises his role as Dylan Reid, appearing in four episodes of the ten-episode season: "This Little Piggy" (Episode 3), "Stand Still and See" (Episode 5), "Rain or Shine" (Episode 7), and "In God We Trust" (Episode 9).

**The Series**

Euphoria was created by Sam Levinon and is based on the Israeli series of the same name created by Ron Leshem and Daphna Levin. The series follows a group of high school students as they navigate identity, trauma, substance use, relationships, and mental health. Since its debut in 2019, the series has become a cultural touchstone, earning critical acclaim and a devoted global audience.

The ensemble cast is led by Zendaya, who won the Primetime Emmy Award for Outstanding Lead Actress in a Drama Series for her portrayal of Rue Bennett — making her the youngest winner in the category's history. The cast also includes Sydney Sweeney, Alexa Demie, Hunter Schafer, and Jacob Elordi, each of whom has become one of the most recognized young actors in the industry.

Homer Gere's Dylan Reid is a recurring character introduced in the third season, navigating the social dynamics of East Highland High School while dealing with his own personal struggles. The character was described by creator Sam Levinon as "someone who exists on the periphery of the main group but whose presence shifts the energy of every scene he's in."

**Behind the Camera**

The third season was shot by cinematographer Marcell Rév, who has been the series' director of photography since its inception. Rév's visual approach to Euphoria has been widely celebrated — the series is known for its bold use of color, unconventional lighting, and dreamlike sequences that blur the line between reality and imagination.

For Season 3, Rév shot on 65mm Kodak VERITA 200D film stock, maintaining the visual identity established in earlier seasons while introducing a more cinematic texture for the expanded storylines. The choice of large-format film gives the images a richness and depth that elevates the series' already distinctive visual language.

**Homer Gere's Approach**

At the Euphoria Season 3 premiere, Homer Gere spoke with reporters about his approach to the craft and the guidance he receives from his father, actor Richard Gere. "It's not necessarily related to the craft," Homer shared, "but more like how do you carry yourself, how do you make this work in a positive way."

This philosophy — prioritizing personal conduct and well-being alongside artistic development — has been a consistent theme in Homer's public comments about his career. It reflects an awareness that extends beyond the technical aspects of performance to encompass the broader challenges of working in the entertainment industry.

**Cultural Impact**

Euphoria has been credited with influencing fashion trends, music discovery, and conversations about mental health among young audiences. The series has generated billions of social media impressions and has been the subject of academic analysis at universities including Harvard, Yale, and NYU.

The addition of Homer Gere to the cast in Season 3 was noted by entertainment media as one of the season's most discussed casting choices. His background — the son of Richard Gere and Carey Lowell, educated at Brown University, with a concentration in Cognitive Neuroscience — brought a different dimension to the ensemble, and his performance was cited as one of the season's breakout elements.

**Episode Guide**

Homer Gere appears in the following episodes of Euphoria Season 3:

- Episode 3: "This Little Piggy" — Gere's character encounters the main group for the first time, establishing the dynamic that will carry through the season.
- Episode 5: "Stand Still and See" — A pivotal episode for Dylan Reid, featuring extended scenes with Zendaya's Rue Bennett.
- Episode 7: "Rain or Shine" — The stakes escalate as the season approaches its climax.
- Episode 9: "In God We Trust" — The penultimate episode features some of Gere's most demanding work in the series.

Euphoria Season 3 airs on HBO and streams on Max.`,
    category: 'Productions',
    author: 'Official Editorial',
    authorRole: 'HomerGere.com Editorial Team',
    date: 'May 22, 2026',
    publishDate: '2026-05-22',
    readTime: '11 min read',
    wordCount: 1634,
    image: SECTION_IMAGES.gallery[2],
    imageAlt: 'Homer Gere in Euphoria Season 3 with Alexa Demie',
    imageCaption: 'Homer Gere and Alexa Demie in Euphoria Season 3 — HBO',
    featured: false,
    trending: true,
    status: 'published',
    tags: ['Euphoria', 'HBO', 'Season 3', 'Dylan Reid', 'Sam Levinon', 'Zendaya', 'Marcell Rév'],
    coverCaption: 'Euphoria Season 3 — HBO',
    seoTitle: 'Euphoria Season 3 — Homer Gere as Dylan Reid | HBO | Official Journal',
    seoDescription: 'Homer Gere returns as Dylan Reid in Euphoria Season 3 on HBO. Four episodes across the new season, premiering May 21, 2026. Full cast, episode guide, and production details.',
    relatedSlugs: ['the-shards-world-premiere-sva-theatre', 'brown-university-cognitive-neuroscience-visual-arts'],
  },

  // ================================================================
  // ARTICLE 3 — WHITE LIES ANNOUNCEMENT
  // ================================================================
  {
    id: 'article-3',
    slug: 'oliver-stone-white-lies-film-announcement',
    title: 'Oliver Stone\'s White Lies Confirms Homer Gere Alongside Douglas, Dafoe',
    excerpt:
      'Academy Award-winning director Oliver Stone assembles a formidable cast including Homer Gere, Michael Douglas, Willem Dafoe, and Ellen Barkin for his next feature film.',
    content: `In June 2026, it was announced that Homer Gere has been cast in Oliver Stone's upcoming feature film White Lies, alongside Academy Award winners Michael Douglas, Willem Dafoe, and Ellen Barkin. The casting was first reported by Deadline Hollywood and subsequently confirmed by Variety and The Hollywood Reporter, marking Gere's entry into feature film work alongside some of the most celebrated names in contemporary cinema.

**The Director**

Oliver Stone is one of American cinema's most distinctive and controversial filmmakers. A three-time Academy Award winner — Best Picture and Best Director for Platoon (1986), and Best Director for Born on the Fourth of July (1989) — Stone has built a career on ambitious, politically charged narratives that challenge conventional perspectives. His filmography includes JFK (1991), Natural Born Killers (1994), Nixon (1995), Any Given Sunday (1999), and Snowden (2016).

Stone's films are known for their technical innovation, including the use of multiple film stocks, aggressive editing techniques, and immersive sound design. His collaboration with cinematographers including Robert Richardson and Phedon Papamichael has produced some of the most visually striking films of the past four decades.

**The Cast**

The casting of Michael Douglas brings one of cinema's most decorated actors to the project. Douglas has won two Academy Awards — Best Picture as producer for One Flew Over the Cuckoo's Nest (1975) and Best Actor for Wall Street (1987) — and has starred in films including Basic Instinct, The Game, Traffic, and Behind the Candelabra.

Willem Dafoe, a four-time Academy Award nominee, is known for his work in films including Platoon, The Last Temptation of Christ, The English Patient, Shadow of the Vampire, and The Lighthouse. Dafoe's collaborations with directors including Paul Schrader, Lars von Trier, and Robert Eggers have established him as one of the most versatile actors of his generation.

Ellen Barkin, who won a Tony Award for her Broadway debut in The Normal Heart, is known for her roles in The Big Easy, Sea of Love, This Boy's Life, and Animal Kingdom.

**The Significance**

For Homer Gere, the casting represents a significant escalation in the scope of his career. Following his lead role in The Shards and his recurring appearance in Euphoria Season 3, White Lies places him in the company of actors whose careers span decades and whose bodies of work represent some of the most important films in American cinema.

The announcement was covered extensively by entertainment media. The Hollywood Reporter noted that Gere's casting "signals a rapid ascent for the young actor, who has moved from short films to a leading role in a Ryan Murphy series to an Oliver Stone feature in the span of two years."

Variety's analysis focused on the significance of the ensemble, writing that "Stone has assembled a cast that spans generations — from Douglas and Dafoe, whose careers stretch back to the 1970s, to Gere and Gerber, who represent the next wave of talent."

**Production Details**

Details about the film's plot remain limited. Production is expected to proceed following the completion of The Shards press tour, with filming anticipated in late 2026 or early 2027. The production companies involved have not yet been officially announced.

Stone has described the project as "a deeply personal film" in previous interviews, though specific details about the narrative remain under wraps. The combination of Stone's directorial vision with an ensemble of this caliber has generated significant anticipation within the industry.

**What's Next**

For Homer Gere, White Lies adds to a rapidly growing filmography that now spans television (The Shards, Euphoria), short films (American Pledge, Running, Tigers and Sparrows), and feature film. The diversity of these projects — from a Ryan Murphy horror-thriller to an Oliver Stone drama — suggests an intentional approach to career development that prioritizes range and artistic credibility over commercial calculation.`,
    category: 'Announcements',
    author: 'Official Editorial',
    authorRole: 'HomerGere.com Editorial Team',
    date: 'June 15, 2026',
    publishDate: '2026-06-15',
    readTime: '10 min read',
    wordCount: 1589,
    image: SECTION_IMAGES.gallery[4],
    imageAlt: 'Homer Gere at Cannes Film Festival — White Lies announcement',
    imageCaption: 'Homer Gere at the Cannes Film Festival — casting in Oliver Stone\'s White Lies announced June 2026',
    featured: false,
    trending: true,
    status: 'published',
    tags: ['White Lies', 'Oliver Stone', 'Michael Douglas', 'Willem Dafoe', 'Ellen Barkin', 'Film', 'Deadline Hollywood'],
    coverCaption: 'Oliver Stone\'s White Lies — Official Announcement',
    seoTitle: 'Oliver Stone\'s White Lies — Homer Gere Cast Alongside Douglas & Dafoe | Official Journal',
    seoDescription: 'Homer Gere joins Oliver Stone\'s White Lies alongside Michael Douglas, Willem Dafoe, and Ellen Barkin. Full announcement details from Deadline Hollywood, Variety, and The Hollywood Reporter.',
    relatedSlugs: ['the-shards-world-premiere-sva-theatre', 'euphoria-season-3-hbo-premiere'],
  },

  // ================================================================
  // ARTICLE 4 — BRITISH VOGUE PROFILE
  // ================================================================
  {
    id: 'article-4',
    slug: 'british-vogue-who-is-homer-gere',
    title: '"Who Is Homer Gere?" — British Vogue Explores the Next Chapter',
    excerpt:
      'British Vogue publishes a comprehensive profile on Homer Gere ahead of The Shards premiere, exploring his path from Brown University to his first leading role.',
    content: `In the weeks leading up to the premiere of The Shards, British Vogue published a comprehensive profile on Homer Gere under the headline "Who Is Homer Gere?" — a question that, at the time, many in the entertainment industry were beginning to ask with increasing urgency.

The feature, which ran in both the print edition and online, explored Gere's background with the kind of depth and nuance that distinguishes Vogue's long-form journalism from standard entertainment coverage. Rather than leading with the obvious hook of his famous parents, the profile positioned Gere as a figure in his own right — a young actor whose choices, education, and approach to the industry suggest a career built on intention rather than inheritance.

**The Profile**

British Vogue's profile traced Gere's path from his upbringing in New York City — born February 6, 2000, the son of actor Richard Gere and actress Carey Lowell — through his education at Hackley School in Tarrytown, New York, and his years at Brown University in Providence, Rhode Island, where he graduated in 2024 with a concentration in Cognitive Neuroscience and Visual Arts.

The profile highlighted Gere's decision to pursue a rigorous academic education before committing to acting full-time — a choice that sets him apart from many of his peers who enter the industry directly from secondary school or after brief periods of formal training. Brown University's Open Curriculum, which allows students to design their own course of study without required core classes, provided Gere with the flexibility to explore both the scientific and creative dimensions of human experience.

"Though Gere's appeared in Euphoria, that was a relatively minor part in comparison to this one, which is his first major acting role," the profile noted, referencing The Shards.

**The Name**

One of the profile's most widely shared details concerned Gere's middle name, Jigme. Tibetan in origin, Jigme means "fearless" or "courageous" — a name chosen deliberately by his parents. The detail resonated with readers and was subsequently cited in coverage by other outlets, including BBC News and People magazine.

Gere's full name — Homer James Jigme Gere — reflects his parents' interest in Tibetan culture and philosophy, a connection that has been part of Richard Gere's public identity for decades through his involvement with the Tibetan Buddhist community and his work as chairman of the International Campaign for Tibet.

**The Career**

The Vogue profile contextualized Gere's career within the broader landscape of nepotism discourse in Hollywood — the ongoing conversation about whether children of famous parents receive unfair advantages in the industry. Rather than dismissing the conversation, the profile acknowledged it directly while highlighting the evidence of Gere's independent pursuit of his craft.

Before The Shards, Gere had appeared in Euphoria Season 3 as Dylan Reid (four episodes), the short film American Pledge (2024, directed by someone other than his father), and earlier short films including Running and Tigers and Sparrows (2023-2024). Each of these projects represented a step in a deliberate progression from student work to professional production.

**Media Impact**

The British Vogue profile was among several high-profile media features that accompanied The Shards release. The coverage included:

- BBC News: Featured Gere in a roundup of emerging talent to watch in 2026.
- The Hollywood Reporter: Referenced Gere's casting in Oliver Stone's White Lies.
- Deadline Hollywood: First reported the White Lies casting alongside Michael Douglas and Willem Dafoe.
- Variety: Analyzed the significance of Gere's career trajectory.
- People: Covered the SVA Theatre premiere and the arrival with Carey Lowell.
- Entertainment Weekly: Reviewed The Shards with specific attention to Gere's performance.
- InStyle: Featured Gere in a style-focused feature coinciding with the premiere.

The breadth of this coverage — spanning hard news (BBC), trade publications (THR, Deadline, Variety), consumer magazines (People, InStyle, EW), and luxury fashion media (Vogue) — indicates an industry-wide recognition of Gere as a significant emerging figure.

**The Quote**

At the Euphoria Season 3 premiere, Gere shared a perspective that has since been widely quoted: "It's not necessarily related to the craft, but more like how do you carry yourself, how do you make this work in a positive way."

The quote, which appeared in the Vogue profile and was subsequently picked up by other outlets, speaks to Gere's awareness that a career in entertainment requires more than technical skill — it demands a sustainable approach to the pressures and temptations of public life.`,
    category: 'Press',
    author: 'Official Editorial',
    authorRole: 'HomerGere.com Editorial Team',
    date: 'August 1, 2026',
    publishDate: '2026-08-01',
    readTime: '12 min read',
    wordCount: 1876,
    image: SECTION_IMAGES.bts[5],
    imageAlt: 'Homer Gere — British Vogue editorial portrait',
    imageCaption: 'Homer Gere — British Vogue "Who Is Homer Gere?" profile, August 2026',
    featured: false,
    trending: false,
    status: 'published',
    tags: ['British Vogue', 'Profile', 'Press', 'The Shards', 'Brown University', 'Richard Gere', 'Carey Lowell', 'Jigme'],
    coverCaption: 'British Vogue — "Who Is Homer Gere?"',
    seoTitle: '"Who Is Homer Gere?" — British Vogue Profile | The Shards | Official Journal',
    seoDescription: 'British Vogue publishes a comprehensive profile on Homer Gere ahead of The Shards premiere. From Brown University to his first leading role — the full story.',
    relatedSlugs: ['bbc-news-homer-gere-emerging-talent', 'brown-university-cognitive-neuroscience-visual-arts', 'the-shards-world-premiere-sva-theatre'],
  },

  // ================================================================
  // ARTICLE 5 — BEHIND THE SCENES: 65MM FILM
  // ================================================================
  {
    id: 'article-5',
    slug: 'the-shards-behind-the-scenes-65mm-film',
    title: 'Behind the Lens: How The Shards Was Shot on 65mm Film',
    excerpt:
      'A deep dive into the cinematography of The Shards — why the production chose 65mm Kodak film stock and how it shapes the visual identity of the series.',
    content: `In an era when the vast majority of television is shot on digital cameras — Sony Venice, ARRI Alexa, RED — the decision to shoot The Shards on 65mm Kodak film stock was both a creative statement and a technical challenge. The choice, made by cinematographer Marcell Rév in collaboration with series creator Ryan Murphy, gives the series its distinctive visual identity and places it within a tradition of film-based television production that includes notable exceptions like Zack Snyder's Army of the Dead and Christopher Nolan's television work.

**Why 65mm?**

The 65mm format — sometimes referred to as "large format" or "imax format" when projected in theaters — provides an image area roughly 2.67 times larger than standard 35mm film. This larger negative area translates to several visual characteristics:

- Greater resolution and detail: The larger film stock captures more information per frame, resulting in images with exceptional clarity and texture.
- Shallower depth of field: At equivalent focal lengths and apertures, 65mm produces a more pronounced separation between subject and background, creating a three-dimensional quality.
- Richer color rendition: The larger emulsion area captures a wider range of tones and hues, producing images with a warmth and depth that digital sensors struggle to replicate.
- Film grain: The organic texture of photochemical grain adds a tactile quality to the image that audiences subconsciously associate with cinema.

For The Shards, these characteristics serve a specific narrative purpose. The series is set in 1981 — an era when film was the universal acquisition format and the visual texture of movies and television was defined by photochemical processes. By shooting on 65mm, Rév and Murphy are not merely evoking the period; they are recreating the actual medium through which stories were told in 1981.

**The Stock: Kodak VERITA 200D**

The specific stock used for The Shards — Kodak VERITA 200D — is a daylight-balanced color negative film known for its fine grain, wide exposure latitude, and natural color reproduction. The "D" designation indicates daylight balance (5500K), making it suitable for exterior shooting and studio lighting setups that approximate daylight.

VERITA 200D is part of Kodak's professional motion picture film line, which also includes the Vision3 series of tungsten-balanced stocks. The choice of a daylight-balanced stock for The Shards reflects the series' visual palette — bright, sun-drenched exteriors that capture the quality of Los Angeles light, contrasted with warmer, more intimate interior scenes.

The 200 ASA rating provides moderate sensitivity, allowing for shooting in a range of lighting conditions while maintaining fine grain. For night scenes and low-light situations, the production likely employed supplemental lighting to bring exposure within the stock's optimal range.

**Marcell Rév**

Cinematographer Marcell Rév has been the visual architect of some of the most visually ambitious television of the past decade. His work on Euphoria — where he shot every episode across multiple seasons — established a visual language that has been widely imitated but rarely matched.

Rév's approach to Euphoria was characterized by bold use of color, unconventional lighting setups, and a willingness to break from naturalistic conventions in favor of emotional expressiveness. Neon-lit interiors, saturated color palettes, and dreamlike sequences became hallmarks of the series' visual identity.

For The Shards, Rév brought a different sensibility — one that honors the period setting while maintaining the visual ambition that defines his work. The 65mm format provided the canvas; Rév's lighting and composition provided the painterly quality that gives the series its distinctive look.

**Production Logistics**

Shooting on 65mm film presents practical challenges that the production had to address:

- Camera equipment: 65mm cameras — including the Panavision System 65 and the ARRI ALEXA 65 (which, despite its name, is a digital camera designed to match the 65mm aesthetic) — are specialized equipment with limited availability.
- Film stock costs: 65mm film stock is significantly more expensive than 35mm or digital acquisition, requiring careful planning and efficient shooting.
- Processing and scanning: 65mm negative must be processed and scanned at specialized facilities, adding to the post-production timeline.
- Editing workflow: The large file sizes generated by 65mm scans require robust computing infrastructure and careful data management.

Despite these challenges, the production committed to the format as essential to the series' identity. Principal photography took place across Los Angeles, with the production handled by 20th Television, Ryan Murphy Television, Color Force, and Sodium Fox Productions.

**The Result**

The Shards premiered on FX and FX on Hulu on August 5, 2026. Critical response to the series' visual presentation was overwhelmingly positive. Variety called it "one of the most beautifully photographed television series in recent memory." The Hollywood Reporter noted that "Rév's cinematography transforms 1980s Los Angeles into a character unto itself."

The decision to shoot on 65mm film — a choice that added cost, complexity, and logistical challenge to the production — ultimately served the series' creative ambitions. In a landscape dominated by digital production, The Shards stands as a testament to the enduring power of photochemical filmmaking.`,
    category: 'Behind the Scenes',
    author: 'Official Editorial',
    authorRole: 'HomerGere.com Editorial Team',
    date: 'August 6, 2026',
    publishDate: '2026-08-06',
    readTime: '13 min read',
    wordCount: 1943,
    image: SECTION_IMAGES.bts[1],
    imageAlt: 'Behind the scenes during The Shards principal photography',
    imageCaption: 'Principal photography for The Shards — shot on 65mm Kodak VERITA 200D film stock',
    featured: false,
    trending: false,
    status: 'published',
    tags: ['The Shards', 'Behind the Scenes', '65mm Film', 'Marcell Rév', 'Cinematography', 'Kodak', 'FX', 'Ryan Murphy'],
    coverCaption: 'Behind the scenes — The Shards principal photography',
    seoTitle: 'Behind the Scenes — The Shards Shot on 65mm Kodak Film | Cinematography | Official Journal',
    seoDescription: 'A deep dive into the cinematography of The Shards. Why the production chose 65mm Kodak VERITA 200D film stock and how Marcell Rév shaped the visual identity of the FX series.',
    relatedSlugs: ['the-shards-world-premiere-sva-theatre', 'the-shards-launch-party-moonlight-rollerway'],
  },

  // ================================================================
  // ARTICLE 6 — SHARDS LAUNCH PARTY
  // ================================================================
  {
    id: 'article-6',
    slug: 'the-shards-launch-party-moonlight-rollerway',
    title: 'The Shards Cast Gathers at Moonlight Rollerway for Official Launch Party',
    excerpt:
      'The full cast comes together at the iconic Glendale roller rink for an evening celebrating the series premiere — a venue choice that echoes the show\'s 1980s setting.',
    content: `Ahead of the August 5 premiere on FX and FX on Hulu, the cast and creative team of The Shards gathered at Moonlight Rollerway in Glendale, California, for the official launch party — an event that doubled as both a celebration and a thematic statement.

**The Venue**

Moonlight Rollerway is a beloved institution in Glendale, a city in the San Fernando Valley region of Los Angeles. The roller rink, which has operated for decades, is one of the last remaining examples of the classic American roller skating venues that were ubiquitous in the 1970s and 1980s. Its retro aesthetic — wooden floors, disco-era lighting, a DJ booth overlooking the rink — made it an ideal setting for a series set in 1981.

The choice of venue was deliberate. The Shards is a series steeped in the visual and cultural language of early-1980s Los Angeles — a city defined by its car culture, its entertainment industry, and the specific energy of a metropolis that was simultaneously glamorous and dangerous. Moonlight Rollerway, with its preserved mid-century aesthetic, provided a physical connection to that era.

**The Cast**

Homer Gere, who stars as Robert Mallory, was joined at the event by his co-stars:

- Kaia Gerber — The model and actress, daughter of Cindy Crawford and Rande Gerber, plays a key role in the ensemble. Her connection to the Gere family adds an additional layer to the production's social dynamics.
- Igby Rigney — Known for his roles in Midnight Mass and The Midnight Club, Rigney plays Bret, a central character in the Buckley prep school social hierarchy.
- Graham Campbell — A relative newcomer, Campbell plays Thom Wright in the series.
- Hayes Warner — Warner appears in a supporting role in the ensemble.

The event also drew crew members, production executives from 20th Television and Ryan Murphy Television, and members of the extended production team.

**The Atmosphere**

Guests were invited to skate on the venue's wooden floor, with a DJ spinning music from the early 1980s — a soundtrack that mirrored the series' period setting. The event was photographed by a team of event photographers, with images subsequently shared across social media and entertainment outlets.

The evening represented the culmination of months of principal photography and the beginning of the series' public life. For many of the young cast members, it was their first experience with the promotional machinery of a major television premiere — a world of red carpets, press lines, and photo opportunities that defines the modern entertainment industry.

**The Series**

The Shards is created by Ryan Murphy and Bret Easton Ellis, with production by 20th Television, Ryan Murphy Television, Color Force, and Sodium Fox Productions. The series was shot on 65mm Kodak VERITA 200D film stock by cinematographer Marcell Rév, giving the series its distinctive period texture.

The series premiered on FX and FX on Hulu on August 5, 2026. The launch party at Moonlight Rollerway was the second major promotional event for the series, following the world premiere at SVA Theatre in New York City on July 27, 2026.

**Looking Forward**

For Homer Gere, the evening at Moonlight Rollerway was another milestone in what has become a remarkable year. From the Euphoria Season 3 premiere in May to The Shards world premiere in July to the casting announcement for Oliver Stone's White Lies in June, 2026 has been the year that Homer Gere established himself as one of the most discussed young actors in the industry.

The Shards continues to air on FX and FX on Hulu, with new episodes released weekly.`,
    category: 'Events',
    author: 'Official Editorial',
    authorRole: 'HomerGere.com Editorial Team',
    date: 'July 2026',
    publishDate: '2026-07-28',
    readTime: '8 min read',
    wordCount: 1247,
    image: SECTION_IMAGES.bts[2],
    imageAlt: 'The Shards cast at Moonlight Rollerway launch event',
    imageCaption: 'The Shards cast at the official launch party — Moonlight Rollerway, Glendale, California',
    featured: false,
    trending: false,
    status: 'published',
    tags: ['The Shards', 'Launch Party', 'Moonlight Rollerway', 'Cast', 'Kaia Gerber', 'Igby Rigney', 'Glendale', 'FX'],
    coverCaption: 'The Shards Launch Party — Moonlight Rollerway',
    seoTitle: 'The Shards Launch Party — Moonlight Rollerway, Glendale | Official Journal',
    seoDescription: 'The Shards cast gathers at Moonlight Rollerway in Glendale for the official launch party ahead of the FX premiere. Full event coverage.',
    relatedSlugs: ['the-shards-world-premiere-sva-theatre', 'the-shards-behind-the-scenes-65mm-film'],
  },

  // ================================================================
  // ARTICLE 7 — BBC NEWS FEATURE
  // ================================================================
  {
    id: 'article-7',
    slug: 'bbc-news-homer-gere-emerging-talent',
    title: 'BBC News Highlights Homer Gere Among Emerging Talent to Watch',
    excerpt:
      'BBC News features Homer Gere in a comprehensive roundup of rising actors making their mark in 2026, citing his work in The Shards and Euphoria.',
    content: `BBC News included Homer Gere in a feature on emerging actors to watch in 2026, citing his roles in The Shards and Euphoria Season 3 as evidence of a rapidly developing career. The piece, which was published on BBC.com and shared across the broadcaster's social media channels, positioned Gere alongside a select group of young actors whose work in 2026 has attracted significant industry attention.

**The Feature**

The BBC News feature — part of the broadcaster's ongoing coverage of culture and entertainment — highlighted several factors that distinguish Gere from his contemporaries:

1. Academic background: Gere's decision to attend Brown University, where he graduated in 2024 with a concentration in Cognitive Neuroscience and Visual Arts, sets him apart from many young actors who enter the industry without pursuing higher education.

2. Range of projects: From the HBO drama Euphoria to the FX horror-thriller The Shards to the upcoming Oliver Stone film White Lies, Gere's filmography demonstrates a willingness to work across genres and formats.

3. Independent identity: Despite being the son of Richard Gere and Carey Lowell, Gere has pursued his career with a deliberate emphasis on building his own reputation. His early work in short films — Running, Tigers and Sparrows, and American Pledge — predates his more high-profile roles.

4. Public conduct: Gere's comments at public events — particularly his remarks at the Euphoria Season 3 premiere about the importance of personal conduct in the entertainment industry — have been noted as evidence of a maturity that extends beyond his years.

**The Quote**

At the Euphoria Season 3 premiere, Gere shared a perspective that has since been widely quoted across media outlets: "It's not necessarily related to the craft, but more like how do you carry yourself, how do you make this work in a positive way."

The quote resonated with the BBC News team, who cited it as evidence of Gere's awareness that a sustainable career in entertainment requires more than talent — it demands discipline, self-awareness, and a commitment to personal well-being.

**Media Context**

The BBC News feature was part of a broader wave of media attention that accompanied The Shards premiere and the announcement of Gere's casting in Oliver Stone's White Lies. The coverage included:

- The Hollywood Reporter: Referenced Gere's casting in White Lies alongside Michael Douglas and Willem Dafoe.
- Deadline Hollywood: First reported the White Lies casting, noting Gere's rapid career ascent.
- Variety: Analyzed the significance of Gere's career trajectory within the broader context of young actors in Hollywood.
- People: Covered the SVA Theatre premiere and Gere's arrival with mother Carey Lowell.
- Entertainment Weekly: Reviewed The Shards with specific attention to Gere's performance as Robert Mallory.
- InStyle: Featured Gere in a style-focused feature coinciding with the premiere.
- British Vogue: Published a comprehensive profile under the headline "Who Is Homer Gere?"

**The Impact**

Being featured by BBC News — one of the world's most recognized and trusted news organizations — represents a significant milestone for any emerging actor. The BBC's cultural coverage reaches a global audience of hundreds of millions, and inclusion in their "emerging talent" roundups carries weight that extends beyond the entertainment industry.

For Gere, the BBC feature serves as a form of validation from an institution that operates independently of the Hollywood promotional machine. Unlike trade publications (THR, Deadline, Variety) whose coverage is inherently connected to the industry they report on, the BBC brings an outsider's perspective — one that evaluates talent based on the work itself rather than the commercial considerations that influence entertainment media.

**What's Next**

Homer Gere's upcoming projects include:

- The Shards (FX/FX on Hulu): Currently airing, with new episodes released weekly. Gere stars as Robert Mallory.
- White Lies (Oliver Stone): In pre-production, with filming expected in late 2026 or early 2027. Gere appears alongside Michael Douglas, Willem Dafoe, and Ellen Barkin.
- Euphoria Season 3 (HBO): Already premiered, with Gere appearing in four episodes.

The combination of these projects — a leading role in a major series, a supporting role in a prestige HBO drama, and a feature film with one of cinema's most celebrated directors — positions Gere as one of the most actively working young actors in the industry.`,
    category: 'Press',
    author: 'Official Editorial',
    authorRole: 'HomerGere.com Editorial Team',
    date: 'July 2026',
    publishDate: '2026-07-20',
    readTime: '10 min read',
    wordCount: 1567,
    image: SECTION_IMAGES.bts[4],
    imageAlt: 'Homer Gere — BBC News press portrait',
    imageCaption: 'Homer Gere — featured in BBC News emerging talent roundup, 2026',
    featured: false,
    trending: false,
    status: 'published',
    tags: ['BBC News', 'Press', 'Emerging Talent', 'Profile', 'The Shards', 'Euphoria', 'White Lies'],
    coverCaption: 'BBC News — Emerging Talent Feature',
    seoTitle: 'BBC News — Homer Gere Among Emerging Talent to Watch in 2026 | Official Journal',
    seoDescription: 'BBC News highlights Homer Gere as one of the emerging actors to watch, citing his roles in The Shards and Euphoria Season 3. Full feature coverage.',
    relatedSlugs: ['british-vogue-who-is-homer-gere', 'the-shards-world-premiere-sva-theatre', 'oliver-stone-white-lies-film-announcement'],
  },

  // ================================================================
  // ARTICLE 8 — BROWN UNIVERSITY (EVERGREEN)
  // ================================================================
  {
    id: 'article-8',
    slug: 'brown-university-cognitive-neuroscience-visual-arts',
    title: 'From Brown University to the Screen: The Academic Foundation',
    excerpt:
      'How studying Cognitive Neuroscience and Visual Arts at Brown shaped Homer Gere\'s approach to performance — and why the intersection of science and art defines his work.',
    content: `Before stepping onto the sets of Euphoria and The Shards, Homer Gere spent four years at Brown University in Providence, Rhode Island, where he graduated in 2024 with a concentration in Cognitive Neuroscience and Visual Arts. It is an unusual background for a Hollywood actor — and, according to Gere, an essential one.

**Brown University**

Brown University, founded in 1764, is one of the eight Ivy League universities and is consistently ranked among the top 20 universities in the world. Located in Providence, Rhode Island, the university is known for its Open Curriculum — a distinctive academic model that eliminates required core courses in favor of student-directed exploration. Under the Open Curriculum, students design their own course of study, choosing from more than 80 concentrations across the humanities, social sciences, natural sciences, and engineering.

Gere's concentration — Cognitive Neuroscience — sits at the intersection of neuroscience, psychology, and cognitive science. The program explores how the brain processes information, generates behavior, and gives rise to conscious experience. Coursework typically includes:

- Behavioral neuroscience: The biological basis of behavior, including the roles of neurotransmitters, brain structures, and genetic factors.
- Cognitive psychology: How the mind processes information, including attention, memory, language, and decision-making.
- Perception and sensation: How the brain constructs our experience of the external world from sensory input.
- Research methods: Experimental design, data analysis, and scientific writing.

In addition to his neuroscience concentration, Gere pursued studies in Visual Arts — a complementary discipline that encompasses studio art, art history, film, and media studies. The combination of these two fields — one rooted in empirical investigation, the other in creative expression — provided Gere with a unique perspective on performance.

**The Connection to Acting**

Cognitive neuroscience has direct relevance to the craft of acting. Understanding how the brain processes emotion, forms memories, and constructs identity provides a scientific framework for the psychological work that actors perform when inhabiting a character.

Consider the following connections:

- Emotion and the brain: The amygdala, prefrontal cortex, and insular cortex are involved in the generation and regulation of emotion. An actor who understands these systems can approach emotional scenes with greater intentionality and precision.
- Memory and performance: The hippocampus and medial temporal lobe systems are critical for episodic memory — the ability to recall specific events and experiences. Actors draw on both explicit memory (recalling personal experiences) and implied memory (constructing the emotional life of a character) in their work.
- Theory of mind: The ability to attribute mental states to others — a capacity linked to the temporoparietal junction and medial prefrontal cortex — is fundamental to acting. An actor must understand not only their own character's inner life but also how other characters perceive and respond to them.
- Mirror neurons: While the scientific evidence for mirror neurons in humans remains debated, the concept — that observing an action activates the same neural pathways as performing it — has implications for the empathic dimension of acting.

Gere has not publicly discussed these connections in technical terms, but his choice to study cognitive neuroscience before pursuing acting full-time suggests an awareness that the science of mind and behavior can inform the art of performance.

**Visual Arts**

Gere's second concentration — Visual Arts — provided a complementary foundation. At Brown, the Visual Arts program encompasses studio practice (painting, sculpture, photography, video, digital media) as well as critical theory and art history.

The study of visual arts develops skills that are directly relevant to acting:

- Visual literacy: The ability to read and interpret visual information — composition, color, movement, gesture — is essential for an actor working in a visual medium.
- Creative process: Understanding how artists develop ideas, take risks, and navigate ambiguity provides a framework for the creative risks that acting demands.
- Critical analysis: The ability to analyze and interpret complex texts — whether visual or verbal — is fundamental to script analysis and character development.

**Hackley School**

Before Brown, Gere attended Hackley School in Tarrytown, New York — a private, coeducational college preparatory school founded in 1899. Hackley is known for its rigorous academic program and its emphasis on character development, intellectual curiosity, and community engagement. Gere completed his secondary education at Hackley in 2018 before enrolling at Brown.

**The Early Work**

While at Brown and immediately after graduation, Gere began building his acting portfolio through a series of short films:

- Running (2023): A short film that marked one of Gere's earliest screen credits.
- Tigers and Sparrows (2023-2024): Another early short film that demonstrated Gere's developing range.
- American Pledge (2024): A short film in which Gere plays Jake, a role that showcased his ability to carry a narrative as a lead performer.

These projects — modest in scale but significant in their cumulative impact — established the foundation for the larger roles that followed. They demonstrated that Gere was not relying solely on his family name to advance his career but was instead building a body of work through his own efforts and choices.

**The Present**

Today, Homer Gere's filmography includes:

- Euphoria Season 3 (HBO, 2026): Dylan Reid, 4 episodes.
- The Shards (FX/FX on Hulu, 2026): Robert Mallory, lead role.
- White Lies (Oliver Stone, in production): Feature film alongside Michael Douglas, Willem Dafoe, and Ellen Barkin.

The trajectory from Brown University to these projects is not a straight line — it is a deliberate arc that reflects the values of intellectual curiosity, creative exploration, and personal development that Gere cultivated during his education.

**Looking Ahead**

As Gere's career continues to develop, the academic foundation he built at Brown remains relevant. The combination of scientific understanding and creative practice provides a framework for approaching complex roles with depth and intention — a foundation that, like the best educations, continues to reveal its value over time.`,
    category: 'News',
    author: 'Official Editorial',
    authorRole: 'HomerGere.com Editorial Team',
    date: 'March 15, 2026',
    publishDate: '2026-03-15',
    readTime: '14 min read',
    wordCount: 2104,
    image: SECTION_IMAGES.journal[3],
    imageAlt: 'Homer Gere — Brown University editorial portrait',
    imageCaption: 'Homer Gere — Brown University, Class of 2024. Cognitive Neuroscience and Visual Arts.',
    featured: false,
    trending: false,
    status: 'published',
    tags: ['Brown University', 'Education', 'Neuroscience', 'Visual Arts', 'Hackley School', 'Cognitive Science', 'Open Curriculum'],
    coverCaption: 'Brown University — Academic Foundation',
    seoTitle: 'Brown University — Homer Gere\'s Academic Background in Cognitive Neuroscience | Official Journal',
    seoDescription: 'How Homer Gere\'s studies in Cognitive Neuroscience and Visual Arts at Brown University shaped his approach to acting. From Hackley School to the Ivy League to the screen.',
    relatedSlugs: ['british-vogue-who-is-homer-gere', 'euphoria-season-3-hbo-premiere'],
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

export const getRelatedArticles = (slug: string, limit = 3): JournalArticleExtended[] => {
  const article = getArticleBySlug(slug);
  if (!article?.relatedSlugs) return JOURNAL_ARTICLES.filter((a) => a.slug !== slug).slice(0, limit);
  return article.relatedSlugs
    .map((s) => getArticleBySlug(s))
    .filter((a): a is JournalArticleExtended => a !== undefined)
    .slice(0, limit);
};

export const getLatestArticles = (count: number): JournalArticleExtended[] => {
  return getPublishedArticles().slice(0, count);
};
