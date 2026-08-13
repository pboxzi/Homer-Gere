import heroPortrait from '../assets/images/homer_hero_seamless_1786536544305.jpg';
import heroComposed from '../assets/images/homer_hero_composed_1786536716240.jpg';
import heroPortraitClean from '../assets/images/homer_hero_portrait_1786535654153.jpg';
import heroCleanBanner from '../assets/images/homer_hero_text_clean_1786537167258.jpg';
import heroSplitBanner from '../assets/images/homer_hero_cinematic_banner_1786536922905.jpg';
import homerBrightLuxuryEditorial from '../assets/images/homer_bright_luxury_editorial_1786538711966.jpg';
import homerPurePhotorealisticPortrait from '../assets/images/homer_pure_photorealistic_portrait_1786538895660.jpg';
import homerGqLifestyleStudio from '../assets/images/homer_gq_lifestyle_studio_1786539137760.jpg';
import shardsBanner from '../assets/images/homer_shards_banner_1786535665393.jpg';
import journalOnset from '../assets/images/homer_journal_onset_1786535677128.jpg';
import journalPortrait from '../assets/images/homer_journal_portrait_1786535686554.jpg';
import bwInterview from '../assets/images/homer_bw_interview_1786535701693.jpg';
import roadChasing from '../assets/images/homer_road_chasing_1786535714161.jpg';
import gallerySuit from '../assets/images/homer_gallery_suit_1786535723951.jpg';
import galleryCafe from '../assets/images/homer_gallery_cafe_1786535734949.jpg';

// Real editorial photos from public sources
import shardsPremiereCast from '../assets/images/real/shards-premiere-cast.jpg';
import shardsLaunchSkate from '../assets/images/real/shards-launch-skate.jpg';
import shardsRobertMallory from '../assets/images/real/shards-robert-mallory.jpg';
import shardsEpisodeScene from '../assets/images/real/shards-episode-scene.jpg';
import euphoriaEpisodeScene from '../assets/images/real/euphoria-episode-scene.jpg';
import shardsPremiereCarey from '../assets/images/real/shards-premiere-carey.jpg';
import cannesRedCarpet from '../assets/images/real/cannes-red-carpet.jpg';
import disneyUpfrontCast from '../assets/images/real/disney-upfront-cast.jpg';
import agencyPremiereMoma from '../assets/images/real/agency-premiere-moma.jpg';
import veniceFilmFestival from '../assets/images/real/venice-film-festival.jpg';

export const IMAGES = {
  heroPortrait,
  heroComposed,
  heroPortraitClean,
  heroCleanBanner,
  heroSplitBanner,
  homerBrightLuxuryEditorial,
  homerPurePhotorealisticPortrait,
  homerGqLifestyleStudio,
  shardsBanner,
  journalOnset,
  journalPortrait,
  bwInterview,
  roadChasing,
  gallerySuit,
  galleryCafe,
  shardsPremiereCast,
  shardsLaunchSkate,
  shardsRobertMallory,
  shardsEpisodeScene,
  euphoriaEpisodeScene,
  shardsPremiereCarey,
  cannesRedCarpet,
  disneyUpfrontCast,
  agencyPremiereMoma,
  veniceFilmFestival,
};

// Section-specific image mappings — each image used ONCE per section
export const SECTION_IMAGES = {
  hero: {
    homepage: homerGqLifestyleStudio,
    journey: homerBrightLuxuryEditorial,
    projects: shardsPremiereCast,
  },
  journal: [
    journalOnset,
    journalPortrait,
    bwInterview,
    roadChasing,
  ],
  gallery: [
    shardsPremiereCast,
    shardsRobertMallory,
    euphoriaEpisodeScene,
    disneyUpfrontCast,
    cannesRedCarpet,
    agencyPremiereMoma,
  ],
  bts: [
    shardsPremiereCarey,
    shardsEpisodeScene,
    shardsLaunchSkate,
    veniceFilmFestival,
    journalOnset,
    journalPortrait,
    bwInterview,
    homerGqLifestyleStudio,
  ],
  filmography: {
    whiteLies: cannesRedCarpet,
    theShards: shardsPremiereCast,
    euphoria: euphoriaEpisodeScene,
    shortFilms: journalPortrait,
  },
  highlights: {
    euphoriaDebut: euphoriaEpisodeScene,
    firstLeadRole: shardsPremiereCast,
    whiteLies: cannesRedCarpet,
    brownUniversity: homerGqLifestyleStudio,
  },
  exploreMore: {
    projects: shardsPremiereCast,
    journal: journalOnset,
    gallery: shardsRobertMallory,
    press: bwInterview,
    contact: bwInterview,
  },
  media: {
    hero: bwInterview,
    featured: shardsPremiereCast,
  },
};

