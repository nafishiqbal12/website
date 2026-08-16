export const SITE_URL = 'https://blockwavelab.com';

export const TARGET_KEYWORDS = [
  'ai automation for web3',
  'devops partner for web3 projects',
  'web3 cloud infrastructure',
  'managed devops and ai operations',
].join(', ');

export type StaticPage = 'home' | 'build' | 'automate' | 'operate' | 'grow';

export type DynamicPage =
  | 'cases'
  | 'blog'
  | 'blog-post'
  | 'blog-tag'
  | 'case-study';

export type PageKey = StaticPage | DynamicPage;

export type RouteState = {
  page: PageKey;
  path: string;
  slug?: string;
};

export const PATH_BY_PAGE: Record<StaticPage, string> = {
  home: '/',
  build: '/build',
  automate: '/automate',
  operate: '/operate',
  grow: '/grow',
};

export const ALIAS_ROUTES = {
  build: ['/services'],
  automate: ['/ai-blockchain-marketing'],
  operate: ['/managed-devops'],
  grow: ['/growth-content-community'],
  cases: ['/cases', '/case-studies'],
} as const;

export const TAG_ROUTE_PREFIX = '/blog/tag/';
export const BLOG_ROUTE_PREFIX = '/blog/';
export const CASE_STUDIES_PREFIX = '/case-studies/';

export function normalizePath(pathname: string) {
  if (!pathname || pathname === '/') {
    return '/';
  }

  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

export function resolveNavigationTarget(target: string) {
  if (target.startsWith('/')) {
    return normalizePath(target);
  }

  const aliasByTarget: Record<string, string> = {
    services: '/build',
    about: '/operate',
    contact: '/grow',
    cases: '/case-studies',
  };

  if (aliasByTarget[target]) {
    return aliasByTarget[target];
  }

  return PATH_BY_PAGE[target as StaticPage] ?? '/';
}

export function getRouteFromPath(pathname: string): RouteState {
  const normalized = normalizePath(pathname);

  if (normalized.startsWith(TAG_ROUTE_PREFIX)) {
    const tag = normalized.slice(TAG_ROUTE_PREFIX.length).trim();
    if (tag) {
      return { page: 'blog-tag', path: `${TAG_ROUTE_PREFIX}${tag}`, slug: tag };
    }
  }

  if (normalized.startsWith(BLOG_ROUTE_PREFIX) && !normalized.startsWith(TAG_ROUTE_PREFIX)) {
    const slug = normalized.slice(BLOG_ROUTE_PREFIX.length).trim();
    if (slug) {
      return { page: 'blog-post', path: `${BLOG_ROUTE_PREFIX}${slug}`, slug };
    }
  }

  if (normalized.startsWith(CASE_STUDIES_PREFIX)) {
    const slug = normalized.slice(CASE_STUDIES_PREFIX.length).trim();
    if (slug) {
      return { page: 'case-study', path: `${CASE_STUDIES_PREFIX}${slug}`, slug };
    }
  }

  switch (normalized) {
    case '/':
      return { page: 'home', path: '/' };
    case '/build':
    case '/services':
      return { page: 'build', path: '/build' };
    case '/automate':
      return { page: 'automate', path: '/automate' };
    case '/operate':
      return { page: 'operate', path: '/operate' };
    case '/grow':
      return { page: 'grow', path: '/grow' };
    case '/cases':
    case '/case-studies':
      return { page: 'cases', path: '/case-studies' };
    case '/blog':
      return { page: 'blog', path: '/blog' };
    default:
      return { page: 'home', path: '/' };
  }
}

export function getNavPage(routePage: PageKey): StaticPage {
  switch (routePage) {
    case 'blog':
    case 'blog-post':
    case 'blog-tag':
      return 'grow';
    case 'cases':
    case 'case-study':
      return 'operate';
    default:
      return routePage as StaticPage;
  }
}