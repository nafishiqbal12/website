const SITE_URL = 'https://blockwavelab.com';
const OG_BASE_URL = `${SITE_URL}/og`;

const SERVICE_PATHS = new Set([
  '/build',
  '/automate',
  '/operate',
  '/grow',
]);

function toSlug(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function normalizePath(canonical) {
  try {
    const pathname = new URL(canonical, SITE_URL).pathname;
    return pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  } catch {
    return '/';
  }
}

function buildAbsoluteOgUrl(pathname) {
  return `${OG_BASE_URL}/${pathname.replace(/^\/+/, '')}`;
}

export function getBlogOgImageUrl(slug) {
  return buildAbsoluteOgUrl(`blog/${toSlug(slug)}.png`);
}

export function getTagOgImageUrl(tag) {
  return buildAbsoluteOgUrl(`tags/${toSlug(tag)}.png`);
}

export function getServiceOgImageUrl(route) {
  const slug = toSlug(route.replace(/^\//, '')) || 'build';
  return buildAbsoluteOgUrl(`services/${slug}.png`);
}

export function getCaseStudyOgImageUrl(route) {
  const slug = toSlug(route.replace(/^\//, '')) || 'case-studies';
  return buildAbsoluteOgUrl(`case-studies/${slug}.png`);
}

export function getStaticOgImageUrl(key) {
  const slug = toSlug(key);
  return buildAbsoluteOgUrl(`static/${slug}.png`);
}

export function resolveOgImageUrl({ canonical, type, title, tags = [] }) {
  const pathname = normalizePath(canonical);

  if (pathname === '/') {
    return getStaticOgImageUrl('home');
  }

  if (pathname === '/blog') {
    return getStaticOgImageUrl('blog-index');
  }

  if (pathname.startsWith('/blog/tag/')) {
    const tag = decodeURIComponent(pathname.replace('/blog/tag/', ''));
    return getTagOgImageUrl(tag);
  }

  if (pathname.startsWith('/blog/')) {
    const slug = pathname.replace('/blog/', '');
    return getBlogOgImageUrl(slug);
  }

  if (pathname === '/case-studies') {
    return getStaticOgImageUrl('case-studies');
  }

  if (pathname.startsWith('/case-studies/')) {
    return getCaseStudyOgImageUrl(pathname.replace('/case-studies/', ''));
  }

  if (SERVICE_PATHS.has(pathname)) {
    return getServiceOgImageUrl(pathname);
  }

  if (type === 'article' && title) {
    return getStaticOgImageUrl(`article-${toSlug(title)}`);
  }

  if (tags.length > 0) {
    return getStaticOgImageUrl(`tagged-${toSlug(tags[0])}`);
  }

  return getStaticOgImageUrl('default');
}

export function getOgImageAltText(title) {
  return title ? `${title} | BlockWaveLab` : 'BlockWaveLab AI automation and DevOps partner';
}

export { SITE_URL, OG_BASE_URL, toSlug, normalizePath };
