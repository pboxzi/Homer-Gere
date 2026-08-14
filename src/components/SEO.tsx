import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
  structuredData?: Record<string, unknown>;
  noindex?: boolean;
}

const SITE_NAME = 'Homer Gere';
const DEFAULT_DESCRIPTION = 'Official website of Homer Gere — actor, storyteller. Explore exclusive content, membership plans, experiences, and more.';
const DEFAULT_IMAGE = '/og-image.jpg';
const BASE_URL = 'https://homergere.com';

const PAGE_SEO: Record<string, { title: string; description: string; keywords: string; type?: string }> = {
  '/': {
    title: '',
    description: 'Homer Gere — actor, storyteller, and creative force. Explore exclusive content, membership plans, experiences, fan chat, and behind-the-scenes access to his world.',
    keywords: 'Homer Gere, actor, filmmaker, exclusive content, membership, experiences, fan chat, Shards, Euphoria',
  },
  '/journey': {
    title: 'Journey',
    description: 'Follow Homer Gere\'s journey from early beginnings to acclaimed roles in Shards, Euphoria, and beyond. Explore milestones, achievements, and the story behind the craft.',
    keywords: 'Homer Gere journey, career milestones, filmography, actor biography, Shards, Euphoria',
  },
  '/projects': {
    title: 'Projects',
    description: 'Explore Homer Gere\'s complete filmography and creative projects — from award-winning films to exclusive upcoming ventures.',
    keywords: 'Homer Gere projects, films, movies, filmography, Shards, Euphoria, upcoming projects',
  },
  '/gallery': {
    title: 'Gallery',
    description: 'Browse exclusive photos and behind-the-scenes moments from Homer Gere\'s career, premieres, and personal collection.',
    keywords: 'Homer Gere gallery, photos, behind the scenes, premieres, exclusive photos',
  },
  '/journal': {
    title: 'Journal',
    description: 'Read Homer Gere\'s personal reflections, industry insights, and exclusive stories from behind the camera.',
    keywords: 'Homer Gere journal, blog, articles, reflections, behind the scenes, personal stories',
  },
  '/media': {
    title: 'Media',
    description: 'Watch interviews, listen to podcasts, and read press coverage featuring Homer Gere across major media outlets.',
    keywords: 'Homer Gere media, interviews, podcasts, press, videos, coverage',
  },
  '/experiences': {
    title: 'Experiences',
    description: 'Request exclusive experiences with Homer Gere — meet-and-greets, fan events, private appearances, and more.',
    keywords: 'Homer Gere experiences, meet and greet, fan events, private events, video greetings',
  },
  '/membership': {
    title: 'Membership',
    description: 'Join the Homer Gere community. Explore Silver, Gold, and Platinum membership tiers with exclusive benefits and access.',
    keywords: 'Homer Gere membership, join, Silver, Gold, Platinum, exclusive access, member benefits',
  },
  '/chat': {
    title: 'Chat',
    description: 'Connect directly with Homer Gere through private fan chat. Available for Gold and Platinum members.',
    keywords: 'Homer Gere chat, fan chat, direct message, private conversation',
  },
  '/contact': {
    title: 'Contact',
    description: 'Get in touch with Homer Gere\'s team. Reach out for business enquiries, press requests, membership questions, and more.',
    keywords: 'Homer Gere contact, business enquiry, press, membership support, get in touch',
  },
  '/login': {
    title: 'Sign In',
    description: 'Sign in to your Homer Gere account to access your membership, dashboard, and exclusive content.',
    keywords: 'Homer Gere login, sign in, member access',
  },
  '/register': {
    title: 'Register',
    description: 'Create your Homer Gere account to unlock exclusive content, experiences, and membership benefits.',
    keywords: 'Homer Gere register, create account, join membership',
  },
};

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  keywords,
  structuredData,
  noindex = false,
}) => {
  const location = useLocation();
  const currentUrl = url || `${BASE_URL}${location.pathname}`;
  const pageSeo = PAGE_SEO[location.pathname];

  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : pageSeo?.title
      ? pageSeo.title
        ? `${pageSeo.title} | ${SITE_NAME}`
        : SITE_NAME
      : SITE_NAME;

  const metaDescription = description || pageSeo?.description || DEFAULT_DESCRIPTION;
  const metaKeywords = keywords || pageSeo?.keywords;

  const defaultStructuredData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Homer Gere',
    url: BASE_URL,
    jobTitle: 'Actor',
    description: DEFAULT_DESCRIPTION,
    sameAs: [
      'https://www.instagram.com/homergere',
      'https://www.tiktok.com/@homergere',
      'https://x.com/homergere',
      'https://www.youtube.com/@homergere',
    ],
  };

  const jsonLd = structuredData || (location.pathname === '/' ? defaultStructuredData : undefined);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {metaKeywords && <meta name="keywords" content={metaKeywords} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />
      <link rel="canonical" href={currentUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};
