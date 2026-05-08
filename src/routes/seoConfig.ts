import { getOgImageAltText, resolveOgImageUrl } from '../assets/og/routes';
import type { Post } from '../lib/blog';
import { SITE_URL, TARGET_KEYWORDS, type RouteState, type StaticPage } from './routeConfig';

export type SeoConfig = {
  title: string;
  description: string;
  path: string;
  keywords: string;
  ogType?: 'website' | 'article' | 'service';
};

export type SeoResolution = {
  seo: SeoConfig;
  pageUrl: string;
  ogImage: string;
  imageAlt: string;
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

const SERVICE_VARIANT_ROUTE_SEO: Record<'crypto-kol' | 'token-launch' | 'web3-influencer' | 'telegram-growth' | 'crypto-pr', SeoConfig> = {
  'crypto-kol': {
    title: 'Crypto KOL Marketing Agency — Trusted Creator Campaigns',
    description:
      'Crypto KOL marketing agency for token launches and growth — targeted creator campaigns, authentic engagement, and measurable results for Web3 projects.',
    path: '/crypto-kol-marketing',
    keywords: TARGET_KEYWORDS,
    ogType: 'service',
  },
  'token-launch': {
    title: 'Token Launch Marketing — Pre-Launch To Post-Launch',
    description:
      'Token launch marketing for crypto projects: narrative, creator waves, community activation, and listing coordination for measurable outcomes.',
    path: '/token-launch-marketing',
    keywords: TARGET_KEYWORDS,
    ogType: 'service',
  },
  'web3-influencer': {
    title: 'Web3 Influencer Marketing — Creator-Led Campaigns',
    description:
      'Web3 influencer marketing: educational creator campaigns, long-form trust-building content, and measurable conversions for crypto projects.',
    path: '/web3-influencer-marketing',
    keywords: TARGET_KEYWORDS,
    ogType: 'service',
  },
  'telegram-growth': {
    title: 'Telegram Crypto Community Growth — Telegram Growth for Web3',
    description:
      'Telegram community growth services for crypto projects: moderation, retention programs, gated onboarding, and creator-driven activation.',
    path: '/telegram-community-growth',
    keywords: TARGET_KEYWORDS,
    ogType: 'service',
  },
  'crypto-pr': {
    title: 'Crypto PR Agency — Media Coverage for Web3 Projects',
    description:
      'Crypto PR marketing: secure placements in top crypto outlets, craft narratives for investors, and amplify launches with trusted media coverage.',
    path: '/crypto-pr-marketing',
    keywords: TARGET_KEYWORDS,
    ogType: 'service',
  },
};

const SERVICE_PAGES_SEO: Record<string, SeoConfig> = {
  'blockchain-marketing': {
    title: 'Blockchain Marketing Agency — Token & dApp Growth | BlockWaveLab',
    description: 'Blockchain marketing agency focused on token launches, listings, creator campaigns, and community growth for Web3 projects.',
    path: '/blockchain-marketing-agency',
    keywords: TARGET_KEYWORDS,
    ogType: 'service',
  },
  'crypto-marketing': {
    title: 'Crypto Marketing Agency — KOL & Growth Campaigns | BlockWaveLab',
    description: 'Crypto marketing agency delivering creator-led campaigns, PR, community growth, and paid amplification.',
    path: '/crypto-marketing-agency',
    keywords: TARGET_KEYWORDS,
    ogType: 'service',
  },
  'blockchain-seo': {
    title: 'Blockchain SEO — Rank Your Token & dApp | BlockWaveLab',
    description: 'SEO for blockchain projects: developer docs, schema, and topical authority to rank token-related queries.',
    path: '/blockchain-seo',
    keywords: TARGET_KEYWORDS,
    ogType: 'service',
  },
  'web3-growth-marketing': {
    title: 'Web3 Growth Marketing — Acquisition & Retention | BlockWaveLab',
    description: 'Growth marketing for Web3 combining creators, product hooks, and retention to scale adoption.',
    path: '/web3-growth-marketing',
    keywords: TARGET_KEYWORDS,
    ogType: 'service',
  },
  'crypto-community-management': {
    title: 'Crypto Community Management — Onboard & Retain | BlockWaveLab',
    description: 'Community ops, moderation, onboarding funnels, and retention programs for crypto projects.',
    path: '/crypto-community-management',
    keywords: TARGET_KEYWORDS,
    ogType: 'service',
  },
  'crypto-influencer-marketing': {
    title: 'Crypto Influencer Marketing — Creator-Led Conversions | BlockWaveLab',
    description: 'Influencer marketing for crypto: creator research, briefs, and performance tracking to drive conversions.',
    path: '/crypto-influencer-marketing',
    keywords: TARGET_KEYWORDS,
    ogType: 'service',
  },
  'blockchain-pr-services': {
    title: 'Blockchain PR Services — Earn Media Coverage | BlockWaveLab',
    description: 'PR services to secure placements in top crypto outlets and amplify token launches.',
    path: '/blockchain-pr-services',
    keywords: TARGET_KEYWORDS,
    ogType: 'service',
  },
  'crypto-paid-ads': {
    title: 'Crypto Paid Ads — Compliant Paid Growth | BlockWaveLab',
    description: 'Paid ads and amplification for crypto projects with compliance-first creative and landing pages.',
    path: '/crypto-paid-ads',
    keywords: TARGET_KEYWORDS,
    ogType: 'service',
  },
  'ai-blockchain-marketing': {
    title: 'AI Blockchain Marketing — Data-Driven Growth | BlockWaveLab',
    description: 'AI-assisted campaigns for blockchain: predictive audience matching, creative generation, and automated reporting.',
    path: '/ai-blockchain-marketing',
    keywords: TARGET_KEYWORDS,
    ogType: 'service',
  },
};

function buildSeoResolution(seo: SeoConfig, ogInput: { canonical: string; type?: 'website' | 'article' | 'service'; title?: string; tags?: string[] }): SeoResolution {
  const pageUrl = seo.path === '/' ? SITE_URL : `${SITE_URL}${seo.path}`;
  const ogImage = resolveOgImageUrl(ogInput);
  return {
    seo,
    pageUrl,
    ogImage,
    imageAlt: getOgImageAltText(seo.title),
  };
}

import type { CaseStudy } from '../lib/caseStudies';

export function getSeoForRoute(route: RouteState, currentBlogPost?: Post, currentCaseStudy?: CaseStudy): SeoResolution {
  if (route.page === 'blog-post' && currentBlogPost) {
    const seo = {
      title: `${currentBlogPost.title} | BlockWaveLab Blog`,
      description: currentBlogPost.description ?? currentBlogPost.title,
      path: `/blog/${currentBlogPost.slug}`,
      keywords: TARGET_KEYWORDS,
      ogType: 'article' as const,
    };

    return buildSeoResolution(seo, {
      canonical: `${SITE_URL}${seo.path}`,
      type: 'article',
      title: currentBlogPost.title,
      tags: currentBlogPost.tags,
    });
  }

  if (route.page === 'blog-tag' && route.slug) {
    const seo = {
      title: `${route.slug} — BlockWaveLab Blog`,
      description: `Articles and insights about ${route.slug} from BlockWaveLab — crypto KOL marketing, token launches, community growth and Web3 strategy.`,
      path: `/blog/tag/${route.slug}`,
      keywords: TARGET_KEYWORDS,
    };

    return buildSeoResolution(seo, {
      canonical: `${SITE_URL}${seo.path}`,
      title: seo.title,
      tags: [route.slug],
    });
  }

  if (route.page === 'case-study' && route.slug) {
    if (currentCaseStudy) {
      const seo = {
        title: `${currentCaseStudy.client} — ${currentCaseStudy.title} | BlockWaveLab Case Study`,
        description: currentCaseStudy.summary ?? currentCaseStudy.title,
        path: `/case-studies/${currentCaseStudy.slug}`,
        keywords: TARGET_KEYWORDS,
        ogType: 'article' as const,
      };

      return buildSeoResolution(seo, {
        canonical: `${SITE_URL}${seo.path}`,
        type: 'article',
        title: seo.title,
        tags: currentCaseStudy.tags,
      });
    }

    const seo = {
      title: `${route.slug} | BlockWaveLab Case Study`,
      description: `Case study details for ${route.slug} from BlockWaveLab.`,
      path: `/case-studies/${route.slug}`,
      keywords: TARGET_KEYWORDS,
      ogType: 'article' as const,
    };

    return buildSeoResolution(seo, {
      canonical: `${SITE_URL}${seo.path}`,
      type: 'article',
      title: seo.title,
      tags: [route.slug],
    });
  }

  if (route.page in SERVICE_VARIANT_ROUTE_SEO) {
    const seo = SERVICE_VARIANT_ROUTE_SEO[route.page as keyof typeof SERVICE_VARIANT_ROUTE_SEO];
    return buildSeoResolution(seo, {
      canonical: `${SITE_URL}${seo.path}`,
      type: 'service',
      title: seo.title,
    });
  }

  if (route.page in SERVICE_PAGES_SEO) {
    const seo = SERVICE_PAGES_SEO[route.page as keyof typeof SERVICE_PAGES_SEO];
    return buildSeoResolution(seo, {
      canonical: `${SITE_URL}${seo.path}`,
      type: 'service',
      title: seo.title,
    });
  }

  if (route.page === 'services') {
    const seo = SERVICE_ROUTE_SEO[route.path] ?? SEO_BY_PAGE.services;
    return buildSeoResolution(seo, {
      canonical: `${SITE_URL}${seo.path}`,
      type: 'service',
      title: seo.title,
    });
  }

  const seo = SEO_BY_PAGE[route.page as StaticPage] ?? SEO_BY_PAGE.home;
  return buildSeoResolution(seo, {
    canonical: `${SITE_URL}${seo.path}`,
    type: seo.ogType ?? 'website',
    title: seo.title,
  });
}

export { SEO_BY_PAGE, SERVICE_ROUTE_SEO, SERVICE_VARIANT_ROUTE_SEO };