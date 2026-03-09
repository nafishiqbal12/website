import { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import CaseStudies from './pages/CaseStudies';
import Contact from './pages/Contact';

const SITE_URL = 'https://blockwavelab.com';
const OG_IMAGE =
  'https://images.pexels.com/photos/6802042/pexels-photo-6802042.jpeg?auto=compress&cs=tinysrgb&w=1200';

type SeoConfig = {
  title: string;
  description: string;
  path: string;
};

const SEO_BY_PAGE: Record<string, SeoConfig> = {
  home: {
    title: 'BlockWave Lab | Crypto KOL Marketing & Web3 Growth Agency',
    description:
      'BlockWave Lab helps crypto projects scale with authentic KOL marketing, Web3 community growth, and launch campaigns that deliver real traction.',
    path: '/',
  },
  about: {
    title: 'About BlockWave Lab | Web3 Marketing Team',
    description:
      'Meet the team behind BlockWave Lab, a crypto-native marketing studio focused on transparent strategy, measurable results, and long-term Web3 growth.',
    path: '/about',
  },
  services: {
    title: 'Crypto Marketing Services | BlockWave Lab',
    description:
      'Explore BlockWave Lab services including influencer campaigns, PR, community growth, launch strategy, and data-driven reporting for Web3 brands.',
    path: '/services',
  },
  cases: {
    title: 'Case Studies | BlockWave Lab',
    description:
      'See real crypto marketing case studies from BlockWave Lab with campaign outcomes across exchange listings, gaming launches, and community growth.',
    path: '/case-studies',
  },
  contact: {
    title: 'Contact BlockWave Lab | Start Your Campaign',
    description:
      'Talk with BlockWave Lab about your crypto project. Get a custom Web3 marketing strategy for KOL outreach, PR, and community growth.',
    path: '/contact',
  },
  'kol-marketing': {
    title: 'KOL Marketing Services | BlockWave Lab',
    description:
      'Launch targeted KOL marketing campaigns with trusted crypto influencers to drive awareness, engagement, and qualified investor interest.',
    path: '/kol-marketing',
  },
  'crypto-marketing': {
    title: 'Crypto Marketing Agency | BlockWave Lab',
    description:
      'Scale your blockchain project with performance-focused crypto marketing across X, Telegram, YouTube, PR, and exchange ecosystem channels.',
    path: '/crypto-marketing',
  },
  'web3-marketing': {
    title: 'Web3 Marketing Solutions | BlockWave Lab',
    description:
      'Grow your Web3 brand with audience-first strategies, creator partnerships, community activation, and campaign analytics that prove ROI.',
    path: '/web3-marketing',
  },
  blog: {
    title: 'BlockWave Lab Blog | Crypto Marketing Insights',
    description:
      'Read BlockWave Lab insights on crypto growth strategy, KOL trends, launch playbooks, and practical Web3 marketing lessons from real campaigns.',
    path: '/blog',
  },
};

function upsertMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let meta = document.head.querySelector<HTMLMetaElement>(selector);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, key);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
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

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const seo = SEO_BY_PAGE[currentPage] ?? SEO_BY_PAGE.home;
    const pageUrl = `${SITE_URL}${seo.path === '/' ? '' : seo.path}`;

    document.title = seo.title;
    upsertMeta('meta[name="description"]', 'name', 'description', seo.description);

    upsertMeta('meta[property="og:title"]', 'property', 'og:title', seo.title);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', seo.description);
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', pageUrl);
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', OG_IMAGE);

    upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', seo.title);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', seo.description);
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', OG_IMAGE);

    upsertCanonical(pageUrl);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'about':
        return <About />;
      case 'services':
        return <Services onNavigate={setCurrentPage} />;
      case 'cases':
        return <CaseStudies onNavigate={setCurrentPage} />;
      case 'contact':
        return <Contact />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14]">
      <header>
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      </header>
      <main role="main">
        {renderPage()}
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default App;
