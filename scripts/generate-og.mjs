import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import sharp from 'sharp';
import { renderSvg } from '../src/assets/og/template.js';
import { toSlug } from '../src/assets/og/routes.js';

const workspaceRoot = process.cwd();
const outputRoot = path.join(workspaceRoot, 'public', 'og');
const blogDir = path.join(workspaceRoot, 'src', 'content', 'blog');
const caseStudyDir = path.join(workspaceRoot, 'src', 'content', 'case-studies');

const STATIC_IMAGES = [
  {
    file: 'static/home.png',
    variant: 'static',
    eyebrow: 'BlockWaveLab',
    title: 'Crypto Marketing Agency for Web3 Growth',
    subtitle: 'KOL campaigns, token launches, community growth, and PR built for discovery and conversion.',
    footer: 'Optimized for X, Telegram, and LinkedIn',
    badge: 'Web3 / SaaS branding',
    accent: '#29D3FF',
    secondary: '#5C7CFF',
  },
  {
    file: 'static/blog-index.png',
    variant: 'static',
    eyebrow: 'BlockWaveLab Blog',
    title: 'Crypto Marketing Insights',
    subtitle: 'Actionable playbooks for KOL campaigns, creator strategy, launch marketing, and community systems.',
    footer: 'Ideas that improve share CTR',
    badge: 'Editorial Hub',
    accent: '#36E2C3',
    secondary: '#4C7CFF',
  },
  {
    file: 'static/case-studies.png',
    variant: 'static',
    eyebrow: 'Case Studies',
    title: 'Proof, Not Promises',
    subtitle: 'Performance stories, campaign structure, and growth lessons from crypto and Web3 work.',
    footer: 'Built for trust and conversion',
    badge: 'Social Proof',
    accent: '#8CF2FF',
    secondary: '#5C7CFF',
  },
  {
    file: 'static/default.png',
    variant: 'static',
    eyebrow: 'BlockWaveLab',
    title: 'Crypto Marketing Agency',
    subtitle: 'Web3 growth systems, creator campaigns, and performance strategy for ambitious teams.',
    footer: 'Default share image',
    badge: 'Fallback',
    accent: '#29D3FF',
    secondary: '#6B8DFF',
  },
];

const SERVICE_PAGES = [
  {
    file: 'services/services.png',
    title: 'Crypto Marketing Services',
    subtitle: 'End-to-end growth systems for Web3 brands that need awareness, trust, and qualified demand.',
  },
  {
    file: 'services/crypto-kol-marketing.png',
    title: 'Crypto KOL Marketing Agency',
    subtitle: 'Trusted creator campaigns that create qualified attention for token launches and product growth.',
  },
  {
    file: 'services/token-launch-marketing.png',
    title: 'Token Launch Marketing',
    subtitle: 'Pre-launch positioning, launch-day amplification, and post-launch momentum systems.',
  },
  {
    file: 'services/web3-influencer-marketing.png',
    title: 'Web3 Influencer Marketing',
    subtitle: 'Creator-led education and distribution designed for Web3-native audiences.',
  },
  {
    file: 'services/telegram-community-growth.png',
    title: 'Telegram Community Growth',
    subtitle: 'Retention-first community systems that keep members active, informed, and engaged.',
  },
  {
    file: 'services/crypto-pr-marketing.png',
    title: 'Crypto PR Marketing',
    subtitle: 'Media coverage and narrative positioning to support launches, funding, and long-term trust.',
  },
];

async function ensureDir(filePath) {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
}

async function writePng(relativeFile, svg) {
  const filePath = path.join(outputRoot, relativeFile);
  await ensureDir(filePath);
  const buffer = Buffer.from(svg);
  await sharp(buffer).png({ compressionLevel: 9, effort: 10 }).toFile(filePath);
}

function readMdxFrontmatter(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const filePath = path.join(dir, file);
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = matter(raw);
      const frontmatter = parsed.data || {};
      const slug = toSlug(frontmatter.slug || path.parse(file).name);
      const title = String(frontmatter.title || slug);
      const description = String(frontmatter.description || '').trim();
      const publishedAt = String(frontmatter.publishedAt || frontmatter.date || '');
      const updatedAt = String(frontmatter.updatedAt || '');
      const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags.map(String) : [];
      return { filePath, slug, title, description, publishedAt, updatedAt, tags };
    });
}

