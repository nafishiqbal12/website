import fs from 'node:fs';
import path from 'node:path';

const siteUrl = 'https://blockwavelab.com';
const workspaceRoot = process.cwd();

const requiredPaths = ['/', '/build', '/automate', '/operate', '/grow'];

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
  const requiredEntries = requiredPaths.map((p) => ({ loc: `${siteUrl}${p === '/' ? '' : p}`, lastmod: new Date().toISOString().split('T')[0], priority: p === '/' ? '1.0' : '0.8' }));

  const map = new Map();
  requiredEntries.forEach((entry) => map.set(entry.loc, entry));
  const all = Array.from(map.values()).sort((a, b) => a.loc.localeCompare(b.loc));

  const sitemapXml = buildSitemapXml(all);
  const publicSitemapPath = path.join(workspaceRoot, 'public', 'sitemap.xml');
  writeFile(publicSitemapPath, sitemapXml);

  console.log(`Sitemap generated with ${all.length} URLs.`);
}

main();
