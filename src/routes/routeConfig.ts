export const SITE_URL = 'https://blockwavelab.com';

export const TARGET_KEYWORDS = [
  'crypto marketing agency',
  'web3 marketing agency',
  'crypto KOL marketing',
  'web3 influencer marketing',
].join(', ');

export type StaticPage = 'home' | 'about' | 'services' | 'cases' | 'contact' | 'blog';

export type DynamicPage =
  | 'blog-post'
  | 'blog-tag'
  | 'case-study'
  | 'crypto-kol'
  | 'token-launch'
  | 'web3-influencer'
  | 'telegram-growth'
  | 'crypto-pr'
  | 'blockchain-marketing'
  | 'crypto-marketing'
  | 'blockchain-seo'
  | 'web3-growth-marketing'
  | 'crypto-community-management'
  | 'crypto-influencer-marketing'
  | 'blockchain-pr-services'
  | 'crypto-paid-ads'
  | 'ai-blockchain-marketing';

export type PageKey = StaticPage | DynamicPage;

export type RouteState = {
  page: PageKey;
  path: string;
  slug?: string;
};

export const PATH_BY_PAGE: Record<StaticPage, string> = {
  home: '/',
  about: '/about',
  services: '/services',
  cases: '/cases',
  contact: '/contact',
  blog: '/blog',
};

export const ALIAS_ROUTES = {
  services: ['/services', '/kol-marketing', '/crypto-marketing', '/web3-marketing'],
  cryptoKol: ['/crypto-kol-marketing'],
  tokenLaunch: ['/token-launch-marketing'],
  web3Influencer: ['/web3-influencer-marketing'],
  telegramGrowth: ['/telegram-community-growth'],
  cryptoPr: ['/crypto-pr-marketing'],
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
    case '/about':
      return { page: 'about', path: '/about' };
    case '/services':
    case '/kol-marketing':
    case '/crypto-marketing':
    case '/web3-marketing':
      return { page: 'services', path: normalized };
    case '/crypto-kol-marketing':
      return { page: 'crypto-kol', path: normalized };
    case '/token-launch-marketing':
      return { page: 'token-launch', path: normalized };
    case '/web3-influencer-marketing':
      return { page: 'web3-influencer', path: normalized };
    case '/blockchain-marketing-agency':
      return { page: 'blockchain-marketing', path: normalized };
    case '/crypto-marketing-agency':
      return { page: 'crypto-marketing', path: normalized };
    case '/blockchain-seo':
      return { page: 'blockchain-seo', path: normalized };
    case '/web3-growth-marketing':
      return { page: 'web3-growth-marketing', path: normalized };
    case '/crypto-community-management':
      return { page: 'crypto-community-management', path: normalized };
    case '/crypto-influencer-marketing':
      return { page: 'crypto-influencer-marketing', path: normalized };
    case '/blockchain-pr-services':
      return { page: 'blockchain-pr-services', path: normalized };
    case '/crypto-paid-ads':
      return { page: 'crypto-paid-ads', path: normalized };
    case '/ai-blockchain-marketing':
      return { page: 'ai-blockchain-marketing', path: normalized };
    case '/telegram-community-growth':
      return { page: 'telegram-growth', path: normalized };
    case '/crypto-pr-marketing':
      return { page: 'crypto-pr', path: normalized };
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

export function getNavPage(routePage: PageKey): StaticPage {
  if (routePage === 'blog-post' || routePage === 'blog-tag') {
    return 'blog';
  }

  if (routePage === 'case-study') {
    return 'cases';
  }
  if (
    routePage === 'crypto-kol' ||
    routePage === 'token-launch' ||
    routePage === 'web3-influencer' ||
    routePage === 'telegram-growth' ||
    routePage === 'crypto-pr' ||
    routePage === 'blockchain-marketing' ||
    routePage === 'crypto-marketing' ||
    routePage === 'blockchain-seo' ||
    routePage === 'web3-growth-marketing' ||
    routePage === 'crypto-community-management' ||
    routePage === 'crypto-influencer-marketing' ||
    routePage === 'blockchain-pr-services' ||
    routePage === 'crypto-paid-ads' ||
    routePage === 'ai-blockchain-marketing'
  ) {
    return 'services';
  }

  return routePage;
}