// Media item image mappings — each thumbnail matches the actual content
export const MEDIA_IMAGES = {
  // Videos — thumbnails match the actual event/interview
  'the-shards-official-trailer': shardsPremiereCast,
  'vogue-september-cover-kaia-homer': homerBrightLuxuryEditorial,
  'variety-full-interview': bwInterview,
  'et-euphoria-premiere': agencyPremiereMoma,
  'gma-shards-advice': shardsRobertMallory,
  'people-richard-gere-emotional': shardsPremiereCarey,
  'euphoria-s3-premiere': agencyPremiereMoma,
  'the-shards-premiere-nyc': shardsPremiereCast,
  'the-shards-launch-party': shardsLaunchSkate,
  'cannes-2024': cannesRedCarpet,
  'e-news-richard-gere-reacts': veniceFilmFestival,
  'itn-shards-cast-interview': disneyUpfrontCast,
  'awards-buzz-cast-interview': shardsEpisodeScene,

  // Podcasts — cover art matches the show/interview context
  'the-shards-official-podcast': shardsEpisodeScene,
  'vogue-run-through-podcast': homerBrightLuxuryEditorial,
  'et-interview-homer': journalOnset,
  'extra-richard-gere-homer': shardsPremiereCarey,
  'who-weekly-podcast': journalPortrait,
  'spreaker-page-six': bwInterview,

  // Press — images match the publication/event context
  'press-vogue-september': homerBrightLuxuryEditorial,
  'press-people-scientist': shardsPremiereCast,
  'press-british-vogue': homerGqLifestyleStudio,
  'press-ew-shards': shardsPremiereCast,
  'press-variety-stone': cannesRedCarpet,
  'press-hollywoodReporter-gere': shardsPremiereCarey,
  'press-upi-shards': shardsRobertMallory,
  'press-scmp': euphoriaEpisodeScene,
  'press-vogue-premiere': shardsPremiereCast,
  'press-cnn-family': disneyUpfrontCast,
  'press-deadline-shards': shardsPremiereCast,
  'press-bbc-euphoria': euphoriaEpisodeScene,
};

// Project-specific image mappings for detail pages
export const PROJECT_IMAGES = {
  'the-shards': {
    hero: shardsPremiereCast,
    character: shardsRobertMallory,
    poster: shardsPremiereCast,
    gallery: [
      { src: shardsPremiereCast, alt: 'The Shards World Premiere at SVA Theatre — Full Cast' },
      { src: shardsRobertMallory, alt: 'Homer Gere as Robert Mallory — Official Character Still' },
      { src: shardsEpisodeScene, alt: 'Behind the scenes during principal photography' },
      { src: shardsLaunchSkate, alt: 'The Shards launch party at Moonlight Rollerway' },
      { src: shardsPremiereCarey, alt: 'Homer Gere with mother Carey Lowell at The Shards premiere' },
      { src: disneyUpfrontCast, alt: 'The Shards cast at Disney+ Upfront Presentation' },
    ],
    cast: {
      homerGere: shardsPremiereCast,
      igbyRigney: agencyPremiereMoma,
      kaiaGerber: cannesRedCarpet,
      hayesWarner: shardsLaunchSkate,
      grahamCampbell: shardsEpisodeScene,
      wesBentley: veniceFilmFestival,
      evanRachelWood: disneyUpfrontCast,
    },
  },
  'euphoria': {
    hero: euphoriaEpisodeScene,
    character: euphoriaEpisodeScene,
    poster: euphoriaEpisodeScene,
    gallery: [
      { src: euphoriaEpisodeScene, alt: 'Homer Gere and Alexa Demie in Euphoria Season 3' },
      { src: agencyPremiereMoma, alt: 'Euphoria Season 3 premiere at TCL Chinese Theatre' },
      { src: shardsPremiereCast, alt: 'Behind the scenes on the Euphoria set' },
      { src: disneyUpfrontCast, alt: 'Homer Gere at HBO press event' },
    ],
    cast: {
      homerGere: euphoriaEpisodeScene,
      zendaya: disneyUpfrontCast,
      sydneySweeney: cannesRedCarpet,
      alexaDemie: agencyPremiereMoma,
      hunterSchafer: veniceFilmFestival,
      jacobElordi: shardsLaunchSkate,
    },
  },
  'white-lies': {
    hero: cannesRedCarpet,
    character: cannesRedCarpet,
    poster: cannesRedCarpet,
    gallery: [
      { src: cannesRedCarpet, alt: 'Homer Gere at Cannes Film Festival' },
      { src: veniceFilmFestival, alt: 'Red carpet event' },
    ],
    cast: {
      homerGere: cannesRedCarpet,
      michaelDouglas: veniceFilmFestival,
      willemDafoe: agencyPremiereMoma,
      ellenBarkin: disneyUpfrontCast,
    },
  },
  'american-pledge': {
    hero: journalPortrait,
    character: journalPortrait,
    poster: journalPortrait,
    gallery: [
      { src: journalPortrait, alt: 'American Pledge — promotional still' },
    ],
    cast: {
      homerGere: journalPortrait,
    },
  },
};
