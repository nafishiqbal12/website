import { useEffect, useMemo, useState } from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import CaseStudies from './pages/CaseStudies';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPostPage from './pages/BlogPost';
import { BLOG_POSTS, type BlogPost } from './content/blogPosts';

const SITE_URL = 'https://blockwavelab.com';
const OG_IMAGE =
  'https://images.pexels.com/photos/6802042/pexels-photo-6802042.jpeg?auto=compress&cs=tinysrgb&w=1200';

type StaticPage = 'home' | 'about' | 'services' | 'cases' | 'contact' | 'blog';
type PageKey = StaticPage | 'blog-post';

type RouteState = {
  page: PageKey;
  path: string;
  slug?: string;
};

type SeoConfig = {
  title: string;
  description: string;
  path: string;
  keywords: string;
  ogType?: 'website' | 'article';
};

const TARGET_KEYWORDS = [
  'crypto marketing agency',
  'web3 marketing agency',
  'crypto KOL marketing',
  'web3 influencer marketing',
].join(', ');

const PATH_BY_PAGE: Record<StaticPage, string> = {
  home: '/',
  about: '/about',
  services: '/services',
  cases: '/cases',
  contact: '/contact',
  blog: '/blog',
};

const SEO_BY_PAGE: Record<StaticPage, SeoConfig> = {
  home: {
    title: 'BlockWaveLab | Crypto Marketing Agency & Web3 Marketing Agency',
    description:
      'BlockWaveLab is a crypto marketing agency and web3 marketing agency helping projects grow with crypto KOL marketing, web3 influencer marketing, PR, and community growth.',
    path: '/',
    keywords: TARGET_KEYWORDS,
  },
  about: {
    title: 'About BlockWaveLab | Crypto Marketing Agency for Web3 Brands',
    description:
      'Learn how BlockWaveLab helps Web3 teams grow with crypto KOL marketing, web3 influencer marketing, community growth, and PR campaigns.',
    path: '/about',
    keywords: TARGET_KEYWORDS,
  },
  services: {
    title: 'Crypto KOL Marketing & Web3 Influencer Marketing Services | BlockWaveLab',
    description:
      'Explore BlockWaveLab services: crypto KOL marketing, web3 influencer marketing, token launch marketing, community growth, and PR media coverage.',
    path: '/services',
    keywords: TARGET_KEYWORDS,
  },
  cases: {
    title: 'Crypto Marketing Case Studies | BlockWaveLab',
    description:
      'See how our crypto marketing agency has delivered measurable growth through crypto KOL marketing and web3 influencer marketing campaigns.',
    path: '/cases',
    keywords: TARGET_KEYWORDS,
  },
  contact: {
    title: 'Contact BlockWaveLab | Book a Crypto Marketing Consultation',
    description:
      'Contact BlockWaveLab to plan campaigns for crypto KOL marketing, web3 influencer marketing, PR, and community growth.',
    path: '/contact',
    keywords: TARGET_KEYWORDS,
  },
  blog: {
    title: 'BlockWaveLab Blog | Crypto Marketing Agency Insights',
    description:
      'Read practical insights on crypto KOL marketing, web3 influencer marketing, token launches, and growth from the BlockWaveLab team.',
    path: '/blog',
    keywords: TARGET_KEYWORDS,
  },
};

const SERVICE_ROUTE_SEO: Record<string, SeoConfig> = {
  '/services': SEO_BY_PAGE.services,
  '/kol-marketing': {
    title: 'Crypto KOL Marketing Services | BlockWaveLab',
    description:
      'Scale awareness with crypto KOL marketing campaigns built for trust, engagement, and qualified investor attention.',
    path: '/kol-marketing',
    keywords: TARGET_KEYWORDS,
  },
  '/crypto-marketing': {
    title: 'Crypto Marketing Agency Services | BlockWaveLab',
    description:
      'BlockWaveLab is a crypto marketing agency delivering performance campaigns across KOLs, influencers, PR, and community channels.',
    path: '/crypto-marketing',
    keywords: TARGET_KEYWORDS,
  },
  '/web3-marketing': {
    title: 'Web3 Marketing Agency Services | BlockWaveLab',
    description:
      'As a web3 marketing agency, BlockWaveLab helps projects grow with web3 influencer marketing, creator strategy, and community activation.',
    path: '/web3-marketing',
    keywords: TARGET_KEYWORDS,
  },
};

