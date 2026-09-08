import { getOgImageAltText, resolveOgImageUrl } from '../assets/og/routes';
import type { Post } from '../lib/blog';
import { SITE_URL, TARGET_KEYWORDS, type AuthPage, type RouteState, type StaticPage } from './routeConfig';

export type SeoConfig = {
  title: string;
  description: string;
  path: string;
  keywords: string;
  ogType?: 'website' | 'article' | 'service';
  noIndex?: boolean;
};

export type SeoResolution = {
  seo: SeoConfig;
  pageUrl: string;
  ogImage: string;
  imageAlt: string;
};

const SEO_BY_PAGE: Record<StaticPage, SeoConfig> = {
  home: {
    title: 'BlockWaveLab | AI Automation + DevOps Partner for Web3 Projects',
    description:
      'BlockWaveLab helps Web3 teams build infrastructure, automate workflows, operate production systems, and grow through structured implementation and operations support.',
    path: '/',
    keywords: TARGET_KEYWORDS,
  },
  build: {
    title: 'BUILD | DevOps and Cloud Infrastructure | BlockWaveLab',
    description:
      'BUILD by BlockWaveLab delivers DevOps and cloud infrastructure support for Web3 projects, including CI/CD hardening, deployment workflows, reliability baselines, and security-oriented setup.',
    path: '/build',
    keywords: TARGET_KEYWORDS,
    ogType: 'service',
  },
  automate: {
    title: 'AUTOMATE | AI Automation and AI Agents | BlockWaveLab',
    description:
      'AUTOMATE by BlockWaveLab delivers AI-assisted workflow automation and project-specific AI agent orchestration for Web3 operations with human-governed controls.',
    path: '/automate',
    keywords: TARGET_KEYWORDS,
    ogType: 'service',
  },
  operate: {
    title: 'OPERATE | Technical Operations and Monitoring Support | BlockWaveLab',
    description:
      'OPERATE by BlockWaveLab provides technical operations support for Web3 projects, including managed releases, incident-oriented coordination, reliability practices, and ongoing operational assistance.',
    path: '/operate',
    keywords: TARGET_KEYWORDS,
    ogType: 'service',
  },
  grow: {
    title: 'GROW | Technical Growth, Content and Community Systems | BlockWaveLab',
    description:
      'GROW by BlockWaveLab connects technical growth systems, content operations, community enablement, and delivery readiness for Web3 projects.',
    path: '/grow',
    keywords: TARGET_KEYWORDS,
    ogType: 'service',
  },
};

const SEO_BY_DYNAMIC_PAGE: Record<'cases' | 'blog', SeoConfig> = {
  cases: {
    title: 'Case Studies | BlockWaveLab',
    description:
      'Review case studies on implementation outcomes, operations improvements, and delivery execution for Web3 projects.',
    path: '/case-studies',
    keywords: TARGET_KEYWORDS,
  },
  blog: {
    title: 'BlockWaveLab Blog | Web3 DevOps and Automation Insights',
    description:
      'Read practical insights on Web3 infrastructure, AI workflow automation, production operations, and sustainable growth execution.',
    path: '/blog',
    keywords: TARGET_KEYWORDS,
  },
};

const SEO_BY_AUTH_PAGE: Record<AuthPage, SeoConfig> = {
  login: { title: 'Sign In | BlockWaveLab', description: 'Sign in to your BlockWaveLab identity profile.', path: '/login', keywords: TARGET_KEYWORDS, noIndex: true },
  signup: { title: 'Create Account | BlockWaveLab', description: 'Create a BlockWaveLab identity profile.', path: '/signup', keywords: TARGET_KEYWORDS, noIndex: true },
  'forgot-password': { title: 'Reset Password | BlockWaveLab', description: 'Request a secure BlockWaveLab password reset link.', path: '/forgot-password', keywords: TARGET_KEYWORDS, noIndex: true },
  'reset-password': { title: 'Set New Password | BlockWaveLab', description: 'Set a new password for your BlockWaveLab identity profile.', path: '/reset-password', keywords: TARGET_KEYWORDS, noIndex: true },
  profile: { title: 'Profile | BlockWaveLab', description: 'Manage your BlockWaveLab identity profile.', path: '/profile', keywords: TARGET_KEYWORDS, noIndex: true },
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
      description: `Articles and insights about ${route.slug} from BlockWaveLab focused on Web3 delivery, automation, and operations.`,
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

  if (route.page === 'cases' || route.page === 'blog') {
    const seo = SEO_BY_DYNAMIC_PAGE[route.page];
    return buildSeoResolution(seo, {
      canonical: `${SITE_URL}${seo.path}`,
      type: 'website',
      title: seo.title,
    });
  }

  if (route.page in SEO_BY_AUTH_PAGE) {
    const seo = SEO_BY_AUTH_PAGE[route.page as AuthPage];
    return buildSeoResolution(seo, {
      canonical: `${SITE_URL}${seo.path}`,
      type: 'website',
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

export { SEO_BY_PAGE, SEO_BY_DYNAMIC_PAGE, SEO_BY_AUTH_PAGE };