function loadCaseStudyEntries(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const filePath = path.join(dir, file);
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = matter(raw);
      const frontmatter = parsed.data || {};
      const slug = toSlug(frontmatter.slug || path.parse(file).name);
      const title = String(frontmatter.title || slug);
      const description = String(frontmatter.description || '').trim();
      return { filePath, slug, title, description };
    });
}

async function generateStaticAssets() {
  for (const asset of STATIC_IMAGES) {
    const svg = renderSvg({
      eyebrow: asset.eyebrow,
      title: asset.title,
      subtitle: asset.subtitle,
      footer: asset.footer,
      badge: asset.badge,
      accent: asset.accent,
      secondary: asset.secondary,
      variant: asset.variant,
    });
    await writePng(asset.file, svg);
  }
}

async function generateServiceAssets() {
  for (const service of SERVICE_PAGES) {
    const svg = renderSvg({
      eyebrow: 'Services',
      title: service.title,
      subtitle: service.subtitle,
      footer: 'Web3 growth systems that improve CTR',
      badge: 'Service Page',
      accent: '#29D3FF',
      secondary: '#4F8CFF',
      variant: 'service',
    });
    await writePng(service.file, svg);
  }
}

async function generateBlogAssets() {
  const posts = readMdxFrontmatter(blogDir);
  const tags = new Map();

  for (const post of posts) {
    for (const tag of post.tags) {
      if (!tags.has(tag)) {
        tags.set(tag, { count: 0 });
      }
      tags.get(tag).count += 1;
    }

    const subtitle = post.description || 'Web3 growth playbook, creator strategy, and campaign analysis.';
    const footer = post.publishedAt ? `Published ${post.publishedAt}` : 'BlockWaveLab editorial';
    const svg = renderSvg({
      eyebrow: 'Blog Post',
      title: post.title,
      subtitle,
      footer,
      badge: post.tags[0] ? `Tag: ${post.tags[0]}` : 'Research Notes',
      accent: '#36E2C3',
      secondary: '#5C7CFF',
      variant: 'article',
    });
    await writePng(`blog/${post.slug}.png`, svg);
  }

  for (const [tag, data] of tags.entries()) {
    const svg = renderSvg({
      eyebrow: 'Tag Archive',
      title: tag,
      subtitle: `${data.count} curated articles and insights about ${tag}.`,
      footer: 'Curated by BlockWaveLab',
      badge: 'Tag Page',
      accent: '#8CF2FF',
      secondary: '#4F8CFF',
      variant: 'tag',
    });
    await writePng(`tags/${toSlug(tag)}.png`, svg);
  }
}

async function generateCaseStudyAssets() {
  const entries = loadCaseStudyEntries(caseStudyDir);
  for (const entry of entries) {
    const svg = renderSvg({
      eyebrow: 'Case Study',
      title: entry.title,
      subtitle: entry.description || 'Campaign structure, results, and lessons learned.',
      footer: 'BlockWaveLab case study',
      badge: 'Proof of work',
      accent: '#29D3FF',
      secondary: '#8CF2FF',
      variant: 'article',
    });
    await writePng(`case-studies/${entry.slug}.png`, svg);
  }
}

async function main() {
  fs.rmSync(outputRoot, { recursive: true, force: true });
  await fs.promises.mkdir(outputRoot, { recursive: true });

  await generateStaticAssets();
  await generateServiceAssets();
  await generateBlogAssets();
  await generateCaseStudyAssets();

  const generatedFiles = [];
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const absolute = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(absolute);
      } else if (entry.isFile()) {
        generatedFiles.push(path.relative(outputRoot, absolute));
      }
    }
  };
  walk(outputRoot);

  console.log(`Generated ${generatedFiles.length} OG images.`);
}

main().catch((error) => {
  console.error('OG generation failed:', error);
  process.exitCode = 1;
});
