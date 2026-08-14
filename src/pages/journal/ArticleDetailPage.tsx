import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SEO } from '../../components/SEO';
import { Navbar } from '../../components/Navbar';
import { DetailModal } from '../../components/DetailModal';
import { getArticleBySlug, getRelatedArticles, type JournalArticleExtended } from '../../data/journal';
import { journalRepository } from '../../lib/repositories';
import { ArticleDetailHero } from './article/ArticleDetailHero';
import { ArticleDetailBody } from './article/ArticleDetailBody';
import { ArticleDetailRelated } from './article/ArticleDetailRelated';
import { Footer } from '../../components/Footer';
import { ModalType } from '../../types';

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<JournalArticleExtended | undefined>(undefined);
  const [relatedArticles, setRelatedArticles] = useState<JournalArticleExtended[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection] = React.useState<string>('journal');
  const [activeModal, setActiveModal] = React.useState<ModalType>(null);

  const handleNavigate = (sectionId: string) => {
    const routes: Record<string, string> = {
      home: '/', journey: '/journey', projects: '/projects', media: '/media',
      gallery: '/gallery', journal: '/journal', experiences: '/experiences',
      membership: '/membership', chat: '/chat', contact: '/contact',
    };
    navigate(routes[sectionId] || '/');
  };

  const handleOpenChat = () => {
    navigate('/chat');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) { setLoading(false); return; }

    const loadArticle = async () => {
      setLoading(true);
      try {
        const dbArticle = await journalRepository.getBySlug(slug);
        if (dbArticle) {
          // Map Supabase data to JournalArticleExtended format
          const mapped: JournalArticleExtended = {
            id: dbArticle.id,
            slug: dbArticle.slug,
            title: dbArticle.title,
            excerpt: dbArticle.excerpt || '',
            content: dbArticle.content,
            category: dbArticle.category,
            author: dbArticle.author,
            authorRole: '',
            date: dbArticle.published_date || dbArticle.created_at,
            publishDate: dbArticle.published_date || dbArticle.created_at,
            readTime: dbArticle.read_time || '5 min read',
            wordCount: dbArticle.content.split(/\s+/).length,
            image: dbArticle.cover_image || '',
            imageAlt: dbArticle.title,
            featured: dbArticle.featured,
            trending: dbArticle.trending,
            status: dbArticle.status,
            tags: dbArticle.tags || [],
            seoTitle: dbArticle.seo_title || dbArticle.title,
            seoDescription: dbArticle.seo_description || dbArticle.excerpt || '',
            ogImage: dbArticle.og_image || undefined,
            relatedSlugs: dbArticle.related_slugs || [],
          };
          setArticle(mapped);
          // Load related articles
          if (dbArticle.related_slugs?.length) {
            const related: JournalArticleExtended[] = [];
            for (const rSlug of dbArticle.related_slugs.slice(0, 3)) {
              try {
                const r = await journalRepository.getBySlug(rSlug);
                if (r) {
                  related.push({
                    id: r.id, slug: r.slug, title: r.title, excerpt: r.excerpt || '', content: r.content,
                    category: r.category, author: r.author, authorRole: '', date: r.published_date || r.created_at,
                    publishDate: r.published_date || r.created_at, readTime: r.read_time || '5 min read',
                    wordCount: r.content.split(/\s+/).length, image: r.cover_image || '', imageAlt: r.title,
                    featured: r.featured, trending: r.trending, status: r.status, tags: r.tags || [],
                    seoTitle: r.seo_title || r.title, seoDescription: r.seo_description || r.excerpt || '',
                  });
                }
              } catch { /* skip */ }
            }
            setRelatedArticles(related);
          }
        } else {
          // Fallback to hardcoded data
          setArticle(getArticleBySlug(slug));
          setRelatedArticles(slug ? getRelatedArticles(slug, 3) : []);
        }
      } catch {
        setArticle(getArticleBySlug(slug));
        setRelatedArticles(slug ? getRelatedArticles(slug, 3) : []);
      }
      setLoading(false);
    };

    loadArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#A6852F] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#57534E]">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="text-center space-y-6 px-4">
          <h1 className="text-4xl sm:text-5xl font-editorial text-[#1C1917]">
            Article Not Found
          </h1>
          <p className="text-[#44403C] max-w-md mx-auto">
            The article you're looking for doesn't exist or hasn't been published yet.
          </p>
          <button
            onClick={() => navigate('/journal')}
            className="inline-flex items-center gap-2 bg-[#A6852F] hover:bg-[#B8983A] text-white font-medium text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 cursor-pointer"
          >
            Back to Journal
          </button>
        </div>
      </div>
    );
  }

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://homergere.com';
  const articleUrl = `${siteUrl}/journal/${article.slug}`;
  const ogImage = article.ogImage || article.image;

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased">
      <SEO title={article.seoTitle || article.title} description={article.seoDescription || article.description} />
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenChat={handleOpenChat}
        onOpenSignIn={() => setActiveModal({ type: 'signin' })}
      />

      {/* SEO structured data + Open Graph */}
      <Helmet>
        <link rel="canonical" href={articleUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.seoTitle || article.title} />
        <meta property="og:description" content={article.seoDescription || article.description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={articleUrl} />
        <meta property="og:site_name" content="Homer Gere — Official Website" />
        <meta property="article:published_time" content={article.publishDate} />
        <meta property="article:author" content={article.author} />
        <meta property="article:section" content={article.category} />
        {article.tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.seoTitle || article.title} />
        <meta name="twitter:description" content={article.seoDescription || article.description} />
        <meta name="twitter:image" content={ogImage} />

        {/* Article Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.seoDescription,
            image: ogImage,
            datePublished: article.publishDate,
            author: {
              '@type': 'Organization',
              name: article.author,
              url: siteUrl,
            },
            publisher: {
              '@type': 'Organization',
              name: 'Homer Gere — Official Website',
              url: siteUrl,
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': articleUrl,
            },
            keywords: article.tags.join(', '),
            wordCount: article.wordCount,
            articleSection: article.category,
          })}
        </script>

        {/* Breadcrumb Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: siteUrl,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Journal',
                item: `${siteUrl}/journal`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: article.title,
                item: articleUrl,
              },
            ],
          })}
        </script>
      </Helmet>

      {/* Hero */}
      <ArticleDetailHero
        article={article}
        onBack={() => navigate('/journal')}
      />

      {/* Body */}
      <ArticleDetailBody article={article} />

      {/* Related Articles */}
      <ArticleDetailRelated
        articles={relatedArticles}
        onNavigate={(slug) => navigate(`/journal/${slug}`)}
      />

      {/* Footer */}
      <Footer onNavigate={(path) => navigate(path)} onOpenChat={handleOpenChat} />

      <DetailModal
        modal={activeModal}
        onClose={() => setActiveModal(null)}
        onOpenChat={handleOpenChat}
      />
    </div>
  );
}
