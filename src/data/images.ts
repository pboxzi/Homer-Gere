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
    shardsLaunchSkate,
    cannesRedCarpet,
    galleryCafe,
  ],
  bts: [
    shardsPremiereCarey,
    shardsEpisodeScene,
    journalOnset,
    journalPortrait,
    bwInterview,
    roadChasing,
    homerBrightLuxuryEditorial,
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
};
