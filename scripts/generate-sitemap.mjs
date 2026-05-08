import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import matter from 'gray-matter';

const siteUrl = 'https://blockwavelab.com';
const workspaceRoot = process.cwd();
const pagesDir = path.join(workspaceRoot, 'src', 'pages');
const mdxDir = path.join(workspaceRoot, 'src', 'content', 'blog');

const requiredPaths = ['/', '/services', '/about', '/contact', '/blog', '/case-studies'];

const explicitPageMap = {
  Home: '/',
  CaseStudies: '/case-studies',
  CryptoKolMarketing: '/crypto-kol-marketing',
  TokenLaunchMarketing: '/token-launch-marketing',
  Web3InfluencerMarketing: '/web3-influencer-marketing',
  TelegramCommunityGrowth: '/telegram-community-growth',
  CryptoPRMarketing: '/crypto-pr-marketing',
};
const ignoredPageNames = new Set(['BlogPost', 'Blog', 'BlogTag']);

function toKebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[ _]+/g, '-')
    .toLowerCase();
}

function discoverPagePaths() {
  if (!fs.existsSync(pagesDir)) return [];
  const files = fs.readdirSync(pagesDir).filter((f) => f.endsWith('.tsx'));

  return files
    .map((file) => path.parse(file).name)
    .filter((name) => !ignoredPageNames.has(name))
    .map((name) => explicitPageMap[name] ?? `/${toKebabCase(name)}`)
    .filter(Boolean);
}

function parseMdxPosts() {
  if (!fs.existsSync(mdxDir)) return { posts: [], tags: [] };
  const files = fs.readdirSync(mdxDir).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));

  const posts = [];
  const tagSet = new Set();

  for (const file of files) {
    const abs = path.join(mdxDir, file);
    try {
      const content = fs.readFileSync(abs, 'utf8');
      const parsed = matter(content);
      const fm = parsed.data || {};
      const slug = fm.slug || path.parse(file).name;
      const publishedAt = fm.publishedAt || fm.date || null;
      const updatedAt = fm.updatedAt || null;
      const tags = Array.isArray(fm.tags) ? fm.tags.map(String) : [];

      tags.forEach((t) => tagSet.add(t));

      posts.push({ file: abs, slug, publishedAt, updatedAt, tags });
    } catch (e) {
      console.warn('Failed to parse', file, e.message);
    }
  }

  return { posts, tags: Array.from(tagSet) };
}

function gitLastModISO(filePath) {
  try {
    const out = execSync(`git log -1 --format=%cI -- "${filePath}"`, { cwd: workspaceRoot, stdio: ['ignore', 'pipe', 'ignore'] });
    const date = String(out).trim();
    if (date) return date.split('T')[0];
  } catch (e) {
    // fallback to fs mtime
  }
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime.toISOString().split('T')[0];
  } catch (e) {
    return new Date().toISOString().split('T')[0];
  }
}

function buildSitemapXml(entries) {
  const urls = entries
    .map(({ loc, lastmod, priority = '0.8' }) => {
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

function writeFile(targetPath, content) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, content, 'utf8');
}

function main() {
  const discovered = discoverPagePaths();
  const { posts, tags } = parseMdxPosts();

  const pageEntries = discovered.map((p) => {
    const sourceName = p === '/' ? 'Home' : p.slice(1).split('/')[0];
    const fileName = p === '/' ? 'src/pages/Home.tsx' : `src/pages/${sourceName.charAt(0).toUpperCase() + sourceName.slice(1)}.tsx`;
    const absPath = path.join(workspaceRoot, fileName);
    const lastmod = fs.existsSync(absPath) ? gitLastModISO(absPath) : new Date().toISOString().split('T')[0];
    return { loc: `${siteUrl}${p === '/' ? '' : p}`, lastmod, priority: p === '/' ? '1.0' : '0.8' };
  });

  const requiredEntries = requiredPaths.map((p) => ({ loc: `${siteUrl}${p === '/' ? '' : p}`, lastmod: new Date().toISOString().split('T')[0], priority: p === '/' ? '1.0' : '0.8' }));

  const blogEntries = posts.map((post) => {
    const last = post.updatedAt || post.publishedAt || gitLastModISO(post.file);
    const lastmod = last ? (last.split('T')[0] || gitLastModISO(post.file)) : gitLastModISO(post.file);
    return { loc: `${siteUrl}/blog/${post.slug}`, lastmod, priority: '0.8' };
  });

  const tagEntries = tags.map((tag) => {
    const tagPath = `/blog/tag/${toKebabCase(tag)}`;
    // Use latest blog commit as lastmod for tag pages
    const lastmod = blogEntries.length ? blogEntries[0].lastmod : new Date().toISOString().split('T')[0];
    return { loc: `${siteUrl}${tagPath}`, lastmod, priority: '0.6' };
  });

  const map = new Map();
  [...requiredEntries, ...pageEntries, ...blogEntries, ...tagEntries].forEach((entry) => map.set(entry.loc, entry));
  const all = Array.from(map.values()).sort((a, b) => a.loc.localeCompare(b.loc));

  const sitemapXml = buildSitemapXml(all);
  const publicSitemapPath = path.join(workspaceRoot, 'public', 'sitemap.xml');
  writeFile(publicSitemapPath, sitemapXml);

  console.log(`Sitemap generated with ${all.length} URLs.`);
}

main();
