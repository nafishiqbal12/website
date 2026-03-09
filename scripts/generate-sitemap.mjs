import fs from 'node:fs';
import path from 'node:path';

const siteUrl = 'https://blockwavelab.com';
const workspaceRoot = process.cwd();
const pagesDir = path.join(workspaceRoot, 'src', 'pages');

// Required marketing URLs that may not always map 1:1 to page filenames.
const requiredPaths = [
  '/',
  '/about',
  '/services',
  '/kol-marketing',
  '/crypto-marketing',
  '/web3-marketing',
  '/cases',
  '/contact',
  '/blog',
];

const explicitPageMap = {
  Home: '/',
  CaseStudies: '/cases',
};

function toKebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
}

function discoverPagePaths() {
  if (!fs.existsSync(pagesDir)) {
    return [];
  }

  const files = fs.readdirSync(pagesDir);

  return files
    .filter((file) => file.endsWith('.tsx'))
    .map((file) => path.parse(file).name)
    .map((name) => explicitPageMap[name] ?? `/${toKebabCase(name)}`)
    .filter(Boolean);
}

function buildSitemapXml(paths) {
  const lastmod = new Date().toISOString().split('T')[0];

  const urls = paths
    .map((pagePath) => {
      const normalizedPath = pagePath === '/' ? '' : pagePath;
      return `  <url>\n    <loc>${siteUrl}${normalizedPath}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${pagePath === '/' ? '1.0' : '0.8'}</priority>\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function writeFile(targetPath, content) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, content, 'utf8');
}

function main() {
  const discoveredPaths = discoverPagePaths();
  const allPaths = [...new Set([...requiredPaths, ...discoveredPaths])].sort();
  const sitemapXml = buildSitemapXml(allPaths);

  const publicSitemapPath = path.join(workspaceRoot, 'public', 'sitemap.xml');
  writeFile(publicSitemapPath, sitemapXml);

  const rootSitemapPath = path.join(workspaceRoot, 'sitemap.xml');
  writeFile(rootSitemapPath, sitemapXml);

  const distDir = path.join(workspaceRoot, 'dist');
  if (fs.existsSync(distDir)) {
    const distSitemapPath = path.join(distDir, 'sitemap.xml');
    writeFile(distSitemapPath, sitemapXml);
  }

  console.log(`Sitemap generated with ${allPaths.length} URLs.`);
}

main();
