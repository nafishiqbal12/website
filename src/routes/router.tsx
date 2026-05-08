import { lazy, Suspense, useEffect, useMemo, useState, type ComponentType } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Home from '../pages/Home';
import About from '../pages/About';
import Services from '../pages/Services';
import { getPostBySlug, type Post } from '../lib/blog';
import { getSeoForRoute } from './seoConfig';
import {
  SITE_URL,
  type RouteState,
  resolveNavigationTarget,
  getRouteFromPath,
  getNavPage,
} from './routeConfig';

type EmptyProps = Record<string, never>;
const Contact = lazy(() => import('../pages/Contact') as Promise<{ default: ComponentType<EmptyProps> }>);
const Blog = lazy(() => import('../pages/Blog') as Promise<{ default: ComponentType<{ onNavigate: (target: string) => void }> }>);
const BlogPostPage = lazy(() => import('../pages/BlogPost') as Promise<{ default: ComponentType<{ post: Post; onNavigate: (target: string) => void }> }>);
const BlogTag = lazy(() => import('../pages/BlogTag') as Promise<{ default: ComponentType<{ tag: string; onNavigate: (target: string) => void }> }>);
const CaseStudies = lazy(() => import('../pages/CaseStudies') as Promise<{ default: ComponentType<{ onNavigate: (target: string) => void }> }>);
const CaseStudyPage = lazy(() => import('../pages/CaseStudyPage') as Promise<{ default: ComponentType<{ caseStudy: any; onNavigate: (target: string) => void }> }>);
const CryptoKolMarketing = lazy(() => import('../pages/CryptoKolMarketing') as Promise<{ default: ComponentType<{ onNavigate: (target: string) => void }> }>);
const TokenLaunchMarketing = lazy(() => import('../pages/TokenLaunchMarketing') as Promise<{ default: ComponentType<{ onNavigate: (target: string) => void }> }>);
const Web3InfluencerMarketing = lazy(() => import('../pages/Web3InfluencerMarketing') as Promise<{ default: ComponentType<{ onNavigate: (target: string) => void }> }>);
const TelegramCommunityGrowth = lazy(() => import('../pages/TelegramCommunityGrowth') as Promise<{ default: ComponentType<{ onNavigate: (target: string) => void }> }>);
const CryptoPRMarketing = lazy(() => import('../pages/CryptoPRMarketing') as Promise<{ default: ComponentType<{ onNavigate: (target: string) => void }> }>);
const BlockchainMarketingAgency = lazy(() => import('../pages/BlockchainMarketingAgency') as Promise<{ default: ComponentType<{ onNavigate: (target: string) => void }> }>);
const CryptoMarketingAgency = lazy(() => import('../pages/CryptoMarketingAgency') as Promise<{ default: ComponentType<{ onNavigate: (target: string) => void }> }>);
const BlockchainSEO = lazy(() => import('../pages/BlockchainSEO') as Promise<{ default: ComponentType<{ onNavigate: (target: string) => void }> }>);
const Web3GrowthMarketing = lazy(() => import('../pages/Web3GrowthMarketing') as Promise<{ default: ComponentType<{ onNavigate: (target: string) => void }> }>);
const CryptoCommunityManagement = lazy(() => import('../pages/CryptoCommunityManagement') as Promise<{ default: ComponentType<{ onNavigate: (target: string) => void }> }>);
const CryptoInfluencerMarketing = lazy(() => import('../pages/CryptoInfluencerMarketing') as Promise<{ default: ComponentType<{ onNavigate: (target: string) => void }> }>);
const BlockchainPRServices = lazy(() => import('../pages/BlockchainPRServices') as Promise<{ default: ComponentType<{ onNavigate: (target: string) => void }> }>);
const CryptoPaidAds = lazy(() => import('../pages/CryptoPaidAds') as Promise<{ default: ComponentType<{ onNavigate: (target: string) => void }> }>);
const AiBlockchainMarketing = lazy(() => import('../pages/AiBlockchainMarketing') as Promise<{ default: ComponentType<{ onNavigate: (target: string) => void }> }>);

function upsertMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let meta = document.head.querySelector<HTMLMetaElement>(selector);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, key);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function removeMeta(selector: string) {
  const node = document.head.querySelector(selector);
  if (node) {
    node.remove();
  }
}

function upsertCanonical(url: string) {
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
}