function normalizePath(pathname: string) {
  if (!pathname || pathname === '/') {
    return '/';
  }
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

function getRouteFromPath(pathname: string): RouteState {
  const normalized = normalizePath(pathname);

  if (normalized.startsWith('/blog/')) {
    const slug = normalized.replace('/blog/', '').trim();
    if (slug) {
      return { page: 'blog-post', path: `/blog/${slug}`, slug };
    }
  }

  switch (normalized) {
    case '/':
      return { page: 'home', path: '/' };
    case '/about':
      return { page: 'about', path: '/about' };
    case '/services':
    case '/kol-marketing':
    case '/crypto-marketing':
    case '/web3-marketing':
      return { page: 'services', path: normalized };
    case '/cases':
    case '/case-studies':
      return { page: 'cases', path: '/cases' };
    case '/contact':
      return { page: 'contact', path: '/contact' };
    case '/blog':
      return { page: 'blog', path: '/blog' };
    default:
      return { page: 'home', path: '/' };
  }
}

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

function App() {
  const [route, setRoute] = useState<RouteState>(() => getRouteFromPath(window.location.pathname));

  const currentBlogPost: BlogPost | undefined = useMemo(() => {
    if (route.page !== 'blog-post' || !route.slug) {
      return undefined;
    }
    return BLOG_POSTS.find((post) => post.slug === route.slug);
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
    const resolvedPath = target.startsWith('/') ? normalizePath(target) : PATH_BY_PAGE[(target as StaticPage)] ?? '/';
    const nextRoute = getRouteFromPath(resolvedPath);

    setRoute(nextRoute);
    window.history.pushState({}, '', nextRoute.path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    let seo: SeoConfig;

    if (route.page === 'blog-post' && currentBlogPost) {
      seo = {
        title: `${currentBlogPost.title} | BlockWaveLab Blog`,
        description: currentBlogPost.description,
        path: `/blog/${currentBlogPost.slug}`,
        keywords: TARGET_KEYWORDS,
        ogType: 'article',
      };
    } else if (route.page === 'services') {
      seo = SERVICE_ROUTE_SEO[route.path] ?? SEO_BY_PAGE.services;
    } else {
      const staticPage: StaticPage = route.page === 'blog-post' ? 'blog' : route.page;
      seo = SEO_BY_PAGE[staticPage];
    }

    const pageUrl = `${SITE_URL}${seo.path === '/' ? '' : seo.path}`;

    document.title = seo.title;
    upsertMeta('meta[name="description"]', 'name', 'description', seo.description);
    upsertMeta('meta[name="keywords"]', 'name', 'keywords', seo.keywords);

    upsertMeta('meta[property="og:title"]', 'property', 'og:title', seo.title);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', seo.description);
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', seo.ogType ?? 'website');
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', pageUrl);
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', OG_IMAGE);

    upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    upsertMeta('meta[name="twitter:site"]', 'name', 'twitter:site', '@Blockwavelab');
    upsertMeta('meta[name="twitter:creator"]', 'name', 'twitter:creator', '@Blockwavelab');
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', seo.title);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', seo.description);
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', OG_IMAGE);

    upsertCanonical(pageUrl);

    if (route.page === 'blog-post' && currentBlogPost) {
      upsertMeta('meta[property="article:published_time"]', 'property', 'article:published_time', currentBlogPost.publishedAt);
      upsertMeta('meta[property="article:author"]', 'property', 'article:author', currentBlogPost.author);
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
        description: SEO_BY_PAGE.blog.description,
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
    } else {
      removeJsonLd('blog');
      removeJsonLd('article');
    }

    upsertJsonLd('organization', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'BlockWaveLab',
      url: SITE_URL,
      logo: OG_IMAGE,
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

    if (route.page === 'services') {
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
  }, [route.page, route.path, currentBlogPost]);

  const renderPage = () => {
    switch (route.page) {
      case 'home':
        return <Home onNavigate={navigate} />;
      case 'about':
        return <About onNavigate={navigate} />;
      case 'services':
        return <Services onNavigate={navigate} />;
      case 'cases':
        return <CaseStudies onNavigate={navigate} />;
      case 'contact':
        return <Contact />;
      case 'blog':
        return <Blog onNavigate={navigate} />;
      case 'blog-post':
        if (currentBlogPost) {
          return <BlogPostPage post={currentBlogPost} onNavigate={navigate} />;
        }
        return <Blog onNavigate={navigate} />;
      default:
        return <Home onNavigate={navigate} />;
    }
  };

  const navPage = route.page === 'blog-post' ? 'blog' : route.page;

  return (
    <div className="min-h-screen bg-[#0B0E14]">
      <header>
        <Navigation currentPage={navPage} onNavigate={navigate} />
      </header>
      <main role="main">{renderPage()}</main>
      <footer>
        <Footer onNavigate={navigate} />
      </footer>
    </div>
  );
}

export default App;