function upsertJsonLd(id: string, data: object) {
  let script = document.head.querySelector<HTMLScriptElement>(`script[data-schema="${id}"]`);
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', id);
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

function removeJsonLd(id: string) {
  const script = document.head.querySelector(`script[data-schema="${id}"]`);
  if (script) {
    script.remove();
  }
}

export default function AppRouter() {
  const [route, setRoute] = useState<RouteState>(() => getRouteFromPath(window.location.pathname));

  const currentBlogPost: Post | undefined = useMemo(() => {
    if (route.page !== 'blog-post' || !route.slug) {
      return undefined;
    }

    return getPostBySlug(route.slug);
  }, [route.page, route.slug]);

  const currentCaseStudy = useMemo(() => {
    if (route.page !== 'case-study' || !route.slug) return undefined;
    try {
      // dynamic require to avoid circular static import in browser bundle
      const { getCaseStudyBySlug } = require('../lib/caseStudies') as typeof import('../lib/caseStudies');
      return getCaseStudyBySlug(route.slug as string);
    } catch (e) {
      return undefined;
    }
  }, [route.page, route.slug]);

  useEffect(() => {
    const onPopState = () => {
      setRoute(getRouteFromPath(window.location.pathname));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (target: string) => {
    const resolvedPath = resolveNavigationTarget(target);
    const nextRoute = getRouteFromPath(resolvedPath);

    setRoute(nextRoute);
    window.history.pushState({}, '', nextRoute.path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const { seo, pageUrl, ogImage } = getSeoForRoute(route, currentBlogPost, currentCaseStudy as any);

    document.title = seo.title;
    upsertMeta('meta[name="description"]', 'name', 'description', seo.description);
    upsertMeta('meta[name="keywords"]', 'name', 'keywords', seo.keywords);

    upsertMeta('meta[property="og:title"]', 'property', 'og:title', seo.title);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', seo.description);
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', seo.ogType ?? 'website');
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', pageUrl);
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', ogImage);
    upsertMeta('meta[property="og:image:secure_url"]', 'property', 'og:image:secure_url', ogImage);
    upsertMeta('meta[property="og:image:type"]', 'property', 'og:image:type', 'image/png');
    upsertMeta('meta[property="og:image:width"]', 'property', 'og:image:width', '1200');
    upsertMeta('meta[property="og:image:height"]', 'property', 'og:image:height', '630');

    upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    upsertMeta('meta[name="twitter:site"]', 'name', 'twitter:site', '@Blockwavelab');
    upsertMeta('meta[name="twitter:creator"]', 'name', 'twitter:creator', '@Blockwavelab');
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', seo.title);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', seo.description);
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);
    upsertMeta('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', seo.title);

    upsertCanonical(pageUrl);

    if (route.page === 'blog-post' && currentBlogPost) {
      upsertMeta('meta[property="article:published_time"]', 'property', 'article:published_time', currentBlogPost.publishedAt);
      upsertMeta('meta[property="article:author"]', 'property', 'article:author', currentBlogPost.author ?? 'BlockWaveLab');
    } else {
      removeMeta('meta[property="article:published_time"]');
      removeMeta('meta[property="article:author"]');
    }

    if (route.page === 'blog') {
      upsertJsonLd('blog', {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'BlockWaveLab Blog',
        url: `${SITE_URL}/blog`,
        description: seo.description,
        publisher: {
          '@type': 'Organization',
          name: 'BlockWaveLab',
          url: SITE_URL,
        },
      });
      removeJsonLd('article');
    } else if (route.page === 'blog-post' && currentBlogPost) {
      upsertJsonLd('article', {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: currentBlogPost.title,
        description: currentBlogPost.description,
        datePublished: currentBlogPost.publishedAt,
        author: {
          '@type': 'Organization',
          name: currentBlogPost.author,
        },
        publisher: {
          '@type': 'Organization',
          name: 'BlockWaveLab',
          url: SITE_URL,
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${SITE_URL}/blog/${currentBlogPost.slug}`,
        },
      });
      removeJsonLd('blog');
    } else if (route.page === 'case-study' && route.slug) {
      upsertJsonLd('case-study', {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: seo.title,
        description: seo.description,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': pageUrl,
        },
      });
    } else {
      removeJsonLd('blog');
      removeJsonLd('article');
      removeJsonLd('case-study');
    }

    upsertJsonLd('organization', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'BlockWaveLab',
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.svg`,
      sameAs: ['https://twitter.com/Blockwavelab', 'https://t.me/Alex_TNH'],
      description:
        'BlockWaveLab is a crypto marketing agency and web3 marketing agency focused on crypto KOL marketing and web3 influencer marketing.',
    });

    upsertJsonLd('website', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'BlockWaveLab',
      url: SITE_URL,
      description: 'Crypto marketing agency for Web3 growth, KOL campaigns, influencer marketing, PR, and community expansion.',
    });

    if (seo.ogType === 'service' || route.page === 'services' || route.page === 'crypto-kol' || route.page === 'token-launch' || route.page === 'web3-influencer' || route.page === 'telegram-growth' || route.page === 'crypto-pr') {
      upsertJsonLd('service', {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: seo.title,
        provider: {
          '@type': 'Organization',
          name: 'BlockWaveLab',
          url: SITE_URL,
        },
        serviceType: [
          'crypto marketing agency',
          'web3 marketing agency',
          'crypto KOL marketing',
          'web3 influencer marketing',
        ],
        areaServed: 'Global',
        url: `${SITE_URL}${seo.path}`,
        description: seo.description,
      });
    } else {
      removeJsonLd('service');
    }
  }, [route, currentBlogPost]);

  const renderPage = () => {
    switch (route.page) {
      case 'home':
        return <Home onNavigate={navigate} />;
      case 'about':
        return <About onNavigate={navigate} />;
      case 'services':
        return <Services onNavigate={navigate} />;
      case 'crypto-kol':
        return <CryptoKolMarketing onNavigate={navigate} />;
      case 'token-launch':
        return <TokenLaunchMarketing onNavigate={navigate} />;
      case 'web3-influencer':
        return <Web3InfluencerMarketing onNavigate={navigate} />;
      case 'telegram-growth':
        return <TelegramCommunityGrowth onNavigate={navigate} />;
      case 'crypto-pr':
        return <CryptoPRMarketing onNavigate={navigate} />;
      case 'blockchain-marketing':
        return <BlockchainMarketingAgency onNavigate={navigate} />;
      case 'crypto-marketing':
        return <CryptoMarketingAgency onNavigate={navigate} />;
      case 'blockchain-seo':
        return <BlockchainSEO onNavigate={navigate} />;
      case 'web3-growth-marketing':
        return <Web3GrowthMarketing onNavigate={navigate} />;
      case 'crypto-community-management':
        return <CryptoCommunityManagement onNavigate={navigate} />;
      case 'crypto-influencer-marketing':
        return <CryptoInfluencerMarketing onNavigate={navigate} />;
      case 'blockchain-pr-services':
        return <BlockchainPRServices onNavigate={navigate} />;
      case 'crypto-paid-ads':
        return <CryptoPaidAds onNavigate={navigate} />;
      case 'ai-blockchain-marketing':
        return <AiBlockchainMarketing onNavigate={navigate} />;
      case 'cases':
        return <CaseStudies onNavigate={navigate} />;
      case 'case-study':
        return currentCaseStudy ? (
          <CaseStudyPage caseStudy={currentCaseStudy} onNavigate={navigate} />
        ) : (
          <CaseStudies onNavigate={navigate} />
        );
      case 'contact':
        return <Contact />;
      case 'blog':
        return <Blog onNavigate={navigate} />;
      case 'blog-post':
        if (currentBlogPost) {
          return <BlogPostPage post={currentBlogPost} onNavigate={navigate} />;
        }
        return <Blog onNavigate={navigate} />;
      case 'blog-tag':
        return route.slug ? <BlogTag tag={route.slug} onNavigate={navigate} /> : <Blog onNavigate={navigate} />;
      default:
        return <Home onNavigate={navigate} />;
    }
  };

  const navPage = getNavPage(route.page);

  return (
    <div className="min-h-screen bg-[#0B0E14]">
      <header>
        <Navigation currentPage={navPage} onNavigate={navigate} />
      </header>
      <main role="main">
        <Suspense fallback={<div className="py-20 text-center">Loading…</div>}>
          {renderPage()}
        </Suspense>
      </main>
      <footer>
        <Footer onNavigate={navigate} />
      </footer>
    </div>
  );
}